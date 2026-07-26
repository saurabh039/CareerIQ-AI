def extract_experience(section: str):
    """
    Extract work experience from the Experience section.
    """

    experience = []

    if not section.strip():
        return experience

    lines = [line.strip() for line in section.splitlines() if line.strip()]

    i = 0

    while i < len(lines):

        line = lines[i]

        # Job Title | Company
        if "|" in line:

            parts = [p.strip() for p in line.split("|")]

            job_title = parts[0]
            company = parts[1] if len(parts) > 1 else ""

            duration = ""
            description = []

            # Duration
            if i + 1 < len(lines):
                duration = lines[i + 1]

            j = i + 2

            while j < len(lines):

                current = lines[j]

                # Next experience starts
                if "|" in current:
                    break

                if current.lower() == "github":
                    j += 1
                    continue

                if current.startswith(("•", "-", "*")):
                    description.append(
                        current.lstrip("•-* ").strip()
                    )
                elif description:
                    # continuation of previous bullet
                    description[-1] += " " + current

                j += 1

            experience.append(
                {
                    "jobTitle": job_title,
                    "company": company,
                    "duration": duration,
                    "description": description,
                }
            )

            i = j

        else:
            i += 1

    return experience