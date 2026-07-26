import re


SECTION_HEADERS = [
    "Summary",
    "Technical Skills",
    "Education",
    "Experience",
    "Projects",
    "Leadership & Certifications",
    "Languages",
]


def extract_sections(text: str):
    """
    Split resume into logical sections.

    Returns:
    {
        "summary": "...",
        "technical_skills": "...",
        "education": "...",
        "experience": "...",
        "projects": "...",
        "leadership_and_certifications": "...",
        "languages": "..."
    }
    """

    sections = {}
    matches = []

    # Find all section headers
    for header in SECTION_HEADERS:

        match = re.search(
            rf"^{re.escape(header)}\s*$",
            text,
            re.MULTILINE | re.IGNORECASE,
        )

        if match:
            matches.append(
                (
                    match.start(),
                    match.end(),
                    header,
                )
            )

    # Sort sections by their position
    matches.sort(key=lambda x: x[0])

    # Extract text between consecutive headers
    for index, (_, end, header) in enumerate(matches):

        start = end

        if index + 1 < len(matches):
            next_start = matches[index + 1][0]
        else:
            next_start = len(text)

        section_text = text[start:next_start].strip()

        # Generate dictionary key
        key = (
            header.lower()
            .replace("&", "and")
            .replace(" ", "_")
        )

        while "__" in key:
            key = key.replace("__", "_")

        sections[key] = section_text

    return sections