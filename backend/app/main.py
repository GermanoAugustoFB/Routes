from fastapi import FastAPI
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import Column, Integer, String
import os

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

#  Base model SQLAlchemy
class Base(DeclarativeBase):
    pass

# Exemple model
class Example(Base):
    __tablename__ = "examples"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

app = FastAPI()

# Create tables on startup
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Exemple endpoint
@app.get("/api/endpoint")
async def read_endpoint():
    async with AsyncSessionLocal() as session:
        new_example = Example(name="Teste")
        session.add(new_example)
        await session.commit()
        return {"message": "Connected to PostgreSQL", "example": new_example.name}