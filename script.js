const cursor = document.querySelector(".cursor");
const cursorRing = document.querySelector(".cursor-ring");

if (window.innerWidth > 800 && cursor && cursorRing) {
  document.body.classList.add("has-cursor");
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = `${mx}px`;
    cursor.style.top = `${my}px`;
  });
  function cursorLoop() {
    rx += (mx - rx) * .14;
    ry += (my - ry) * .14;
    cursorRing.style.left = `${rx}px`;
    cursorRing.style.top = `${ry}px`;
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();
  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorRing.style.width = "54px";
      cursorRing.style.height = "54px";
      cursorRing.style.background = "rgba(215,255,53,.06)";
    });
    el.addEventListener("mouseleave", () => {
      cursorRing.style.width = "36px";
      cursorRing.style.height = "36px";
      cursorRing.style.background = "transparent";
    });
  });
}

const menuBtn = document.querySelector(".menu-btn");
const mobileMenu = document.querySelector(".mobile-menu");
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
  });
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }));
}

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .12});
reveals.forEach(el => observer.observe(el));

const filters = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project");
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    projects.forEach(project => {
      project.classList.toggle("is-hidden", filter !== "all" && project.dataset.category !== filter);
    });
  });
});

const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox?.querySelector("img");
const lightboxTitle = lightbox?.querySelector("strong");
const lightboxMeta = lightbox?.querySelector("span");
const closeLightbox = () => {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
};
document.querySelectorAll(".project-media").forEach(card => {
  card.addEventListener("click", () => {
    if (!lightbox) return;
    lightboxImg.style.display = "block";
    lightboxImg.src = card.dataset.image;
    lightboxImg.alt = card.dataset.title || "Project preview";
    lightboxTitle.textContent = card.dataset.title || "";
    lightboxMeta.textContent = card.dataset.meta || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  });
});
lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    navbar.style.background = "rgba(9,9,9,.55)";
    navbar.style.backdropFilter = "blur(15px)";
  } else {
    navbar.style.background = "transparent";
    navbar.style.backdropFilter = "none";
  }
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({top: target.getBoundingClientRect().top + window.scrollY - 68, behavior:"smooth"});
  });
});

lightboxImg?.addEventListener("error", () => { lightboxImg.style.display = "none"; });
document.querySelectorAll(".project-media img").forEach(img => {
  const drop = () => img.remove();
  img.addEventListener("error", drop);
  if (img.complete && img.naturalWidth === 0) drop();
});
