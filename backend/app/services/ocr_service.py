import easyocr


# English OCR reader
reader = easyocr.Reader(
    ["en"],
    gpu=False
)


def extract_text_from_image(image_path: str):

    result = reader.readtext(
        image_path,
        detail=0
    )

    extracted_text = " ".join(result)

    return extracted_text