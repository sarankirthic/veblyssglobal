"""Cloudflare R2 upload + image processing — the media pipeline from
ARCHITECTURE.md §7 (Sharp → Pillow, S3-compatible R2 client via boto3).
"""
import io
import uuid

import boto3
from flask import current_app
from PIL import Image

MAX_DIMENSION = 2400


def _r2_client():
    cfg = current_app.config
    return boto3.client(
        "s3",
        endpoint_url=f"https://{cfg['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
        aws_access_key_id=cfg["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=cfg["R2_SECRET_ACCESS_KEY"],
        region_name="auto",
    )


def _resize_and_encode_webp(raw_bytes: bytes) -> bytes:
    with Image.open(io.BytesIO(raw_bytes)) as img:
        img = img.convert("RGB") if img.mode in ("P", "RGBA") else img
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))
        out = io.BytesIO()
        img.save(out, format="WEBP", quality=82, method=6)
        return out.getvalue()


def upload_image(raw_bytes: bytes, filename_hint: str, folder: str = "products") -> dict:
    """Process an uploaded image and store it in R2. Returns public URL + key."""
    cfg = current_app.config
    key = f"{folder}/{uuid.uuid4().hex}.webp"

    processed = _resize_and_encode_webp(raw_bytes)

    client = _r2_client()
    client.put_object(
        Bucket=cfg["R2_BUCKET_NAME"],
        Key=key,
        Body=processed,
        ContentType="image/webp",
        CacheControl="public, max-age=31536000, immutable",
    )

    base_url = cfg["R2_PUBLIC_BASE_URL"].rstrip("/")
    return {"key": key, "url": f"{base_url}/{key}", "size": len(processed)}


def delete_image(key: str) -> None:
    cfg = current_app.config
    client = _r2_client()
    client.delete_object(Bucket=cfg["R2_BUCKET_NAME"], Key=key)
