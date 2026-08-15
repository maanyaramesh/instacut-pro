# InstaCut Pro
**Cut it out. Drop it anywhere.**
InstaCut Pro is an AI photo studio for removing image backgrounds, replacing them with different styles, and processing multiple images at once.
I built this as a more complete version of my earlier InstaCut project. Instead of keeping it as a simple background-removal demo, I wanted to turn it into something closer to an actual product with authentication, a gallery, batch processing, and API access.
## Features
- AI-powered background removal
- Transparent PNG output
- Solid color backgrounds
- Gradient backgrounds
- Blurred original backgrounds
- Batch processing for up to 20 images
- Before/after preview
- Personal gallery for previous results
- User authentication
- API key for programmatic access
- Usage credits for each account
- Responsive interface
## Tech Stack
### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- JavaScript
### Backend
- Python
- FastAPI
- rembg
- SQLite
- JWT Authentication
## How It Works
1. Upload an image from the Studio.
2. The backend processes the image using `rembg`.
3. Choose how you want to handle the background.
4. Preview the result.
5. Download the image or save it to your gallery.
For multiple images, batch processing can be used to process up to 20 images at once.
## Running Locally
### 1. Clone the repository
```bash
git clone https://github.com/maanyaramesh/instacut-pro.git
cd instacut-pro

2. Start the backend

cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000

The backend will run at:

http://localhost:8000

You can check the API using:

http://localhost:8000/health

The first image processed may take a little longer because the rembg model needs to be downloaded and cached locally.

3. Start the frontend

Open another terminal:

cd frontend
npm install
cp .env.example .env
npm run dev

The frontend will run at:

http://localhost:5173

Make sure the frontend .env contains:

VITE_API_URL=http://localhost:8000

Project Structure

instacut-pro/
│
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── image_processing.py
│   ├── models.py
│   ├── schemas.py
│   ├── render.yaml
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── AuthContext.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

API

InstaCut Pro also provides an API for programmatic background removal.

After logging in, each account gets an API key that can be used to access the background-removal endpoint.

Example:

curl -X POST https://your-backend.onrender.com/v1/remove-bg \
  -H "X-API-Key: YOUR_API_KEY" \
  -F "file=@photo.jpg" \
  -F "mode=transparent" \
  --output result.png

Deployment

The frontend can be deployed on Vercel and the backend on Render.

Frontend

Set the following environment variable:

VITE_API_URL=<your-render-backend-url>

Backend

Configure CORS to allow requests from the deployed frontend.

The backend also includes a render.yaml configuration for deployment.

Current Limitations

This is currently a personal/portfolio project, so there are a few things that could be improved for a production setup:

* Background removal runs on CPU and can take a few seconds.
* SQLite is currently used as the database.
* Uploaded files are stored on the backend’s local storage.
* Credits are currently implemented as a simple usage counter.
* There is no payment system yet.

What’s Next

Some things I’d like to work on next:

* Better image editing controls
* More background effects
* Faster image processing
* Cloud storage for uploaded images
* PostgreSQL for production
* More API options
* Proper credit and payment system
* Better mobile experience

Why I Built This

I wanted to go beyond a basic image-processing demo and build something that felt more like an actual product.

This project gave me the opportunity to work across both frontend and backend while learning more about image processing, authentication, API design, database handling, and deployment.

Author

Maanya Ramesh

GitHub: ⁠@maanyaramesh
