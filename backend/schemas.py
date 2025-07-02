from pydantic import BaseModel
from typing import List
from datetime import datetime

class NoteBase(BaseModel):
    title: str
    content: str

class NoteCreate(NoteBase):
    pass

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    created_at: datetime
    user_id: int
    note_id: int

    class Config:
        orm_mode = True

class Note(NoteBase):
    id: int
    created_at: datetime
    owner_id: int
    comments: list[Comment] = []

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    status: str = ""
    avatar_url: str = ""

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_admin: int
    notes: List[Note] = []

    class Config:
        orm_mode = True 