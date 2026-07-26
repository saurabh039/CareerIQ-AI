CERTIFICATION_KEYWORDS = [
    "Udemy",
    "Coursera",
    "NPTEL",
    "AICTE",
    "Edunet",
    "Shell",
    "Google",
    "Microsoft",
    "AWS",
    "Oracle",
    "Cisco",
    "IBM",
    "Meta",
]


def extract_certifications(section: str):
    """
    Extract certifications only.
    Ignore leadership entries.
    """

    certifications = []

    if not section.strip():
        return certifications

    lines = [
        line.strip("• ").strip()
        for line in section.splitlines()
        if line.strip()
    ]

    for line in lines:

        if line.lower().startswith("certifications"):
            line = line.replace("Certifications:", "").strip()

        if any(keyword in line for keyword in CERTIFICATION_KEYWORDS):
            line = line.rstrip("|").strip()

            certifications.append(line)

    return certifications