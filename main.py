from fastapi import FastAPI, Request, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import logging
from pathlib import Path

UPLOAD_DIR = Path() / 'uploads'

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="static")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    logger.info("Home page")
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/upload")
async def upload_ply_file(file: UploadFile):
    file_content = await file.read()
    logger.info(f"File {file.filename} loaded.")
    with open(UPLOAD_DIR / file.filename, 'wb') as f:
        f.write(file_content)
    return {"message": "File uploaded successfully", "point_cloud_data": file.filename}