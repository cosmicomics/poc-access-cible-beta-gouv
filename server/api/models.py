from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean

from datetime import datetime
from database import Base


class AuditResult(Base):
    __tablename__ = "audit_results"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    has_violations = Column(Boolean, default=False)
    violations = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
