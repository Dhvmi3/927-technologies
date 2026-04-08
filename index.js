// HOMEPAGE JS

const SUPABASE_URL = 'https://orjrqhmiyemmldewzamt.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yanJxaG1peWVtbWxkZXd6YW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTg3ODYsImV4cCI6MjA4ODczNDc4Nn0.EGjrWMMS5ug4WnO7R8SHgkCa0P9dEw1uXdi98XnGiE8'


document.addEventListener('DOMContentLoaded', () => {

// SCROLL REVEALS
  window.revealOnScroll('.hero-tag',     { threshold: 0.1 })
  window.revealOnScroll('.hero-content', { threshold: 0.1 })
  window.revealOnScroll('.hero-stats',   { threshold: 0.1, delay: 0.2 })

  window.revealOnScroll('.process-header',  { threshold: 0.15 })
  window.revealOnScroll('.process-step',    { threshold: 0.1, stagger: 0.12 })

  window.revealOnScroll('.services-header', { threshold: 0.15 })
  window.revealOnScroll('.service-card',    { threshold: 0.08, stagger: 0.07 })

  window.revealOnScroll('.portfolio-preview-header', { threshold: 0.15 })

  window.revealOnScroll('.pricing-header',  { threshold: 0.15 })
  window.revealOnScroll('.pricing-card',    { threshold: 0.1, stagger: 0.1 })

  window.revealOnScroll('.testimonials-inner .eyebrow',       { threshold: 0.15 })
  window.revealOnScroll('.testimonials-inner .section-title', { threshold: 0.15, delay: 0.05 })
  window.revealOnScroll('.testimonial-card',                  { threshold: 0.1, stagger: 0.1 })

  window.revealOnScroll('.cta-banner-inner', { threshold: 0.2 })


  /* ============================================
     2. HERO TITLE — Stagger line animation
     ============================================ */
  const heroLines = document.querySelectorAll('.hero-line')

  heroLines.forEach((line, i) => {
    line.style.opacity    = '0'
    line.style.transform  = 'translateY(30px)'
    line.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.1}s,
                              transform 0.8s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.1}s`
    setTimeout(() => {
      line.style.opacity   = '1'
      line.style.transform = 'translateY(0)'
    }, 50)
  })


  /* ============================================
     3. STATS COUNT-UP ANIMATION
     ============================================ */
  const statNumbers = document.querySelectorAll('.stat-number')

  const countUp = (el) => {
    const target   = parseInt(el.getAttribute('data-target'))
    const duration = 1800
    const start    = performance.now()

    const tick = (now) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      el.textContent = Math.round(eased * target)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target)
        statsObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })

  statNumbers.forEach(el => statsObserver.observe(el))


  /* ============================================
     4. PORTFOLIO — Fetch from Supabase
     Shows latest 6 projects on homepage
     ============================================ */
  const portfolioGrid = document.getElementById('portfolioGrid')

  const fetchProjects = async () => {
    if (SUPABASE_URL === 'PASTE_SUPABASE_URL_HERE') {
      renderPlaceholders()
      return
    }

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc&limit=6`,
        {
          headers: {
            'apikey':        SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type':  'application/json'
          }
        }
      )

      if (!res.ok) throw new Error('Failed to fetch')

      const projects = await res.json()

      if (!projects.length) {
        portfolioGrid.innerHTML = `<div class="portfolio-empty"><p>Projects coming soon.</p></div>`
        return
      }

      renderProjects(projects)

    } catch (err) {
      console.error('Supabase fetch error:', err)
      portfolioGrid.innerHTML = `<div class="portfolio-empty"><p>Could not load projects.</p></div>`
    }
  }

  // ============================================
  // Project showcase
  // ============================================
  const buildCard = (p, showPlaceholder = false) => {
    const primaryCategory = p.category
      ? p.category.split(',')[0].trim()
      : ''

    const imgContent = showPlaceholder
      ? `<div style="width:100%;height:100%;background:var(--surface-alt);display:flex;align-items:center;justify-content:center;">
           <span style="font-size:0.65rem;letter-spacing:0.2em;color:var(--muted);text-transform:uppercase;">Preview</span>
         </div>`
      : `<img src="${p.thumbnail}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'" />`

    return `
      <div class="project-card" data-url="${p.url}" data-name="${p.name}">
        <div class="project-card-img">
          ${imgContent}
          <div class="project-card-overlay">
            <div class="project-card-play">&#9658;</div>
          </div>
        </div>
        <div class="project-card-info">
          <span class="project-card-name">${p.name}</span>
          <span class="project-card-category">${primaryCategory}</span>
        </div>
      </div>`
  }

  const renderProjects = (projects) => {
    portfolioGrid.innerHTML = projects.map(p => buildCard(p)).join('')
    window.revealOnScroll('.project-card', { threshold: 0.08, stagger: 0.08 })
    attachCardListeners()
  }

  const renderPlaceholders = () => {
    const placeholders = [
      { name: 'Ember Kitchen', category: 'Restaurant',   url: 'https://emberkitchen.netlify.app',      thumbnail: '' },
      { name: 'Luxe & Thread', category: 'Fashion',      url: 'https://luxeandthread.netlify.app',     thumbnail: '' },
      { name: 'Apex Athletic', category: 'Sports Brand', url: 'https://apexathlethic.netlify.app',     thumbnail: '' },
      { name: 'NeonVault',     category: 'Gaming Store', url: 'https://neonvaults.netlify.app',        thumbnail: '' },
      { name: 'Aurum Resort',  category: 'Luxury Hotel', url: 'https://aurumresortandspa.netlify.app', thumbnail: '' },
    ]
    portfolioGrid.innerHTML = placeholders.map(p => buildCard(p, true)).join('')
    window.revealOnScroll('.project-card', { threshold: 0.08, stagger: 0.08 })
    attachCardListeners()
  }

  fetchProjects()


  /* ============================================
     5. PROJECT VIEWER MODAL
     ============================================ */
  const modalOverlay = document.getElementById('modalOverlay')
  const modalIframe  = document.getElementById('modalIframe')
  const modalUrl     = document.getElementById('modalUrl')
  const modalClose   = document.getElementById('modalClose')

  const openModal = (url, name) => {
    modalIframe.src      = url
    modalUrl.textContent = url
    modalOverlay.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    modalOverlay.classList.remove('open')
    document.body.style.overflow = ''
    setTimeout(() => { modalIframe.src = '' }, 500)
  }

  const attachCardListeners = () => {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        openModal(
          card.getAttribute('data-url'),
          card.getAttribute('data-name')
        )
      })
    })
  }

  modalClose.addEventListener('click', closeModal)

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })

  window.openProjectModal = openModal

})
