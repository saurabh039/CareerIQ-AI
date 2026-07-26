from app.utils.skill_dictionary import TECH_SKILLS


def extract_skills(text: str):

    found_skills = []

    lower_text = text.lower()

    for skill in sorted(TECH_SKILLS):

        if skill.lower() in lower_text:
            found_skills.append(skill)

    return sorted(list(set(found_skills)))