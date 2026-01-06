document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.style.display =
      navLinks.style.display === "flex" ? "none" : "flex";
    if (navLinks.style.display === "flex") {
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "70px";
      navLinks.style.left = "0";
      navLinks.style.width = "100%";
      navLinks.style.backgroundColor = "#0f172a";
      navLinks.style.padding = "2rem";
    }
  });

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Simple Entrance Animation for Hero Text
  const heroContent = document.querySelector(".hero-text");
  heroContent.style.opacity = "0";
  heroContent.style.transform = "translateY(20px)";
  heroContent.style.transition = "opacity 1s ease-out, transform 1s ease-out";

  setTimeout(() => {
    heroContent.style.opacity = "1";
    heroContent.style.transform = "translateY(0)";
  }, 200);
});
