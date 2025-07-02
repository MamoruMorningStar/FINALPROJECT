from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine
import models, schemas, crud, auth
from auth import get_current_user, create_access_token, authenticate_user, get_db
from datetime import timedelta
from schemas import Comment, CommentCreate, User as UserSchema

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Можно заменить на ["http://localhost:5173"] для безопасности
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db, user)

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/notes/", response_model=schemas.Note)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_note(db, note, current_user.id)

@app.get("/notes/", response_model=list[schemas.Note])
def read_notes(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_notes(db, current_user.id)

@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    note = crud.delete_note(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"ok": True}

@app.post("/notes/{note_id}/comments", response_model=Comment)
def add_comment(note_id: int, comment: CommentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_comment(db, note_id, current_user.id, comment.content)

@app.get("/notes/{note_id}/comments", response_model=list[Comment])
def get_note_comments(note_id: int, db: Session = Depends(get_db)):
    return crud.get_comments(db, note_id)

@app.get("/users", response_model=list[UserSchema])
def get_users(db: Session = Depends(get_db)):
    return crud.get_all_users(db)

@app.get("/users/{user_id}", response_model=UserSchema)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/users/{user_id}/notes", response_model=list[schemas.Note])
def get_user_notes(user_id: int, db: Session = Depends(get_db)):
    return crud.get_notes_by_user(db, user_id)

@app.patch("/users/me", response_model=UserSchema)
def update_profile(
    username: str = Body(None),
    status: str = Body(None),
    avatar_url: str = Body(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.update_user_profile(db, current_user.id, username, status, avatar_url) 