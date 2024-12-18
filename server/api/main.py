import json
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, AuditResult
from services.node_service import run_audit
from grist import send_results_to_grist

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autoriser toutes les origines (à restreindre en prod)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Méthodes autorisées
    allow_headers=["*"],  # Tous les headers
)

# Initialize DB
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/audit")
def audit_website(url: str, db: Session = Depends(get_db)):
    # Check if result exists in cache
    cached_result = db.query(AuditResult).filter(AuditResult.url == url).first()
    if cached_result:
        # Deserialize violations from the database
        violations = (
            json.loads(cached_result.violations) if cached_result.violations else []
        )
        return {
            "url": url,
            "has_violations": cached_result.has_violations,
            "violations": violations,
        }

    # Run new audit
    audit_results = run_audit(url)
    if not audit_results:
        raise HTTPException(status_code=500, detail="Failed to analyze the website.")

    # Check if there are violations
    violations = audit_results.get("violations", [])
    has_violations = len(violations) > 0
    violations_str = json.dumps(violations)  # Serialize violations to string

    # Store only violations and flag in DB
    new_audit = AuditResult(
        url=url,
        has_violations=has_violations,
        violations=violations_str if has_violations else None,
    )
    db.add(new_audit)
    db.commit()
    db.refresh(new_audit)

    # Prepare data for Grist
    grist_data = [
        {
            "url": url,
            "date": new_audit.created_at.isoformat(),
            "violations": violations,
            "impact": "serious" if has_violations else "none",
        }
    ]

    # Send results to Grist
    send_results_to_grist(grist_data)

    return {
        "url": url,
        "has_violations": has_violations,
        "violations": violations,  # Return violations as a proper JSON array
    }


# Route pour récupérer la liste des sites en cache
@app.get("/cache")
def get_cached_sites(db: Session = Depends(get_db)):
    results = db.query(AuditResult).all()
    return [{"url": result.url, "date": result.created_at} for result in results]


# Route pour supprimer un cache spécifique
@app.delete("/cache")
def clear_cache(url: str, db: Session = Depends(get_db)):
    cache_entry = db.query(AuditResult).filter(AuditResult.url == url).first()
    if not cache_entry:
        raise HTTPException(status_code=404, detail="Cache entry not found")
    db.delete(cache_entry)
    db.commit()
    return {"message": f"Cache cleared for {url}"}
