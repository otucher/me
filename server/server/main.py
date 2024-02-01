from .models import Post, Comment, Like

import os
from pathlib import Path
from typing import Sequence

import sqlmodel as sm
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel

# create tables (after importing models)
here = Path(__file__).parent.resolve()
db_url = f"sqlite:///{here.parent}/resume.db"
engine = sm.create_engine(db_url, echo=True)
SQLModel.metadata.create_all(engine)

# create REST API at /api
app = FastAPI(root_path="/api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
      "http://localhost:3000",
      "https://resume.oliver-tucher.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}


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
        if not post:
            raise HTTPException(status_code=404, detail=f"Post \"{post_id}\" not found")
        return post


@app.get("/posts/{post_id}/likes")
def get_post_likes(post_id: int) -> Sequence[Like]:
    with Session(engine) as session:
        statement = sm.select(Like).where(Like.post_id == post_id)
        likes = session.exec(statement).all()
        return likes


@app.delete("/posts/{post_id}/likes/{user}")
def delete_post_like(post_id: int, user: str) -> dict[str, bool]:
    with Session(engine) as session:
        statement = sm.select(Like).where(Like.post_id == post_id).where(Like.user == user)
        like = session.exec(statement).first()
        if not like:
            raise HTTPException(status_code=404, detail="Like for user post \"{post_id}\" and \"{user}\" not found")
        session.delete(like)
        session.commit()
        return {"delete": True}


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
        if not post:
            raise HTTPException(status_code=404, detail=f"Post \"{comment_id}\" not found")
        return post


@app.delete("/comments/{comment_id}")
def delete_comment(comment_id: int) -> dict[str, bool]:
    with Session(engine) as session:
        comment = session.get(Comment, comment_id)
        if not comment:
            raise HTTPException(status_code=404, detail=f"Comment with id {comment_id} not found")
        session.delete(comment)

        # delete all child likes
        statement = sm.select(Like).where(Like.comment_id == comment_id)
        likes = session.exec(statement)
        for like in likes:
            session.delete(like)

        session.commit()
        return {"delete": True}


@app.get("/comments/{comment_id}/likes")
def get_comment_likes(comment_id: int) -> Sequence[Like]:
    with Session(engine) as session:
        statement = sm.select(Like).where(Like.comment_id == comment_id)
        likes = session.exec(statement).all()
        return likes


@app.delete("/comments/{comment_id}/likes/{user}")
def delete_comment_like(comment_id: int, user: str) -> dict[str, bool]:
    with Session(engine) as session:
        statement = sm.select(Like).where(Like.comment_id == comment_id).where(Like.user == user)
        like = session.exec(statement).first()
        if not like:
            raise HTTPException(status_code=404, detail=f"Like for comment id {comment_id} not found")
        session.delete(like)
        session.commit()
        return {"delete": True}


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


def main() -> None:
    port = os.environ.get("PORT") or "8000"
    uvicorn.run("server.main:app", host="localhost", port=int(port), proxy_headers=True, reload=True)
