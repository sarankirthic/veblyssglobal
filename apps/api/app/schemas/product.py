from typing import Optional

from pydantic import BaseModel, Field


class SpecRow(BaseModel):
    key: str = Field(max_length=60)
    value: str = Field(max_length=300)


class CategoryBody(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    slug: str = Field(min_length=1, max_length=140, pattern=r"^[a-z0-9-]+$")
    description: Optional[str] = None
    originRegion: Optional[str] = Field(default=None, max_length=120)
    displayOrder: int = 0


class CategoryPath(BaseModel):
    category_id: str


class ProductBody(BaseModel):
    categoryId: str
    name: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=220, pattern=r"^[a-z0-9-]+$")
    shortDescription: Optional[str] = Field(default=None, max_length=400)
    description: Optional[str] = None
    materials: Optional[str] = Field(default=None, max_length=300)
    dimensions: Optional[str] = Field(default=None, max_length=120)
    moq: Optional[str] = Field(default=None, max_length=60)
    packaging: Optional[str] = Field(default=None, max_length=200)
    leadTime: Optional[str] = Field(default=None, max_length=120)
    priceRange: Optional[str] = Field(default=None, max_length=120)
    specs: list[SpecRow] = Field(default_factory=list)
    images: list[str] = Field(default_factory=list)
    featured: bool = False
    isPublished: bool = True


class ProductPath(BaseModel):
    product_id: str


class ProductQuery(BaseModel):
    category: Optional[str] = None
    featured: Optional[bool] = None
    published_only: bool = True
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=24, ge=1, le=100)
