/* ============================================
   927 TECHNOLOGIES — WORK PAGE SCRIPTS
   ============================================ */
const SUPABASE_URL = 'https://orjrqhmiyemmldewzamt.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yanJxaG1peWVtbWxkZXd6YW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTg3ODYsImV4cCI6MjA4ODczNDc4Nn0.EGjrWMMS5ug4WnO7R8SHgkCa0P9dEw1uXdi98XnGiE8'


document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. SCROLL REVEALS
     ============================================ */
  window.revealOnScroll('.work-hero-inner', { threshold: 0.1 })
  window.revealOnScroll('.work-cta-inner',  { threshold: 0.2 })


  /* ============================================
     2. STATE
     ============================================ */
  let allProjects    = []   // full list from Supabase
  let activeFilter   = 'all'
  const workGrid     = document.getElementById('workGrid')
  const workCount    = document.getElementById('workCount')


  /* ============================================
     3. FETCH PROJECTS FROM SUPABASE
     ============================================ */
  const fetchProjects = async () => {

    // If keys not yet set, load placeholder data
    if (SUPABASE_URL === 'PASTE_SUPABASE_URL_HERE') {
      allProjects = getPlaceholders()
      renderGrid(allProjects)
      return
    }

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`,
        {
          headers: {
            'apikey':        SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type':  'application/json'
          }
        }
      )

      if (!res.ok) throw new Error('Fetch failed')

      allProjects = await res.json()

      if (!allProjects.length) {
        workGrid.innerHTML = '<div class="portfolio-empty"><p>Projects coming soon.</p></div>'
        updateCount(0)
        return
      }

      renderGrid(allProjects)

    } catch (err) {
      console.error('Supabase fetch error:', err)
      workGrid.innerHTML = '<div class="portfolio-empty"><p>Could not load projects.</p></div>'
    }
  }


  /* ============================================
     4. RENDER GRID
     ============================================ */
  const renderGrid = (projects) => {
    if (!projects.length) {
      workGrid.innerHTML = `
        <div class="no-results">
          <p>No projects in this category yet.</p>
        </div>`
      updateCount(0)
      return
    }

    workGrid.innerHTML = projects.map(p => `
      <div class="project-card" data-url="${p.url}" data-name="${p.name}" data-category="${p.category}">
        <div class="project-card-img">
          ${p.thumbnail
            ? `<img src="${p.thumbnail}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'" />`
            : `<div style="width:100%;height:100%;background:var(--surface-alt);display:flex;align-items:center;justify-content:center;">
                 <span style="font-size:0.62rem;letter-spacing:0.2em;color:var(--muted);text-transform:uppercase;">Preview</span>
               </div>`
          }
          <div class="project-card-overlay">
            <div class="project-card-play">▶</div>
          </div>
        </div>
        <div class="project-card-info">
          <span class="project-card-name">${p.name}</span>
          <span class="project-card-category">${p.category}</span>
        </div>
      </div>
    `).join('')

    updateCount(projects.length)

    // Stagger cards in
    window.revealOnScroll('.project-card', { threshold: 0.06, stagger: 0.06 })

    // Attach modal listeners
    attachCardListeners()
  }


  /* ============================================
     5. UPDATE COUNT LABEL
     ============================================ */
  const updateCount = (n) => {
    if (workCount) {
      workCount.textContent = `${n} project${n !== 1 ? 's' : ''}`
    }
  }


  /* ============================================
     6. FILTER BUTTONS
     ============================================ */
  const filterBtns = document.querySelectorAll('.filter-btn')

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      activeFilter = btn.getAttribute('data-filter')

      // ============================================
      // Category is a comma-separated string e.g. "Multi-Page, Luxury Hotel"
      // so we split and check if the active filter is included
      // ============================================
      const filtered = activeFilter === 'all'
        ? allProjects
        : allProjects.filter(p =>
            p.category
              .split(',')
              .map(c => c.trim())
              .includes(activeFilter)
          )

      // Fade out existing cards then render new ones
      const existingCards = workGrid.querySelectorAll('.project-card')
      existingCards.forEach(card => {
        card.style.opacity   = '0'
        card.style.transform = 'translateY(10px)'
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
      })

      setTimeout(() => renderGrid(filtered), 280)
    })
  })


  /* ============================================
     7. MODAL
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


  /* ============================================
     8. PLACEHOLDER DATA
     Shown before Supabase keys are configured
     ============================================ */
  const getPlaceholders = () => [
    { name: 'Ember Kitchen',  category: 'Restaurant',   url: 'https://emberkitchen.netlify.app',       thumbnail: '' },
    { name: 'Luxe & Thread',  category: 'Fashion',      url: 'https://luxeandthread.netlify.app',      thumbnail: '' },
    { name: 'Apex Athletic',  category: 'Sports Brand', url: 'https://apexathlethic.netlify.app',      thumbnail: '' },
    { name: 'NeonVault',      category: 'Gaming Store', url: 'https://neonvaults.netlify.app',         thumbnail: '' },
    { name: 'Aurum Resort',   category: 'Luxury Hotel', url: 'https://aurumresortandspa.netlify.app',  thumbnail: '' },
  ]


  /* ============================================
     9. INIT
     ============================================ */
  fetchProjects()

})
