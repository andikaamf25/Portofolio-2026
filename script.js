const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const currentYear = document.querySelector("#current-year");
const typingFirstLine = document.querySelector(".typing-first-line");
const typingSecondLine = document.querySelector(".typing-second-line");
const typingCursor = document.querySelector(".typing-cursor");
const certificateGrid = document.querySelector("#certificate-grid");
const certificatePagination = document.querySelector(".certificate-pagination");
let scrollAnimationFrame = 0;

const closeMenu = () => {
  if (!menuToggle || !navLinks) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Buka navigasi");
  menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  navLinks.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

const scrollToSection = (target) => {
  window.cancelAnimationFrame(scrollAnimationFrame);

  const root = document.documentElement;
  const body = document.body;
  const previousScrollBehavior = root.style.scrollBehavior;
  const previousBodyScrollBehavior = body.style.scrollBehavior;
  const scrollPadding =
    Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
  const startPosition = window.scrollY;
  const targetPosition = Math.max(
    0,
    target.getBoundingClientRect().top + startPosition - scrollPadding,
  );
  const distance = targetPosition - startPosition;
  const duration = 1400;
  let startTime;

  root.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";

  const animateScroll = (timestamp) => {
    startTime ??= timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = 1 - (1 - progress) ** 3;

    window.scrollTo(0, startPosition + distance * easedProgress);

    if (progress < 1) {
      scrollAnimationFrame = window.requestAnimationFrame(animateScroll);
    } else {
      root.style.scrollBehavior = previousScrollBehavior;
      body.style.scrollBehavior = previousBodyScrollBehavior;
    }
  };

  scrollAnimationFrame = window.requestAnimationFrame(animateScroll);
};

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
      return;
    }

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Tutup navigasi");
    menuToggle.innerHTML =
      '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    navLinks.classList.add("is-open");
    document.body.classList.add("menu-open");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.hash);

    if (!target) {
      return;
    }

    event.preventDefault();

    if (navLinks?.contains(link)) {
      closeMenu();
    }

    history.pushState(null, "", link.hash);
    scrollToSection(target);
  });
});

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (certificateGrid && certificatePagination) {
  const certificates = Array.from(
    certificateGrid.querySelectorAll(".certificate-card"),
  );
  const pageSize = 3;
  const totalPages = Math.ceil(certificates.length / pageSize);
  const pageStatus = certificatePagination.querySelector(
    ".certificate-page-status",
  );
  const pageButtons = certificatePagination.querySelectorAll(
    ".certificate-page-button",
  );
  let currentPage = 1;

  if (pageStatus && pageButtons.length === 2) {
    certificatePagination.hidden = totalPages <= 1;

    const showPage = () => {
      const firstCertificate = (currentPage - 1) * pageSize;

      certificates.forEach((certificate, index) => {
        certificate.hidden =
          index < firstCertificate || index >= firstCertificate + pageSize;
      });

      pageStatus.textContent = `Halaman ${currentPage} dari ${totalPages}`;
      pageButtons[0].disabled = currentPage === 1;
      pageButtons[1].disabled = currentPage === totalPages;
    };

    pageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const pageStep = Number(button.getAttribute("data-page-step"));
        currentPage = Math.min(
          totalPages,
          Math.max(1, currentPage + pageStep),
        );
        showPage();
      });
    });

    showPage();
  }
}

if (typingFirstLine && typingSecondLine && typingCursor) {
  const heading = typingFirstLine.closest("h1");
  const text = heading?.getAttribute("aria-label")?.trim();
  let characterIndex = 0;
  let isDeleting = false;

  if (text) {
    const breakIndex = text.indexOf(" Miftahul ");
    const splitAt = breakIndex >= 0 ? breakIndex : text.lastIndexOf(" ");
    const firstLine = text.slice(0, splitAt);
    const secondLine = text.slice(splitAt + 1);
    typingFirstLine.append(typingCursor);

    const typeNextCharacter = () => {
      characterIndex += isDeleting ? -1 : 1;
      typingFirstLine.textContent = text.slice(
        0,
        Math.min(characterIndex, firstLine.length),
      );
      typingSecondLine.textContent =
        characterIndex > firstLine.length
          ? secondLine.slice(0, characterIndex - firstLine.length)
          : "";
      (characterIndex <= firstLine.length
        ? typingFirstLine
        : typingSecondLine
      ).append(typingCursor);

      if (!isDeleting && characterIndex === text.length) {
        isDeleting = true;
        window.setTimeout(typeNextCharacter, 1400);
        return;
      }

      if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        window.setTimeout(typeNextCharacter, 450);
        return;
      }

      window.setTimeout(typeNextCharacter, isDeleting ? 55 : 120);
    };

    window.setTimeout(typeNextCharacter, 400);
  }
}
