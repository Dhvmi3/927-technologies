/* ============================================
   927 TECHNOLOGIES — ABOUT PAGE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. SCROLL REVEALS
     ============================================ */
  window.revealOnScroll('.about-hero-inner',  { threshold: 0.1 })

  window.revealOnScroll('.about-story-left',  { threshold: 0.15 })
  window.revealOnScroll('.about-story-right', { threshold: 0.15, delay: 0.12 })

  window.revealOnScroll('.about-values-header', { threshold: 0.15 })
  window.revealOnScroll('.value-item',          { threshold: 0.1, stagger: 0.08 })

  window.revealOnScroll('.about-skills-left',   { threshold: 0.15 })
  window.revealOnScroll('.about-skills-right',  { threshold: 0.15, delay: 0.1 })

  window.revealOnScroll('.about-why-inner .eyebrow',       { threshold: 0.15 })
  window.revealOnScroll('.about-why-inner .section-title', { threshold: 0.15, delay: 0.05 })
  window.revealOnScroll('.why-item',                       { threshold: 0.08, stagger: 0.07 })

  window.revealOnScroll('.about-cta-inner', { threshold: 0.2 })


  /* ============================================
     2. SKILL BARS — Animate width on scroll
     ============================================ */
  const skillFills = document.querySelectorAll('.skill-fill')

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill      = entry.target
        const targetPct = fill.getAttribute('data-width')
        fill.style.width = `${targetPct}%`
        skillObserver.unobserve(fill)
      }
    })
  }, { threshold: 0.4 })

  skillFills.forEach(fill => skillObserver.observe(fill))

})
