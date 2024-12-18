from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean

from datetime import datetime
from database import Base


class AuditResult(Base):
    __tablename__ = "audit_results"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    has_violations = Column(Boolean, default=False)  # Flag pour indiquer des violations
    violations = Column(Text, nullable=True)  # Stocke uniquement les violations JSON
    created_at = Column(DateTime, default=datetime.utcnow)
