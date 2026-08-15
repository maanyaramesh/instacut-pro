import io
from PIL import Image, ImageFilter, ImageDraw
from rembg import remove, new_session

# "isnet-general-use" gives noticeably cleaner edges than the default u2net
# model, especially on hair/fur, and is still free + runs on CPU.
_session = new_session("isnet-general-use")


def cut_out(image_bytes: bytes) -> Image.Image:
    """Returns an RGBA PIL Image with the background removed."""
    result_bytes = remove(image_bytes, session=_session)
    return Image.open(io.BytesIO(result_bytes)).convert("RGBA")


def _linear_gradient(size, color_a, color_b):
    w, h = size
    base = Image.new("RGB", (1, h), color_a)
    top = Image.new("RGB", (1, h), color_b)
    mask = Image.linear_gradient("L").resize((1, h))
    grad = Image.composite(top, base, mask)
    return grad.resize((w, h))


def compose(
    cutout: Image.Image,
    mode: str = "transparent",
    color: str = "#FFFFFF",
    gradient_from: str = "#1F8A70",
    gradient_to: str = "#0B3D2E",
    original: Image.Image | None = None,
    blur_radius: int = 24,
) -> Image.Image:
    """Places the cutout onto the requested background style."""
    size = cutout.size

    if mode == "transparent":
        return cutout

    if mode == "color":
        bg = Image.new("RGBA", size, color)
    elif mode == "gradient":
        bg = _linear_gradient(size, gradient_from, gradient_to).convert("RGBA")
    elif mode == "blur":
        if original is None:
            raise ValueError("original image required for blur mode")
        bg = original.convert("RGBA").resize(size).filter(
            ImageFilter.GaussianBlur(blur_radius)
        )
    else:
        raise ValueError(f"unknown mode: {mode}")

    bg.paste(cutout, (0, 0), cutout)
    return bg.convert("RGB") if mode != "transparent" else bg


def to_png_bytes(img: Image.Image) -> bytes:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
