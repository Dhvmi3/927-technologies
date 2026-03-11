/* ============================================
   927 TECHNOLOGIES — SHARED SCRIPTS
   927.js — navbar, burger, active nav, reveals
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. NAVBAR — Scroll behaviour
     ============================================ */
  const navbar = document.getElementById('navbar')

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40)
  }, { passive: true })


  /* ============================================
     2. BURGER MENU — Mobile toggle
     ============================================ */
  const burger   = document.getElementById('burger')
  const navLinks = document.getElementById('navLinks')

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open')
      navLinks.classList.toggle('open')
    })

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open')
        navLinks.classList.remove('open')
      })
    })
  }


  /* ============================================
     3. ACTIVE NAV LINK — Highlight current page
     ============================================ */
  const currentPath = window.location.pathname

  document.querySelectorAll('.navbar-links a').forEach(link => {
    const linkPath = new URL(link.href).pathname

    // Match exact page or root → index
    const isHome   = (linkPath === '/' || linkPath.endsWith('index.html'))
    const isCurrent = currentPath === linkPath ||
                      (isHome && (currentPath === '/' || currentPath.endsWith('index.html')))

    if (isCurrent) link.classList.add('active')
  })


  /* ============================================
     4. REVEAL ON SCROLL — Reusable utility
     Called from page-specific JS files like:
     window.revealOnScroll('.process-step', { stagger: 0.1 })
     ============================================ */
  window.revealOnScroll = (selector, options = {}) => {
    const {
      threshold = 0.12,
      delay     = 0,
      stagger   = 0
    } = options

    const elements = document.querySelectorAll(selector)
    if (!elements.length) return

    elements.forEach((el, i) => {
      el.classList.add('reveal')
      el.style.transitionDelay = `${delay + (i * stagger)}s`
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold })

    elements.forEach(el => observer.observe(el))
  }

})
