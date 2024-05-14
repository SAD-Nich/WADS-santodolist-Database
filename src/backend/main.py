from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Annotated, List
from pydantic import BaseModel, ValidationError
from database import SessionLocal, engine
import models
from models import Todos
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ['http://localhost:8000']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)
class Todo(BaseModel):
    name:str
    status:bool
    desc:str
    
class TodoId(Todo):
    TodoId: int
    class Config:
        orm_mode = True
        from_attributes = True

class TodoUpdate(BaseModel):
    desc: str
    status: bool

class TodoUpdateDisplay(BaseModel):
    TodoId: int
    desc: str
    status: bool

def read_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependants = Annotated[Session, Depends(read_db)]

models.Base.metadata.create_all(bind=engine)

async def delete_todo(id:int, db:Session):
    ToBeDeleted = db.query(Todos).filter(Todos.TodoId == id).first()
    if ToBeDeleted:
        db.delete(ToBeDeleted)
        db.commit()
        return True  # Return a list containing the deleted todo
    return False

async def update_todo(id:int, todo:TodoUpdate, db:Session):
    ToBeUpdated = db.query(Todos).filter(Todos.TodoId == id).first()
    if ToBeUpdated:
        ToBeUpdated.desc = todo.desc
        ToBeUpdated.status = todo.status
        db.commit()
        db.refresh(ToBeUpdated)
        return ToBeUpdated
    return None

@app.post('/todo/', response_model=TodoId)
async def create_todo(todo: Todo, db: db_dependants):
    db_todo = models.Todos(**todo.dict())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.get('/todo', response_model=List[TodoId])
async def read_todo(db:db_dependants, skip: int=0, limit: int=100):
    TodoLists = db.query(models.Todos).offset(skip).limit(limit).all()
    return TodoLists

@app.delete('/todo/delete/${id}')
async def create_delete_todo(todo_id: int, db: Session=Depends(read_db)):
    if not delete_todo(id, db):
        raise HTTPException(status_code=404, detail='not found')
    return True


@app.put('/todo/update/${id}', response_model=TodoId)
async def create_update_todo(id: int, todo:TodoUpdate, db: Session=Depends(read_db)):
    updated_todo = await update_todo(id,todo,db)
    if not updated_todo:
        raise HTTPException(status_code=404, detail='not found')
    return updated_todo
