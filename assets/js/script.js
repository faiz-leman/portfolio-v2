document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("flex");
    navLinks.classList.toggle("hidden");
  });

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if href is just "#" or if it's a modal trigger
      if (href === "#" || this.hasAttribute("data-bs-toggle")) {
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
        // Close mobile menu after clicking
        if (window.innerWidth < 768) {
          navLinks.classList.add("hidden");
          navLinks.classList.remove("flex");
        }
      }
    });
  });

  // Simple Entrance Animation for Hero Text
  const heroContent = document.querySelector(".hero-text");
  if (heroContent) {
    heroContent.style.opacity = "0";
    heroContent.style.transform = "translateY(20px)";
    heroContent.style.transition = "opacity 1s ease-out, transform 1s ease-out";

    setTimeout(() => {
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0)";
    }, 200);
  }
});
