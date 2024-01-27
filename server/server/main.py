from .models import Post, Comment, CommentLike, PostLike

from pathlib import Path
from typing import Sequence

import sqlmodel as sm
from fastapi import FastAPI
from sqlmodel import Session, SQLModel

# create tables (after importing models)
here = Path(__file__).parent.resolve()
db_url = f"sqlite:///{here.parent}/me.db"
engine = sm.create_engine(db_url, echo=True)
SQLModel.metadata.create_all(engine)

# create REST API
app = FastAPI()


@app.get("/posts")
def get_posts() -> Sequence[Post]:
    with Session(engine) as session:
        posts = session.exec(sm.select(Post)).all()
        return posts


@app.post("/posts")
def create_post(post: Post) -> Post:
    with Session(engine) as session:
        session.add(post)
        session.commit()
        session.refresh(post)
        return post


@app.post("/comments")
def add_comment(comment: Comment) -> Comment:
    with Session(engine) as session:
        session.add(comment)
        session.commit()
        session.refresh(comment)
        return comment


@app.post("/comment-likes")
def add_comment_like(comment_like: CommentLike) -> CommentLike:
    with Session(engine) as session:
        session.add(comment_like)
        session.commit()
        session.refresh(comment_like)
        return comment_like


@app.post("/post-likes")
def add_post_like(post_like: PostLike) -> PostLike:
    with Session(engine) as session:
        session.add(post_like)
        session.commit()
        session.refresh(post_like)
        return post_like


def _start_dev_server() -> None:
    import uvicorn

    uvicorn.run("server.main:app", host="localhost", port=8000, reload=True)
