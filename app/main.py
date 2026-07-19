from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.web.routes import router as web_router

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="AI Solutions")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
app.include_router(web_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
