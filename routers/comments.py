# router_comments.py

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_db
from datetime import datetime

router = APIRouter()


@router.post("/comments/add")
async def add_comment(request: Request, db: Session = Depends(get_db)):
    """
    Inserta un nuevo comentario en la tabla `comments`, y luego añade puntos al usuario:
      - +2 puntos si tiene activo el beneficio "Doble de puntos"
      - +1 punto en caso contrario
    """
    try:
        body = await request.json()
        content = body.get("content")
        user_id = body.get("user_id")
        thread_id = body.get("thread_id")
        if not content or not user_id or not thread_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Faltan campos obligatorios")
        
        # 1) Insertar el comentario y obtener su ID
        insert_result = db.execute(
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
        new_id = insert_result.fetchone()[0]
        
        # 2) Comprobar si el usuario tiene el beneficio "Doble de puntos" activo
        #    Se asume que la columna `start_date` y `end_date` están en formato TIMESTAMP/DATE
        now = datetime.utcnow()
        benefit_row = db.execute(
            text('''
                SELECT id
                FROM benefits
                WHERE user_id = :user_id
                  AND name = 'Doble de puntos'
                  AND start_date <= :ahora
                  AND end_date   >= :ahora
            '''),
            {
                "user_id": user_id,
                "ahora": now
            }
        ).fetchone()
        
        # 3) Calcular cuántos puntos sumar
        points_to_add = 2 if benefit_row else 1
        
        # 4) Actualizar puntos del usuario
        db.execute(
            text('''
                UPDATE users
                SET score = COALESCE(score, 0) + :pts
                WHERE id = :user_id
            '''),
            {
                "pts": points_to_add,
                "user_id": user_id
            }
        )
        
        # 5) Commit de toda la transacción (comentario + puntos)
        db.commit()
        
        return {
            "message": "Comentario añadido",
            "comment_id": new_id,
            "points_added": points_to_add
        }

    except HTTPException:
        # Si lanzamos un HTTPException intencional (por falta de datos), devolvemos directamente
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error al insertar comentario y actualizar puntos: {str(e)}")


@router.post("/comments/replie")
async def post_reply(request: Request, db: Session = Depends(get_db)):
    """
    Inserta una respuesta a comentario (comment_id != 0), y añade puntos al usuario:
      - +2 puntos si tiene activo el beneficio "Doble de puntos"
      - +1 punto en caso contrario
    """
    try:
        body = await request.json()
        content = body.get("content")
        user_id = body.get("user_id")
        thread_id = body.get("thread_id")
        parent_comment_id = body.get("comment_id")
        if not content or not user_id or not thread_id or not parent_comment_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Faltan campos obligatorios")

        # 1) Insertar la respuesta y obtener su ID
        insert_result = db.execute(
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
        new_id = insert_result.fetchone()[0]

        # 2) Comprobar si el usuario tiene el beneficio "Doble de puntos" activo
        now = datetime.utcnow()
        benefit_row = db.execute(
            text('''
                SELECT id
                FROM benefits
                WHERE user_id = :user_id
                  AND name = 'Doble de puntos'
                  AND start_date <= :ahora
                  AND end_date   >= :ahora
            '''),
            {
                "user_id": user_id,
                "ahora": now
            }
        ).fetchone()

        # 3) Calcular cuántos puntos sumar
        points_to_add = 2 if benefit_row else 1

        # 4) Actualizar puntos del usuario
        db.execute(
            text('''
                UPDATE users
                SET score = COALESCE(score, 0) + :pts
                WHERE id = :user_id
            '''),
            {
                "pts": points_to_add,
                "user_id": user_id
            }
        )

        # 5) Commit de toda la transacción
        db.commit()

        return {
            "message": "Respuesta añadida",
            "reply_id": new_id,
            "points_added": points_to_add
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error al insertar respuesta y actualizar puntos: {str(e)}")


@router.get("/comments/replies")
async def get_replies(comment_id: int, db: Session = Depends(get_db)):
    try:
        # No modificamos esta parte; simplemente devolvemos las respuestas
        result = db.execute(
            text('''
                SELECT comments.id,
                       comments.likes,
                       comments.dislikes,
                       comments.content,
                       comments.date,
                       comments.user_id,
                       users.username,
                       users.img_link
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
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error al obtener respuestas: {str(e)}")


@router.get("/comments/list")
def list_comments(thread_id: int, db: Session = Depends(get_db)):
    try:
        # No modificamos esta parte; devolvemos la lista de comentarios principales
        result = db.execute(
            text('''
                SELECT comments.id,
                       comments.content,
                       comments.date,
                       users.username,
                       users.img_link,
                       comments.user_id
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
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error al obtener comentarios: {str(e)}")


@router.post("/comments/like")
async def like_comment(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        comment_id = body.get("comment_id")
        if not comment_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Falta el ID del comentario")

        db.execute(
            text('''
                UPDATE comments
                SET likes = COALESCE(likes, 0) + 1
                WHERE id = :comment_id
            '''), {"comment_id": comment_id}
        )
        db.commit()
        return {"message": "Like añadido correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error al dar like: {str(e)}")


@router.post("/comments/dislike")
async def dislike_comment(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        comment_id = body.get("comment_id")
        if not comment_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Falta el ID del comentario")

        db.execute(
            text('''
                UPDATE comments
                SET dislikes = COALESCE(dislikes, 0) + 1
                WHERE id = :comment_id
            '''), {"comment_id": comment_id}
        )
        db.commit()
        return {"message": "Dislike añadido correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error al dar dislike: {str(e)}")
