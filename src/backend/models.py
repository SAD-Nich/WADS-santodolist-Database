from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Float

class Todos(Base):
    __tablename__ = 'todos'

    name = Column(String)
    desc = Column(String)
    status = Column(Boolean, default=False, nullable=False)
    TodoId = Column(Integer, nullable=False, primary_key=True)