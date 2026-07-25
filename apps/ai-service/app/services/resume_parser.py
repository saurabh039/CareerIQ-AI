from app.utils.document_reader import extract_text


def parse_resume(file_path: str):

    text = extract_text(file_path)

    return {
        "success": True,
        "text": text,
    }