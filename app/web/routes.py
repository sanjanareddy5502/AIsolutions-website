from pathlib import Path

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

TEMPLATES_DIR = Path(__file__).resolve().parents[1] / "templates"
templates = Jinja2Templates(directory=TEMPLATES_DIR)

router = APIRouter()


def render_page(request: Request, template_name: str, page_title: str, current_page: str) -> HTMLResponse:
    return templates.TemplateResponse(
        request=request,
        name=template_name,
        context={"page_title": page_title, "current_page": current_page},
    )


@router.get("/", response_class=HTMLResponse)
async def home(request: Request) -> HTMLResponse:
    return render_page(request, "home.html", "Smarter Digital Systems for Growing Businesses", "home")


@router.get("/services", response_class=HTMLResponse)
async def services(request: Request) -> HTMLResponse:
    return render_page(request, "services.html", "Services", "services")


@router.get("/industries", response_class=HTMLResponse)
async def industries(request: Request) -> HTMLResponse:
    return render_page(request, "industries.html", "Industries", "industries")


@router.get("/about", response_class=HTMLResponse)
async def about(request: Request) -> HTMLResponse:
    return render_page(request, "about.html", "About", "about")


@router.get("/contact", response_class=HTMLResponse)
async def contact(request: Request) -> HTMLResponse:
    return render_page(request, "contact.html", "Contact", "contact")
