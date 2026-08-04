from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class ContactSubmissionBody(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    country: Optional[str] = Field(default=None, max_length=120)
    interest: Optional[str] = Field(default=None, max_length=200)
    message: str = Field(min_length=1, max_length=4000)


class ContactQuery(BaseModel):
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=25, ge=1, le=100)
