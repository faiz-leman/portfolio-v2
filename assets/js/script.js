document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // PASSWORD PROTECTION CONFIGURATION
  // ========================================

  // Password settings
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes
  const AUTH_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  let failedAttempts = 0;
  let pendingProjectCard = null;

  // ========================================
  // AUTHENTICATION FUNCTIONS (PER-PROJECT)
  // ========================================

  function setProjectAuthentication(projectTitle) {
    const authData = {
      authenticatedProjects: getAuthenticatedProjects(),
      timestamp: Date.now(),
      expiresIn: AUTH_EXPIRY,
    };

    authData.authenticatedProjects[projectTitle] = {
      unlockedAt: Date.now(),
    };

    sessionStorage.setItem("portfolioAuth", JSON.stringify(authData));
  }

  function getAuthenticatedProjects() {
    const authData = JSON.parse(sessionStorage.getItem("portfolioAuth"));
    if (!authData) return {};

    const now = Date.now();
    const elapsed = now - authData.timestamp;

    if (elapsed > authData.expiresIn) {
      sessionStorage.removeItem("portfolioAuth");
      return {};
    }

    return authData.authenticatedProjects || {};
  }

  function isProjectAuthenticated(projectTitle) {
    const authenticatedProjects = getAuthenticatedProjects();
    return !!authenticatedProjects[projectTitle];
  }

  function validateProjectPassword(enteredPassword, projectPassword) {
    // Compare plain text passwords (in production, use proper hashing)
    return enteredPassword === projectPassword;
  }

  // ========================================
  // MOBILE MENU
  // ========================================

  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("flex");
    navLinks.classList.toggle("hidden");
  });

  // ========================================
  // SMOOTH SCROLLING
  // ========================================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href === "#" || this.hasAttribute("data-bs-toggle")) {
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
        if (window.innerWidth < 768) {
          navLinks.classList.add("hidden");
          navLinks.classList.remove("flex");
        }
      }
    });
  });

  // ========================================
  // HERO ANIMATION
  // ========================================

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

  // ========================================
  // PASSWORD MODAL
  // ========================================

  const passwordModal = new bootstrap.Modal(
    document.getElementById("passwordModal")
  );
  const passwordForm = document.getElementById("passwordForm");
  const passwordInput = document.getElementById("portfolioPassword");
  const passwordError = document.getElementById("passwordError");
  const showHintBtn = document.getElementById("showHint");
  const passwordHint = document.getElementById("passwordHint");

  // Auto-focus password input when modal opens
  document
    .getElementById("passwordModal")
    .addEventListener("shown.bs.modal", function () {
      passwordInput.focus();
    });

  // Show hint button
  showHintBtn.addEventListener("click", function () {
    if (passwordHint.style.display === "none") {
      passwordHint.style.display = "block";
      showHintBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide hint';
    } else {
      passwordHint.style.display = "none";
      showHintBtn.innerHTML =
        '<i class="fas fa-question-circle"></i> Show hint';
    }
  });

  // Password form submission
  passwordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Check if locked out
    const lockoutEnd = sessionStorage.getItem("lockoutEnd");
    if (lockoutEnd && Date.now() < parseInt(lockoutEnd)) {
      const remainingTime = Math.ceil(
        (parseInt(lockoutEnd) - Date.now()) / 60000
      );
      passwordError.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Too many attempts. Try again in ${remainingTime} minute(s).`;
      passwordError.className = "mt-2 error";
      passwordError.style.display = "block";
      passwordInput.value = "";
      return;
    }

    const enteredPassword = passwordInput.value;
    const projectPassword = pendingProjectCard.getAttribute(
      "data-project-password"
    );
    const projectTitle = pendingProjectCard.getAttribute("data-project-title");

    if (validateProjectPassword(enteredPassword, projectPassword)) {
      // Correct password
      setProjectAuthentication(projectTitle);
      failedAttempts = 0;
      sessionStorage.removeItem("lockoutEnd");

      // Show success message
      passwordInput.style.borderColor = "#10b981";
      passwordError.innerHTML =
        '<i class="fas fa-check-circle"></i> Access granted! Opening case study...';
      passwordError.className = "mt-2 success";
      passwordError.style.display = "block";

      setTimeout(() => {
        passwordModal.hide();
        passwordInput.value = "";
        passwordInput.style.borderColor = "";
        passwordError.style.display = "none";
        passwordHint.style.display = "none";
        showHintBtn.innerHTML =
          '<i class="fas fa-question-circle"></i> Show hint';

        // Show the case study modal for the pending project
        if (pendingProjectCard) {
          showCaseStudyModal(pendingProjectCard);
          pendingProjectCard = null;
        }
      }, 800);
    } else {
      // Wrong password
      failedAttempts++;

      if (failedAttempts >= MAX_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_TIME;
        sessionStorage.setItem("lockoutEnd", lockoutEnd.toString());
        passwordError.innerHTML =
          '<i class="fas fa-lock"></i> Too many failed attempts. Locked for 5 minutes.';
      } else {
        passwordError.innerHTML = `<i class="fas fa-exclamation-circle"></i> Incorrect password. ${
          MAX_ATTEMPTS - failedAttempts
        } attempt(s) remaining.`;
      }

      passwordError.className = "mt-2 error";
      passwordError.style.display = "block";
      passwordInput.value = "";
      passwordInput.style.borderColor = "#ef4444";
      passwordInput.focus();
    }
  });

  // Reset when modal is hidden
  document
    .getElementById("passwordModal")
    .addEventListener("hidden.bs.modal", function () {
      passwordInput.value = "";
      passwordError.style.display = "none";
      passwordInput.style.borderColor = "";
      passwordHint.style.display = "none";
      showHintBtn.innerHTML =
        '<i class="fas fa-question-circle"></i> Show hint';
    });

  // ========================================
  // CASE STUDY MODAL
  // ========================================

  const caseStudyModal = document.getElementById("caseStudyModal");
  const caseStudyButtons = document.querySelectorAll(".case-study-btn");

  caseStudyButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const projectCard = this.closest(".project-card");
      const projectTitle = projectCard.getAttribute("data-project-title");

      // Check if this specific project is authenticated
      if (!isProjectAuthenticated(projectTitle)) {
        pendingProjectCard = projectCard;
        passwordModal.show();
        return;
      }

      // User is authenticated for this project, show case study
      showCaseStudyModal(projectCard);
    });
  });

  // Function to show case study modal
  function showCaseStudyModal(projectCard) {
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
    imagesGrid.innerHTML = "";

    projectImages.forEach((imageSrc, index) => {
      const imageContainer = document.createElement("div");
      imageContainer.className = "project-image-item";

      const skeleton = document.createElement("div");
      skeleton.className = "skeleton-loader";

      const img = document.createElement("img");
      img.src = imageSrc;
      img.alt = `${title} - Screenshot ${index + 1}`;
      img.className = "project-screenshot";

      img.onload = function () {
        skeleton.style.display = "none";
        img.style.display = "block";
      };

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

    // Show the modal
    const modal = new bootstrap.Modal(caseStudyModal);
    modal.show();
  }
});
