from datetime import datetime

from sqlmodel import SQLModel, Field  # type: ignore


class Post(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default=datetime.now())
    title: str
    content: str
    user_id: int | None = Field(default=None, foreign_key="user.id")


class Comment(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default=datetime.now())
    content: str
    user_id: int | None = Field(default=None, foreign_key="user.id")
    post_id: int = Field(foreign_key="post.id")


class Like(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default=datetime.now())
    user_id: int | None = Field(default=None, foreign_key="user.id")
    comment_id: int | None = Field(default=None, foreign_key="comment.id")
    post_id: int | None = Field(default=None, foreign_key="post.id")


# TODO: this creates a copy of data already stored in cognito user pool ...
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default=datetime.now())
    email: str
