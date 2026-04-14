// WORK

const SUPABASE_URL = 'https://orjrqhmiyemmldewzamt.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yanJxaG1peWVtbWxkZXd6YW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTg3ODYsImV4cCI6MjA4ODczNDc4Nn0.EGjrWMMS5ug4WnO7R8SHgkCa0P9dEw1uXdi98XnGiE8'


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
  safeReveal('.work-hero-inner', { threshold: 0.1 })
  safeReveal('.work-cta-inner',  { threshold: 0.2 })


  /* ============================================
     2. STATE
     ============================================ */
  let allProjects    = []
  let activeFilter   = 'all'
  let visibleCount   = 0
  const workGrid     = document.getElementById('workGrid')
  const workCount    = document.getElementById('workCount')
  const getBatchSize = () => window.innerWidth < 768 ? 3 : 6


  /* ============================================
     3. PLACEHOLDER DATA
     ============================================ */
  const getPlaceholders = () => [
    { name: 'Ember Kitchen',  category: 'Restaurant',   url: 'https://emberkitchen.netlify.app',       thumbnail: '' },
    { name: 'Luxe & Thread',  category: 'Fashion',      url: 'https://luxeandthread.netlify.app',      thumbnail: '' },
    { name: 'Apex Athletic',  category: 'Sports Brand', url: 'https://apexathlethic.netlify.app',      thumbnail: '' },
    { name: 'NeonVault',      category: 'Gaming Store', url: 'https://neonvaults.netlify.app',         thumbnail: '' },
    { name: 'Aurum Resort',   category: 'Luxury Hotel', url: 'https://aurumresortandspa.netlify.app',  thumbnail: '' },
  ]


  /* ============================================
     4. FILTER & RENDER HELPERS
     ============================================ */
  const getFilteredProjects = () => {
    if (activeFilter === 'all') return allProjects
    return allProjects.filter(p =>
      p.category.split(',').map(c => c.trim()).includes(activeFilter)
    )
  }

  const updateCount = (n) => {
    if (workCount) {
      workCount.textContent = `${n} project${n !== 1 ? 's' : ''}`
    }
  }

  const removeLoadMoreButton = () => {
    const existingBtn = document.querySelector('.load-more-btn')
    if (existingBtn) existingBtn.remove()
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

  const updateLoadMoreButton = () => {
    removeLoadMoreButton()
    const filtered = getFilteredProjects()
    if (visibleCount < filtered.length) {
      const btn = document.createElement('button')
      btn.className = 'btn btn-outline load-more-btn'
      const remaining = filtered.length - visibleCount
      btn.textContent = `Load More (${remaining} remaining)`
      btn.addEventListener('click', () => {
        const batchSize = getBatchSize()
        const nextBatch = filtered.slice(visibleCount, visibleCount + batchSize)
        visibleCount += nextBatch.length

        const newCardsHtml = nextBatch.map(p => `
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

        workGrid.insertAdjacentHTML('beforeend', newCardsHtml)
        safeReveal('.project-card', { threshold: 0.06, stagger: 0.06 })
        attachCardListeners()
        updateLoadMoreButton()
      })
      workGrid.insertAdjacentElement('afterend', btn)
    }
  }

  const renderGrid = (projects) => {
    const filtered = getFilteredProjects()
    if (!filtered.length) {
      workGrid.innerHTML = `<div class="no-results"><p>No projects in this category yet.</p></div>`
      updateCount(0)
      removeLoadMoreButton()
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

    updateCount(filtered.length)
    safeReveal('.project-card', { threshold: 0.06, stagger: 0.06 })
    attachCardListeners()
    updateLoadMoreButton()
  }

  const applyFilterAndRender = () => {
    const filtered = getFilteredProjects()
    visibleCount = Math.min(getBatchSize(), filtered.length)
    renderGrid(filtered.slice(0, visibleCount))
  }


  /* ============================================
     5. FETCH PROJECTS FROM SUPABASE
     ============================================ */
  const fetchProjects = async () => {
    if (SUPABASE_URL === 'PASTE_SUPABASE_URL_HERE') {
      allProjects = getPlaceholders()
      applyFilterAndRender()
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

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Supabase fetch failed:', res.status, errorText)
        throw new Error(`HTTP ${res.status}`)
      }

      allProjects = await res.json()

      if (!allProjects.length) {
        workGrid.innerHTML = '<div class="portfolio-empty"><p>Projects coming soon.</p></div>'
        updateCount(0)
        return
      }

      applyFilterAndRender()

    } catch (err) {
      console.error('Supabase fetch error:', err)
      workGrid.innerHTML = '<div class="portfolio-empty"><p>Could not load projects. Check console for details.</p></div>'
    }
  }


  /* ============================================
     6. FILTER BUTTONS
     ============================================ */
  const filterBtns = document.querySelectorAll('.filter-btn')

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      activeFilter = btn.getAttribute('data-filter')
      applyFilterAndRender()
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

  modalClose.addEventListener('click', closeModal)

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })


  /* ============================================
     8. INIT
     ============================================ */
  fetchProjects()

})