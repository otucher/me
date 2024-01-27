from datetime import datetime

from sqlmodel import SQLModel, Field, Relationship


class Post(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    content: str
    user: str
    timestamp: datetime = Field(default=datetime.now())
    comments: list['Comment'] = Relationship(back_populates="post")
    likes: list['PostLike'] = Relationship(back_populates="post")


class PostLike(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user: str
    timestamp: datetime = Field(default=datetime.now())
    post_id: int = Field(foreign_key="post.id")
    post: 'Post'  = Relationship(back_populates="likes")


class Comment(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    content: str
    user: str
    timestamp: datetime = Field(default=datetime.now())
    post_id: int = Field(foreign_key="post.id")
    post: 'Post' = Relationship(back_populates="comments")
    likes: list['CommentLike'] = Relationship(back_populates="post_comment")


class CommentLike(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user: str
    timestamp: datetime = Field(default=datetime.now())
    comment_id: int = Field(foreign_key="comment.id")
    post_comment: 'Comment' = Relationship(back_populates="likes")
