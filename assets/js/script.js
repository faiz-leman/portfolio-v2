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

  // Dynamic Case Study Modal
  const caseStudyModal = document.getElementById("caseStudyModal");
  const caseStudyButtons = document.querySelectorAll(".case-study-btn");

  caseStudyButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the parent project card
      const projectCard = this.closest(".project-card");

      // Extract data from data attributes
      const title = projectCard.getAttribute("data-project-title");
      const description = projectCard.getAttribute("data-project-description");
      const technologies = JSON.parse(
        projectCard.getAttribute("data-project-tech")
      );
      const features = JSON.parse(
        projectCard.getAttribute("data-project-features")
      );
      const projectUrl = projectCard.getAttribute("data-project-url");
      const projectImages = JSON.parse(
        projectCard.getAttribute("data-project-images")
      );

      // Populate modal content
      document.getElementById("caseStudyModalLabel").textContent = title;
      document.getElementById("modalDescription").textContent = description;

      // Populate images grid
      const imagesGrid = document.getElementById("modalImagesGrid");
      imagesGrid.innerHTML = ""; // Clear existing images

      projectImages.forEach((imageSrc, index) => {
        const imageContainer = document.createElement("div");
        imageContainer.className = "project-image-item";

        // Create skeleton loader
        const skeleton = document.createElement("div");
        skeleton.className = "skeleton-loader";

        // Create image element
        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = `${title} - Screenshot ${index + 1}`;
        img.className = "project-screenshot";

        // Hide skeleton when image loads
        img.onload = function () {
          skeleton.style.display = "none";
          img.style.display = "block";
        };

        // Show skeleton initially, hide image
        img.style.display = "none";

        imageContainer.appendChild(skeleton);
        imageContainer.appendChild(img);
        imagesGrid.appendChild(imageContainer);
      });

      // Populate technologies
      const techContainer = document.getElementById("modalTechnologies");
      techContainer.innerHTML = "";
      technologies.forEach((tech) => {
        const techSpan = document.createElement("span");
        techSpan.textContent = tech;
        techContainer.appendChild(techSpan);
      });

      // Populate features
      const featuresList = document.getElementById("modalFeatures");
      featuresList.innerHTML = "";
      features.forEach((feature) => {
        const featureLi = document.createElement("li");
        featureLi.textContent = feature;
        featuresList.appendChild(featureLi);
      });

      // Update project link
      document
        .getElementById("modalProjectLink")
        .setAttribute("href", projectUrl);

      // Show the modal using Bootstrap's Modal API
      const modal = new bootstrap.Modal(caseStudyModal);
      modal.show();
    });
  });
});
