from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_db

router = APIRouter()

@router.post("/comments/add")
async def add_comment(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        content = body.get("content")
        user_id = body.get("user_id")
        thread_id = body.get("thread_id")
        if not content or not user_id or not thread_id:
            raise HTTPException(status_code=400, detail="Faltan campos obligatorios")
        result = db.execute(
            text('''
                INSERT INTO comments (content, user_id, thread_id)
                VALUES (:content, :user_id, :thread_id)
                RETURNING id
            '''),
            {
                "content": content,
                "user_id": user_id,
                "thread_id": thread_id,
            }
        )
        db.commit()
        new_id = result.fetchone()[0]
        return {"message": "Comentario añadido", "comment_id": new_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al insertar comentario: {str(e)}")


@router.post("/comments/replie")
async def post_reply(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        content = body.get("content")
        user_id = body.get("user_id")
        thread_id = body.get("thread_id")
        parent_comment_id = body.get("comment_id")

        if not content or not user_id or not thread_id or not parent_comment_id:
            raise HTTPException(status_code=400, detail="Faltan campos obligatorios")

        result = db.execute(
            text('''
                INSERT INTO comments (content, user_id, thread_id, comment_id)
                VALUES (:content, :user_id, :thread_id, :comment_id)
                RETURNING id
            '''),
            {
                "content": content,
                "user_id": user_id,
                "thread_id": thread_id,
                "comment_id": parent_comment_id,
            }
        )
        db.commit()
        new_id = result.fetchone()[0]
        return {"message": "Respuesta añadida", "comment_id": new_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al insertar respuesta: {str(e)}")




@router.get("/comments/replies")
async def get_replies(comment_id: int, db: Session = Depends(get_db)):
    try:
        print("El comment id llega correctamente al servidor: ", comment_id)
        result = db.execute(
            text('''
                SELECT comments.id, comments.likes, comments.dislikes, comments.content, comments.date,
                       comments.user_id, users.username, users.img_link
                FROM comments
                JOIN users ON comments.user_id = users.id
                WHERE comments.comment_id = :comment_id
                ORDER BY comments.date ASC
            '''), {"comment_id": comment_id}
        )
        replies = [
            {
                "id": row.id,
                "likes": row.likes,
                "dislikes": row.dislikes,
                "content": row.content,
                "date": row.date,
                "user_id": row.user_id,
                "username": row.username,
                "img_link": row.img_link
            }
            for row in result
        ]
        return replies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener respuestas: {str(e)}")


@router.get("/comments/list")
def list_comments(thread_id: int, db: Session = Depends(get_db)):
    try:
        result = db.execute(
            text('''
                SELECT comments.id, comments.content, comments.date,
                       users.username, users.img_link, comments.user_id
                FROM comments
                JOIN users ON users.id = comments.user_id
                WHERE comments.thread_id = :thread_id
                 AND comments.comment_id = 0
                ORDER BY comments.date DESC
            '''),
            {"thread_id": thread_id}
        )
        comments = [
            {
                "id": row.id,
                "content": row.content,
                "date": row.date,
                "user_id": row.user_id,
                "username": row.username,
                "img_link": row.img_link
            }
            for row in result
        ]
        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener comentarios: {str(e)}")



@router.post("/comments/like")
async def like_comment(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        comment_id = body.get("comment_id")

        if not comment_id:
            raise HTTPException(status_code=400, detail="Falta el ID del comentario")

        db.execute(
            text('''
                UPDATE comments
                SET likes = COALESCE(likes, 0) + 1
                WHERE id = :comment_id
            '''), {"comment_id": comment_id}
        )
        db.commit()
        return {"message": "Like añadido correctamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al dar like: {str(e)}")


@router.post("/comments/dislike")
async def dislike_comment(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        comment_id = body.get("comment_id")

        if not comment_id:
            raise HTTPException(status_code=400, detail="Falta el ID del comentario")

        db.execute(
            text('''
                UPDATE comments
                SET dislikes = COALESCE(dislikes, 0) + 1
                WHERE id = :comment_id
            '''), {"comment_id": comment_id}
        )
        db.commit()
        return {"message": "Dislike añadido correctamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al dar dislike: {str(e)}")
