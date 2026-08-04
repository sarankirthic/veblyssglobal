from typing import Optional

from pydantic import BaseModel, Field


class AlbumBody(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    slug: str = Field(min_length=1, max_length=180, pattern=r"^[a-z0-9-]+$")
    displayOrder: int = 0


class AlbumPath(BaseModel):
    album_id: str


class ImageBody(BaseModel):
    url: str = Field(min_length=1, max_length=500)
    altText: Optional[str] = Field(default=None, max_length=300)
    order: int = 0


class ImagePath(BaseModel):
    album_id: str
    image_id: str


class ReorderBody(BaseModel):
    imageIds: list[str]
