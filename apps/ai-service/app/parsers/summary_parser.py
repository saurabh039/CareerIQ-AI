def extract_summary(section: str):
    """
    Extract summary from the Summary section.
    """

    if not section.strip():
        return ""

    lines = [
        line.strip()
        for line in section.splitlines()
        if line.strip()
    ]

    return " ".join(lines)