# Ryan Brooks: This file defines the FastAPI backend, survey data models, and CRUD routes for the Student Survey application.
# Ryan Brooks: It also configures SQLite persistence and CORS for local and deployed frontend access.
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
from typing import Optional
from sqlmodel import SQLModel, Field, create_engine, Session, select

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

sqlite_file_name = "surveys.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

class SurveyBase(SQLModel):
    first_name: str
    last_name: str
    street_address: str
    city: str
    state: str
    zip_code: str
    telephone: str
    email: str
    survey_date: date
    liked_most: Optional[str] = None
    interest_source: Optional[str] = None
    recommendation: Optional[str] = None
    raffle: Optional[str] = None
    comments: Optional[str] = None

class SurveyCreate(SurveyBase):
    pass

class Survey(SurveyBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class SurveyUpdate(SurveyBase):
    pass

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/surveys", response_model=Survey)
def create_survey(survey: SurveyCreate, session: Session = Depends(get_session)):
    db_survey = Survey(**survey.model_dump())
    session.add(db_survey)
    session.commit()
    session.refresh(db_survey)
    return db_survey

@app.get("/surveys", response_model=list[Survey])
def get_surveys(session: Session = Depends(get_session)):
    surveys = session.exec(select(Survey)).all()
    return surveys

@app.get("/surveys/{survey_id}", response_model=Survey)
def get_survey(survey_id: int, session: Session = Depends(get_session)):
    survey = session.get(Survey, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey

@app.put("/surveys/{survey_id}", response_model=Survey)
def update_survey(
    survey_id: int,
    updated_survey: SurveyUpdate,
    session: Session = Depends(get_session), 
):
    survey = session.get(Survey, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    
    survey_data = updated_survey.model_dump()
    for key, value in survey_data.items():
        setattr(survey, key, value)

    session.add(survey)
    session.commit()
    session.refresh(survey)
    return survey

@app.delete("/surveys/{survey_id}")
def delete_survey(survey_id: int, session: Session = Depends(get_session)):
    survey = session.get(Survey, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    
    session.delete(survey)
    session.commit()
    return {"message": f"Survey {survey_id} deleted successfully"}
