from sqlalchemy.orm import Session
from models import User, Note, Comment
from schemas import UserCreate, NoteCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_note(db: Session, note: NoteCreate, user_id: int):
    db_note = Note(**note.dict(), owner_id=user_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_notes(db: Session, user_id: int):
    return db.query(Note).filter(Note.owner_id == user_id).all()

def get_note(db: Session, note_id: int, user_id: int):
    return db.query(Note).filter(Note.id == note_id, Note.owner_id == user_id).first()

def delete_note(db: Session, note_id: int, user_id: int):
    note = get_note(db, note_id, user_id)
    if note:
        db.delete(note)
        db.commit()
    return note

def create_comment(db: Session, note_id: int, user_id: int, content: str):
    comment = Comment(content=content, note_id=note_id, user_id=user_id)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def get_comments(db: Session, note_id: int):
    return db.query(Comment).filter(Comment.note_id == note_id).order_by(Comment.created_at.asc()).all()

def get_all_users(db: Session):
    return db.query(User).all()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_notes_by_user(db: Session, user_id: int):
    return db.query(Note).filter(Note.owner_id == user_id).order_by(Note.created_at.desc()).all()

def update_user_profile(db: Session, user_id: int, username: str = None, status: str = None, avatar_url: str = None):
    user = db.query(User).filter(User.id == user_id).first()
    if username is not None:
        user.username = username
    if status is not None:
        user.status = status
    if avatar_url is not None:
        user.avatar_url = avatar_url
    db.commit()
    db.refresh(user)
    return user 