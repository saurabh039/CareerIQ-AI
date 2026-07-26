from pydantic import BaseModel


class ResumeParseRequest(BaseModel):
    filePath: str


class ResumeParseResponse(BaseModel):
    success: bool
    rawText: str
    parsedData: dict