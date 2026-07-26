import re


def extract_languages(text: str):

    languages = []

    known_languages = [
        "English",
        "Hindi",
        "Marathi",
        "German",
        "French",
        "Japanese",
    ]

    for language in known_languages:

        if re.search(
            rf"\b{language}\b",
            text,
            re.IGNORECASE,
        ):
            languages.append(language)

    return languages