/* ============================================
   927 TECHNOLOGIES — ABOUT PAGE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Helper to safely call revealOnScroll if it exists
  const safeReveal = (selector, options) => {
    if (typeof window.revealOnScroll === 'function') {
      window.revealOnScroll(selector, options)
    }
  }

  /* ============================================
     1. SCROLL REVEALS
     ============================================ */
  safeReveal('.about-hero-inner',  { threshold: 0.1 })

  safeReveal('.about-story-left',  { threshold: 0.15 })
  safeReveal('.about-story-right', { threshold: 0.15, delay: 0.12 })

  safeReveal('.about-values-header', { threshold: 0.15 })
  safeReveal('.value-item',          { threshold: 0.1, stagger: 0.08 })

  safeReveal('.about-skills-left',   { threshold: 0.15 })
  safeReveal('.about-skills-right',  { threshold: 0.15, delay: 0.1 })

  safeReveal('.about-why-inner .eyebrow',       { threshold: 0.15 })
  safeReveal('.about-why-inner .section-title', { threshold: 0.15, delay: 0.05 })
  safeReveal('.why-item',                       { threshold: 0.08, stagger: 0.07 })

  safeReveal('.about-cta-inner', { threshold: 0.2 })


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

  skillFills.forEach(fill => {
    // Trigger immediately if already visible (fallback)
    const rect = fill.getBoundingClientRect()
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0
    if (isVisible) {
      const targetPct = fill.getAttribute('data-width')
      fill.style.width = `${targetPct}%`
    } else {
      skillObserver.observe(fill)
    }
  })

})