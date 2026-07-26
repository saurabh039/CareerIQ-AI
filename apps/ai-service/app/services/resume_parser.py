from app.utils.document_reader import extract_text
from app.utils.section_extractor import extract_sections

from app.parsers.basics_parser import extract_basics
from app.parsers.skills_parser import extract_skills
from app.parsers.education_parser import extract_education
from app.parsers.experience_parser import extract_experience
from app.parsers.projects_parser import extract_projects
from app.parsers.certification_parser import extract_certifications
from app.parsers.language_parser import extract_languages
from app.parsers.summary_parser import extract_summary


def parse_resume(file_path: str):

    # Extract complete resume text
    text = extract_text(file_path)

    # Split resume into logical sections
    sections = extract_sections(text)

    # Basics still needs the full resume
    basics = extract_basics(text)

    # Each parser now works only on its own section
    summary = extract_summary(
        sections.get("summary", "")
    )

    skills = extract_skills(
        sections.get("technical_skills", "")
    )

    education = extract_education(
        sections.get("education", "")
    )

    experience = extract_experience(
        sections.get("experience", "")
    )

    projects = extract_projects(
        sections.get("projects", "")
    )

    certifications = extract_certifications(
        sections.get(
            "leadership_and_certifications",
            ""
        )
    )

    languages = extract_languages(
        sections.get("languages", "")
    )

    return {
        "success": True,
        "rawText": text,
        "parsedData": {
            "basics": basics,
            "summary": summary,
            "skills": skills,
            "education": education,
            "experience": experience,
            "projects": projects,
            "certifications": certifications,
            "languages": languages,
        },
    }