from typing import Any

from pydantic import BaseModel


class SettingPath(BaseModel):
    key: str


class SettingBody(BaseModel):
    value: Any
