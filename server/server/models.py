from datetime import datetime

from typing import Optional
from sqlmodel import SQLModel, Field, Relationship  # type: ignore

class Post(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    content: str
    user: str
    timestamp: datetime = Field(default=datetime.now())
    comments: list['Comment'] = Relationship(back_populates="post")
    likes: list['Like'] = Relationship(back_populates="post")


class Comment(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    content: str
    user: str
    timestamp: datetime = Field(default=datetime.now())
    post_id: int = Field(foreign_key="post.id")
    post: 'Post' = Relationship(back_populates="comments")
    likes: list['Like'] = Relationship(back_populates="comment")


class Like(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user: str
    timestamp: datetime = Field(default=datetime.now())
    comment_id: int | None = Field(default=None, foreign_key="comment.id")
    comment: Optional['Comment']  = Relationship(back_populates="likes")
    post_id: int | None = Field(default=None, foreign_key="post.id")
    post: Optional['Post'] = Relationship(back_populates="likes")
