(() => {
  const nav = document.getElementById("site-nav") || document.querySelector("header .nav");
  const menu = document.getElementById("menu");
  const toggle = document.getElementById("menu-toggle") || document.querySelector(".menu-toggle");

  if (!nav || !menu || !toggle) return;

  if (!toggle.hasAttribute("type")) toggle.setAttribute("type", "button");
  if (!toggle.hasAttribute("aria-controls")) toggle.setAttribute("aria-controls", "menu");
  if (!toggle.hasAttribute("aria-expanded")) toggle.setAttribute("aria-expanded", "false");

  const closeAllSubmenus = (except = null) => {
    document.querySelectorAll(".has-submenu").forEach(item => {
      if (item !== except) {
        item.classList.remove("open");
        const button = item.querySelector(".submenu-toggle");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  };

  const closeMobileMenu = () => {
    menu.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    closeAllSubmenus();
  };

  toggle.addEventListener("click", () => {
    const isActive = menu.classList.toggle("active");
    toggle.setAttribute("aria-expanded", String(isActive));
    if (!isActive) closeAllSubmenus();
  });

  document.querySelectorAll(".submenu-toggle").forEach(button => {
    button.addEventListener("click", function () {
      const parent = this.parentElement;
      const willOpen = !parent.classList.contains("open");
      if (window.innerWidth > 900) closeAllSubmenus(parent);
      parent.classList.toggle("open");
      this.setAttribute("aria-expanded", String(willOpen));
    });

    button.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAllSubmenus();
        this.focus();
      }
    });
  });

  document.addEventListener("click", event => {
    if (!nav.contains(event.target)) closeMobileMenu();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMobileMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && menu.classList.contains("active")) closeMobileMenu();
  });
})();