from typing import Optional

from pydantic import BaseModel, Field


class MetricEventBody(BaseModel):
    type: str = Field(min_length=1, max_length=60)
    path: Optional[str] = Field(default=None, max_length=300)
    referrer: Optional[str] = Field(default=None, max_length=300)
    country: Optional[str] = Field(default=None, max_length=2)


class MetricsRangeQuery(BaseModel):
    days: int = Field(default=30, ge=1, le=365)


class ActivityLogQuery(BaseModel):
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=50, ge=1, le=200)
