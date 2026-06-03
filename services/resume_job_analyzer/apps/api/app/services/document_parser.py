from pathlib import Path
from tempfile import NamedTemporaryFile
import os

from docx import Document
from fastapi import UploadFile
from PyPDF2 import PdfReader

SUPPORTED_EXTENSIONS = {".pdf", ".docx"}


def extract_text_from_path(path: str | Path) -> str:
    file_path = Path(path)

    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    ext = file_path.suffix.lower()

    if ext == ".pdf":
        reader = PdfReader(str(file_path))
        return "\n".join(
            page.extract_text() or ""
            for page in reader.pages
        ).strip()

    if ext == ".docx":
        doc = Document(str(file_path))
        return "\n".join(
            paragraph.text
            for paragraph in doc.paragraphs
        ).strip()

    raise ValueError(
        "Unsupported file type. Please upload a PDF or DOCX file."
    )


async def extract_text_from_upload(upload: UploadFile) -> str:
    filename = upload.filename or ""
    ext = Path(filename).suffix.lower()

    if ext not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            "Unsupported file type. Please upload a PDF or DOCX file."
        )

    contents = await upload.read()

    if not contents:
        raise ValueError("Uploaded resume file is empty.")

    temp_path = None

    try:
        with NamedTemporaryFile(
            delete=False,
            suffix=ext
        ) as temp_file:
            temp_file.write(contents)
            temp_path = temp_file.name

        # File handle is now closed
        return extract_text_from_path(temp_path)

    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass