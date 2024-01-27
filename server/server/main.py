from .models import Post, Comment, Like

from pathlib import Path
from typing import Sequence

import sqlmodel as sm
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel

# create tables (after importing models)
here = Path(__file__).parent.resolve()
db_url = f"sqlite:///{here.parent}/me.db"
engine = sm.create_engine(db_url, echo=True)
SQLModel.metadata.create_all(engine)

# create REST API
app = FastAPI()

# add
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/posts")
def get_posts() -> Sequence[Post]:
    with Session(engine) as session:
        posts = session.exec(sm.select(Post)).all()
        return posts


@app.get("/posts/{post_id}")
def get_post(post_id: int) -> Post:
    with Session(engine) as session:
        statement = sm.select(Post).where(Post.id == post_id)
        post = session.exec(statement).first()
        if post:
            return post
        raise HTTPException(status_code=404, detail=f"Post \"{post_id}\" not found")


@app.get("/posts/{post_id}/likes")
def get_post_likes(post_id: int) -> Sequence[Like]:
    with Session(engine) as session:
        statement = sm.select(Like).where(Like.post_id == post_id)
        likes = session.exec(statement).all()
        return likes


@app.get("/posts/{post_id}/comments")
def get_post_comments(post_id: int) -> Sequence[Comment]:
    with Session(engine) as session:
        statement = sm.select(Comment).where(Comment.post_id == post_id)
        comments = session.exec(statement).all()
        return comments


@app.get("/comments")
def get_comments() -> Sequence[Comment]:
    with Session(engine) as session:
        comments = session.exec(sm.select(Comment)).all()
        return comments


@app.get("/comments/{comment_id}")
def get_comment(comment_id: int) -> Comment:
    with Session(engine) as session:
        statement = sm.select(Comment).where(Comment.id == comment_id)
        post = session.exec(statement).first()
        if post:
            return post
        raise HTTPException(status_code=404, detail=f"Post \"{comment_id}\" not found")


@app.get("/comments/{comment_id}/likes")
def get_comment_likes(comment_id: int) -> Sequence[Like]:
    with Session(engine) as session:
        statement = sm.select(Like).where(Like.comment_id == comment_id)
        likes = session.exec(statement).all()
        return likes


@app.post("/posts")
def add_post(post: Post) -> Post:
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


@app.post("/likes")
def add_like(like: Like) -> Like:
    with Session(engine) as session:
        session.add(like)
        session.commit()
        session.refresh(like)
        return like


def start_dev_server() -> None:
    import uvicorn

    uvicorn.run("server.main:app", host="localhost", port=8000, reload=True)
