import re


def extract_education(text: str):
    """
    Extract education details from resume text.
    """

    education = []

    lines = [line.strip() for line in text.splitlines() if line.strip()]

    degree_keywords = [
        "B.E",
        "B.Tech",
        "Bachelor",
        "M.E",
        "M.Tech",
        "Master",
        "HSC",
        "Higher Secondary",
        "SSC",
        "Secondary School",
        "Diploma",
        "PhD",
    ]

    i = 0

    while i < len(lines):

        line = lines[i]

        if any(keyword.lower() in line.lower() for keyword in degree_keywords):

            degree = line

            year = ""
            institution = ""
            score = ""

            # Year
            if i + 1 < len(lines):
                if re.search(r"\d{4}", lines[i + 1]):
                    year = lines[i + 1]

            # Institution
            if i + 2 < len(lines):
                institution = lines[i + 2].split("|")[0].strip()

                score_match = re.search(
                    r"(SGPA:\s*[\d.]+\s*/\s*\d+|CGPA:\s*[\d.]+\s*/\s*\d+|\d+(\.\d+)?%)",
                    lines[i + 2],
                )

                if score_match:
                    score = score_match.group()

            education.append(
                {
                    "degree": degree,
                    "institution": institution,
                    "year": year,
                    "score": score,
                }
            )

        i += 1

    return education