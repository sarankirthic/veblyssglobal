from typing import Annotated, Optional

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
    heroHeadline: Optional[str] = Field(default=None, max_length=200)
    whyChoose: list[Annotated[str, Field(max_length=300)]] = Field(default_factory=list, max_length=20)
    guarantee: Optional[str] = Field(default=None, max_length=500)
    idealFor: list[Annotated[str, Field(max_length=80)]] = Field(default_factory=list, max_length=20)


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
    showInGallery: bool = False
    heroHeadline: Optional[str] = Field(default=None, max_length=200)
    whyChoose: list[Annotated[str, Field(max_length=300)]] = Field(default_factory=list, max_length=20)
    guarantee: Optional[str] = Field(default=None, max_length=500)
    idealFor: list[Annotated[str, Field(max_length=80)]] = Field(default_factory=list, max_length=20)


class ProductPath(BaseModel):
    product_id: str


class ProductQuery(BaseModel):
    category: Optional[str] = None
    slug: Optional[str] = None
    featured: Optional[bool] = None
    show_in_gallery: Optional[bool] = None
    published_only: bool = True
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=24, ge=1, le=100)
