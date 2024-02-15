from .models import Post, Comment, Like, User

import json
import os
from pathlib import Path
from typing import Any, Sequence
from functools import cache

import boto3
import sqlmodel as sm
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel

# create tables (after importing models)
here = Path(__file__).parent.resolve()
db_url = f"sqlite:///{here.parent}/resume.db"
engine = sm.create_engine(db_url, echo=True)
SQLModel.metadata.create_all(engine)

# create REST API
app = FastAPI(root_path="/api")

# add CORS
env = os.environ.get("ENV") or "production"
prod = "prod" in env.lower()
allowed_origins = ["https://resume.oliver-tucher.com"] if prod else ["http://localhost:3000"]
app.add_middleware(CORSMiddleware, allow_origins=allowed_origins)

# add Host middleware
if prod:
    print("Adding TrustedHostMiddleware")
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_origins)


@cache
def get_secret(secret_id: str) -> Any:
    client = boto3.client('secretsmanager')
    secret = client.get_secret_value(SecretId=secret_id)
    return json.loads(secret['SecretString'])


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}


@app.get("/cognito")
def cognito() -> dict[str, str]:
    return get_secret('resume-cognito')  # defined in cdk/bin/cdk.ts


@app.get("/posts")
def get_posts() -> Sequence[Post]:
    with Session(engine) as session:
        posts = session.exec(sm.select(Post)).all()
        return posts


@app.post("/posts")
def add_post(post: Post) -> Post:
    print(post)
    with Session(engine) as session:
        statement = sm.select(Post).where(
          Post.title == post.title
        ).where(
          Post.content == post.content
        ).where(
          Post.user_id == post.user_id
        )
        current_post = session.exec(statement).first()
        if not current_post:
            session.add(post)
            session.commit()
            session.refresh(post)
            return post
        else:
            print("Post already exists.")
            return current_post


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


@app.delete("/posts/{post_id}/likes/{user_id}")
def delete_post_like(post_id: int, user_id: int) -> dict[str, bool]:
    with Session(engine) as session:
        statement = sm.select(Like).where(Like.post_id == post_id).where(Like.user_id == user_id)
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


@app.post("/comments")
def add_comment(comment: Comment) -> Comment:
    with Session(engine) as session:
        statement = sm.select(Comment).where(
          Comment.content == comment.content
        ).where(
          Comment.user_id == comment.user_id
        ).where(
          Comment.post_id == comment.post_id
        )
        current_comment = session.exec(statement).first()
        if not current_comment:
            session.add(comment)
            session.commit()
            session.refresh(comment)
            return comment
        else:
            print("Comment already exists.")
            return current_comment


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


@app.delete("/comments/{comment_id}/likes/{user_id}")
def delete_comment_like(comment_id: int, user_id: int) -> dict[str, bool]:
    with Session(engine) as session:
        statement = sm.select(Like).where(Like.comment_id == comment_id).where(Like.user_id == user_id)
        like = session.exec(statement).first()
        if not like:
            raise HTTPException(status_code=404, detail=f"Like for comment id {comment_id} not found")
        session.delete(like)
        session.commit()
        return {"delete": True}


@app.post("/likes")
def add_like(like: Like) -> Like:
    with Session(engine) as session:
        statement = sm.select(Like).where(
          Like.comment_id == like.comment_id
        ).where(
          Like.post_id == like.post_id
        ).where(
          Like.user_id == like.user_id
        )
        current_like = session.exec(statement).first()
        if not current_like:
            session.add(like)
            session.commit()
            session.refresh(like)
            return like
        else:
            print("Like already exists.")
            return current_like


@app.get("/users")
def get_users(email: str | None = None) -> Sequence[User]:
    with Session(engine) as session:
        statement = sm.select(User)
        if email:
            statement = statement.where(User.email == email)
        users = session.exec(statement).all()
        if not users:
            raise HTTPException(status_code=404, detail=f"Users not found with email \"{email}\"")
        return users


@app.get("/users/{user_id}")
def get_user(user_id: int) -> User:
    with Session(engine) as session:
        statement = sm.select(User).where(User.id == user_id)
        user = session.exec(statement).first()
        if not user:
            raise HTTPException(status_code=404, detail=f"Post \"{user_id}\" not found")
        return user


@app.post("/users")
def add_user(user: User) -> User:
    with Session(engine) as session:
        statement = sm.select(User).where(User.email == user.email)
        current_user = session.exec(statement).first()
        if not current_user:
            session.add(user)
            session.commit()
            session.refresh(user)
            return user
        else:
            print("User already exists.")
            return current_user


def main() -> None:
    port = os.environ.get("PORT") or "8000"
    uvicorn.run("server.main:app", host="0.0.0.0", port=int(port), proxy_headers=True, reload=True)
