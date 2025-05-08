from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db import get_db

router = APIRouter()

class UserRanking(BaseModel):
    fullname: str
    username: str
    email: str
    img_link: str = None
    reputation: int = 0
    score: int = 0

@router.get("/ranking", response_model=list[UserRanking])
async def get_ranking(db: Session = Depends(get_db)):
    result = db.execute(
        text('''
            SELECT "fullname", "username", "email", "img_link", "reputation", "score"
            FROM "users"
            ORDER BY "score" DESC
            LIMIT 20
        ''')
    )

    users = [
        UserRanking(
            fullname=row[0],
            username=row[1],
            email=row[2],
            img_link=row[3],
            reputation=row[4],
            score=row[5],
        )
        for row in result
    ]
    return users
