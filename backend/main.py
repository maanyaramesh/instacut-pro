import io
import os
import zipfile
from typing import List

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from PIL import Image

from database import Base, engine, get_db
import models
import schemas
import auth
import image_processing as ip

Base.metadata.create_all(bind=engine)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="InstaCut Pro API", version="1.0.0")

# Allow the frontend dev server + your deployed frontend domain.
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ---------- auth ----------

@app.post("/auth/register", response_model=schemas.Token)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == payload.email).first():
        raise HTTPException(400, "Email already registered")
    user = models.User(
        email=payload.email,
        hashed_password=auth.hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = auth.create_access_token(user.id)
    return schemas.Token(access_token=token, user=user)


@app.post("/auth/login", response_model=schemas.Token)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not auth.verify_password(payload.password, user.hashed_password):
        raise HTTPException(401, "Invalid email or password")
    token = auth.create_access_token(user.id)
    return schemas.Token(access_token=token, user=user)


@app.get("/me", response_model=schemas.UserOut)
def me(user: models.User = Depends(auth.get_current_user)):
    return user


# ---------- core processing ----------

def _run_job(db, user, file_bytes, filename, mode, color, gradient_from, gradient_to, blur_radius):
    if user.credits <= 0:
        raise HTTPException(402, "Out of credits")

    original = Image.open(io.BytesIO(file_bytes)).convert("RGBA")
    cutout = ip.cut_out(file_bytes)
    result = ip.compose(
        cutout,
        mode=mode,
        color=color,
        gradient_from=gradient_from,
        gradient_to=gradient_to,
        original=original,
        blur_radius=blur_radius,
    )
    out_bytes = ip.to_png_bytes(result)

    job_id = models.gen_id()
    out_path = os.path.join(UPLOAD_DIR, f"{job_id}.png")
    with open(out_path, "wb") as f:
        f.write(out_bytes)
    job = models.ImageJob(
        id=job_id,
        owner_id=user.id,
        original_filename=filename,
        mode=mode,
        output_path=f"{job_id}.png",
    )

    user.credits -= 1
    db.add(job)
    db.add(user)
    db.commit()
    db.refresh(job)
    return job, out_bytes


@app.post("/process", response_model=schemas.JobOut)
async def process_image(
    file: UploadFile = File(...),
    mode: str = Form("transparent"),
    color: str = Form("#FFFFFF"),
    gradient_from: str = Form("#1F8A70"),
    gradient_to: str = Form("#0B3D2E"),
    blur_radius: int = Form(24),
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.get_current_user),
):
    file_bytes = await file.read()
    job, _ = _run_job(
        db, user, file_bytes, file.filename, mode, color, gradient_from, gradient_to, blur_radius
    )
    return job


@app.post("/process/batch")
async def process_batch(
    files: List[UploadFile] = File(...),
    mode: str = Form("transparent"),
    color: str = Form("#FFFFFF"),
    gradient_from: str = Form("#1F8A70"),
    gradient_to: str = Form("#0B3D2E"),
    blur_radius: int = Form(24),
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.get_current_user),
):
    if len(files) > 20:
        raise HTTPException(400, "Max 20 images per batch")

    zip_buf = io.BytesIO()
    with zipfile.ZipFile(zip_buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            file_bytes = await f.read()
            job, out_bytes = _run_job(
                db, user, file_bytes, f.filename, mode, color, gradient_from, gradient_to, blur_radius
            )
            zf.writestr(f"{job.id}.png", out_bytes)

    zip_buf.seek(0)
    return StreamingResponse(
        zip_buf,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=instacut-batch.zip"},
    )


@app.get("/gallery", response_model=List[schemas.JobOut])
def gallery(
    db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)
):
    return (
        db.query(models.ImageJob)
        .filter(models.ImageJob.owner_id == user.id)
        .order_by(models.ImageJob.created_at.desc())
        .all()
    )


# ---------- public API (protected by X-API-Key, for developers) ----------

@app.post("/v1/remove-bg")
async def api_remove_bg(
    file: UploadFile = File(...),
    mode: str = Form("transparent"),
    color: str = Form("#FFFFFF"),
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.get_user_from_api_key),
):
    file_bytes = await file.read()
    job, out_bytes = _run_job(
        db, user, file_bytes, file.filename, mode, color, "#1F8A70", "#0B3D2E", 24
    )
    return StreamingResponse(io.BytesIO(out_bytes), media_type="image/png")


@app.get("/health")
def health():
    return {"status": "ok"}
