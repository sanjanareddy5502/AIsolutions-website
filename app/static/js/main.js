const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

if (menuButton && mobileMenu) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector(".sr-only").textContent = "Open navigation menu";
    mobileMenu.classList.add("hidden");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.querySelector(".sr-only").textContent = isOpen
      ? "Open navigation menu"
      : "Close navigation menu";
    mobileMenu.classList.toggle("hidden", isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });
}

const consultationForm = document.querySelector("[data-consultation-form]");
const formMessage = document.querySelector("[data-form-message]");

if (consultationForm && formMessage) {
  consultationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!consultationForm.checkValidity()) {
      consultationForm.reportValidity();
      return;
    }
    formMessage.textContent =
      "Thanks—this preview did not send your information. Backend processing will be connected in the next milestone.";
  });
}
