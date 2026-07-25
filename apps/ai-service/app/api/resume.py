from fastapi import APIRouter

from app.schemas.resume import (
    ResumeParseRequest,
    ResumeParseResponse,
)

from app.services.resume_parser import parse_resume

router = APIRouter(
    prefix="/api",
    tags=["Resume Intelligence"],
)


@router.post(
    "/parse-resume",
    response_model=ResumeParseResponse,
)
def parse_resume_api(request: ResumeParseRequest):

    return parse_resume(request.filePath)