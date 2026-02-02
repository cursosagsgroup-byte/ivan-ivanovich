import sys
from pypdf import PdfReader

pdf_path = '/Users/carlosbeuvrin/Documents/KETING MEDIA/NUEVOS PROYECTOS ANTIGRAVITY/IVAN CODIGO/NUEVA LANDING 30 01 26/Textos completos para landing page curso “Protección Ejecutiva, Operatividad General y Logística Protectiva”.pdf'

try:
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    print(text)
except Exception as e:
    print(f"Error: {e}")
