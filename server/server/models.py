from datetime import datetime

from sqlmodel import SQLModel, Field  # type: ignore


class Post(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    content: str
    user: str
    timestamp: datetime = Field(default=datetime.now())


class Comment(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    content: str
    user: str
    timestamp: datetime = Field(default=datetime.now())
    post_id: int = Field(foreign_key="post.id")


class Like(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user: str
    timestamp: datetime = Field(default=datetime.now())
    comment_id: int | None = Field(default=None, foreign_key="comment.id")
    post_id: int | None = Field(default=None, foreign_key="post.id")
