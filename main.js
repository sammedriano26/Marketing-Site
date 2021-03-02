"use strict";

// Variables
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const testimonial = document.querySelectorAll(".testimonial__text");
const header = document.querySelector(".header");
const cookies = document.createElement("div");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const links = document.querySelector(".nav__links");
const scrollToTopBtn = document.querySelector(".scroll-top-btn");
const nav = document.querySelector(".nav");
const navHeight = nav.getBoundingClientRect().height;
const rootElement = document.documentElement;
const footer = document.querySelector(".footer");
const allSections = document.querySelectorAll("section");
const lazyLoadedImg = document.querySelectorAll("img[data-src]");
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const maxSlide = slides.length - 1;
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

// Creating the Navbar Sticky: Using Intersection Observer API
const stickyCallback = (entries) => {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Modal Script
const hideModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const showModal = (e) => {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", showModal));

btnCloseModal.addEventListener("click", hideModal);
overlay.addEventListener("click", hideModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    hideModal();
  }
});

// Creating the scroll effect
btnScrollTo.addEventListener("click", (e) => {
  section1.scrollIntoView({ behavior: "smooth" });
});

// Navigation Panel Smooth Scrolling using event delegation
links.addEventListener("click", function (e) {
  e.preventDefault();

  const target = e.target;
  const id = target.getAttribute("href"); // Selects the section

  // Matching Strategy - makes sure that we don't read clicks on non-link targets.
  if (target.classList.contains("nav__link")) {
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Scroll to top button: Using Intersection Observer API
const topScrollCallback = (entries) => {
  const [entry] = entries;
  if (!entry.isIntersecting) scrollToTopBtn.classList.remove("showBtn");
  else scrollToTopBtn.classList.add("showBtn");
};

const footerObserver = new IntersectionObserver(topScrollCallback, {
  root: null,
  threshold: 0.1,
});
footerObserver.observe(footer);

function scrollToTheTop() {
  rootElement.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

scrollToTopBtn.addEventListener("click", scrollToTheTop);

// Reveal Sections:
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  else entry.target.classList.remove("section--hidden");

  // Unobserve entries: This will improve performance
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Setting up tabbed component
const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

tabContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".operations__tab");

  // Guard Clause - prevents clicking the container.
  if (!clicked) return;

  // Remove Active Class
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach((tc) =>
    tc.classList.remove("operations__content--active")
  );

  // Add Active Class
  clicked.classList.add("operations__tab--active");

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// lazy Loading Images:
const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace img with data-src.  This will create a load event.
  entry.target.src = entry.target.dataset.src;

  // Listen for the load event and remove the lazy-img filter
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  // Unobserve
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px", //This is used to lazy load the image before the user's scroll unto them.
});

lazyLoadedImg.forEach((img) => imgObserver.observe(img));

// Slider Functions
const slide = function () {
  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const nextSlide = function () {
    curSlide++;

    if (curSlide > maxSlide) curSlide = 0;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    curSlide--;

    if (curSlide < 0) curSlide = maxSlide;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const createDots = function () {
    slides.forEach((slide, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    // Add active class on the active dot.
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  // Initialize slide and dots
  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };

  init();

  // Slider - Setting slider at index[0]
  let curSlide = 0;

  // Button Event Listeners
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  // Dots Event Listener
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  // Setting Keyboard Events
  document.addEventListener("keydown", function (e) {
    console.log(e);
    e.key === "ArrowLeft" && prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });
};

slide();
