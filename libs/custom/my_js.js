$(document).ready(function() {

  // Variables
  var $codeSnippets = $('.code-example-body'),
      $nav = $('.navbar'),
      $body = $('body'),
      $window = $(window),
      $popoverLink = $('[data-popover]'),
      navOffsetTop = $nav.offset().top,
      $document = $(document),
      entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
      }


  function initThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    const storageKey = "theme"; // "light" | "dark"

    function setTheme(theme) {
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        btn.querySelector(".theme-toggle__icon").textContent = "☀️";
        btn.querySelector(".theme-toggle__text").textContent = "Light";
        btn.setAttribute("aria-label", "Switch to light mode");
      } else {
        document.documentElement.removeAttribute("data-theme");
        btn.querySelector(".theme-toggle__icon").textContent = "🌙";
        btn.querySelector(".theme-toggle__text").textContent = "Dark";
        btn.setAttribute("aria-label", "Switch to dark mode");
      }
    }

    // initial theme: saved > system preference > light
    const saved = localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(saved || (prefersDark ? "dark" : "light"));

    btn.addEventListener("click", function () {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      localStorage.setItem(storageKey, next);
      setTheme(next);
    });
  }

  function initMobileMenu() {
    const btn = document.getElementById("mobileMenuBtn");
    const menu = document.getElementById("mobileMenu");
    if (!btn || !menu) return;

    function closeMenu() {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    }

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
      menu.setAttribute("aria-hidden", String(!isOpen));
    });

    // close if tapping outside
    document.addEventListener("click", closeMenu);

    // close on link click
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  }
  
  function init() {
    initThemeToggle();   // <-- add this
    initMobileMenu();
    $window.on('scroll', onScroll)
    $window.on('resize', resize)
    $popoverLink.on('click', openPopover)
    $document.on('click', closePopover)
    $('a[href^="#"]').on('click', smoothScroll)
    buildSnippets();
  }

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off("scroll");
    var target = this.hash,
        menu = target;
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top-40
    }, 0, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
    });
  }

  function openPopover(e) {
    e.preventDefault()
    closePopover();
    var popover = $($(this).data('popover'));
    popover.toggleClass('open')
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if($('.popover.open').length > 0) {
      $('.popover').removeClass('open')
    }
  }

  $("#button").click(function() {
    $('html, body').animate({
        scrollTop: $("#elementtoScrollToID").offset().top
    }, 2000);
});

  function resize() {
    $body.removeClass('has-docked-nav')
    navOffsetTop = $nav.offset().top
    onScroll()
  }

  function onScroll() {
    if(navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
      $body.addClass('has-docked-nav')
    }
    if(navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
      $body.removeClass('has-docked-nav')
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    $codeSnippets.each(function() {
      var newContent = escapeHtml($(this).html())
      $(this).html(newContent)
    })
  }

  document.addEventListener("DOMContentLoaded", function () {

  const sections = document.querySelectorAll(".section-page");
  const links = document.querySelectorAll(".nav-toggle");

  // Hide all sections
  sections.forEach(section => {
    section.style.display = "none";
  });

  // Show default section
  const defaultSection = document.getElementById("bio");
  if (defaultSection) {
    defaultSection.style.display = "block";
  }

  links.forEach(link => {
    link.addEventListener("click", function () {
      const targetId = this.dataset.target;

      sections.forEach(section => {
        section.style.display = "none";
      });

      const target = document.getElementById(targetId);
      if (target) {
        target.style.display = "block";
      }

      links.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  });

  init();

});


