import re


EMAIL_REGEX = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"

PHONE_REGEX = r"(\+?\d[\d\s\-]{8,}\d)"

LINKEDIN_REGEX = r"(https?://(?:www\.)?linkedin\.com/[^\s]+)"

GITHUB_REGEX = r"(https?://(?:www\.)?github\.com/[^\s]+)"


def extract_basics(text: str):
    """
    Extract basic candidate information from resume text.
    """

    lines = [line.strip() for line in text.splitlines() if line.strip()]

    full_name = ""
    email = ""
    phone = ""
    linkedin = ""
    github = ""
    location = ""

    # Usually first non-empty line is the candidate name
    if lines:
        full_name = lines[0]

    email_match = re.search(EMAIL_REGEX, text)
    if email_match:
        email = email_match.group()

    phone_match = re.search(PHONE_REGEX, text)
    if phone_match:
        phone = phone_match.group()

    linkedin_match = re.search(LINKEDIN_REGEX, text)
    if linkedin_match:
        linkedin = linkedin_match.group()

    github_match = re.search(GITHUB_REGEX, text)
    if github_match:
        github = github_match.group()

    return {
        "fullName": full_name,
        "email": email,
        "phone": phone,
        "location": location,
        "linkedin": linkedin,
        "github": github,
    }