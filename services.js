// SERVICES PAGE JS — Live Calculator

document.addEventListener('DOMContentLoaded', () => {

  window.revealOnScroll('.services-hero-inner', { threshold: 0.1 })
  window.revealOnScroll('.sp-header', { threshold: 0.15 })
  window.revealOnScroll('.sp-card', { threshold: 0.08, stagger: 0.06 })
  window.revealOnScroll('.autopsy-what-item', { threshold: 0.08, stagger: 0.06 })
  window.revealOnScroll('.autopsy-tier', { threshold: 0.1, stagger: 0.08 })
  window.revealOnScroll('.addon-row', { threshold: 0.05, stagger: 0.03 })
  window.revealOnScroll('.maintenance-card', { threshold: 0.1 })
  window.revealOnScroll('.calc-layout', { threshold: 0.05 })

  // ── CALCULATOR ──
  const totalEl     = document.getElementById('calcTotal')
  const monthlyEl   = document.getElementById('calcMonthly')
  const breakdownEl = document.getElementById('calcBreakdown')
  const pagesCount  = document.getElementById('pagesCount')
  const pagesUp     = document.getElementById('pagesUp')
  const pagesDown   = document.getElementById('pagesDown')
  const hoursCount  = document.getElementById('hoursCount')
  const hoursUp     = document.getElementById('hoursUp')
  const hoursDown   = document.getElementById('hoursDown')

  let extraPages = 0
  let extraHours = 0

  const fmt = (n) => '$' + n.toLocaleString('en-US')

  // Define updateFloatingBar BEFORE recalc
  const floatingBar = document.getElementById('floatingCalcBar')
  const floatingTotal = document.getElementById('floatingCalcTotal')
  const updateFloatingBar = () => {
    if (!floatingBar || !floatingTotal) return
    const baseSelected = document.querySelector('input[name="base"]:checked')
    const total = totalEl.textContent

    if (baseSelected) {
      floatingTotal.textContent = total
      floatingBar.classList.add('visible')
    } else {
      floatingBar.classList.remove('visible')
    }
  }

  const recalc = () => {
    let total = 0
    let monthly = 0
    const lines = []

    // Base service (radio)
    const baseSelected = document.querySelector('input[name="base"]:checked')
    if (baseSelected) {
      const val = parseInt(baseSelected.value)
      total += val
      lines.push({ name: baseSelected.dataset.label, price: val })
    }

    // Add-ons (checkboxes)
    document.querySelectorAll('input[name="addon"]:checked').forEach(cb => {
      const val = parseInt(cb.value)
      total += val
      lines.push({ name: cb.dataset.label, price: val })
    })

    // Extra pages
    if (extraPages > 0) {
      const pagesCost = extraPages * 400
      total += pagesCost
      lines.push({ name: `${extraPages} extra page${extraPages > 1 ? 's' : ''}`, price: pagesCost })
    }

    // Extra hours (Site Autopsy)
    if (extraHours > 0) {
      const hoursCost = extraHours * 50
      total += hoursCost
      lines.push({ name: `${extraHours} extra hour${extraHours > 1 ? 's' : ''}`, price: hoursCost })
    }

    // Maintenance (separate recurring)
    const maintCb = document.querySelector('input[name="maintenance"]:checked')
    if (maintCb) {
      monthly = 300
    }

    // Update total
    totalEl.textContent = fmt(total)

    // Monthly indicator
    if (monthly > 0) {
      monthlyEl.style.display = 'block'
    } else {
      monthlyEl.style.display = 'none'
    }

    // Breakdown
    if (lines.length === 0) {
      breakdownEl.innerHTML = '<p class="calc-breakdown-empty">Select a service to begin.</p>'
    } else {
      breakdownEl.innerHTML = lines.map(l => `
        <div class="calc-breakdown-item">
          <span class="calc-breakdown-item-name">${l.name}</span>
          <span class="calc-breakdown-item-price">${fmt(l.price)}</span>
        </div>
      `).join('')

      if (monthly > 0) {
        breakdownEl.innerHTML += `
          <div class="calc-breakdown-item" style="border-top:1px solid var(--border);padding-top:0.5rem;margin-top:0.3rem;">
            <span class="calc-breakdown-item-name">Monthly Maintenance</span>
            <span class="calc-breakdown-item-price">${fmt(monthly)}/mo</span>
          </div>
        `
      }
    }

    // Update floating bar
    updateFloatingBar()
  }

  // Radio + checkbox listeners
  document.querySelectorAll('input[name="base"], input[name="addon"], input[name="maintenance"]')
    .forEach(input => input.addEventListener('change', recalc))

  // Extra pages
  pagesUp.addEventListener('click', () => {
    extraPages++
    pagesCount.textContent = extraPages
    recalc()
  })

  pagesDown.addEventListener('click', () => {
    if (extraPages > 0) {
      extraPages--
      pagesCount.textContent = extraPages
      recalc()
    }
  })

  // Extra hours
  hoursUp.addEventListener('click', () => {
    extraHours++
    hoursCount.textContent = extraHours
    recalc()
  })

  hoursDown.addEventListener('click', () => {
    if (extraHours > 0) {
      extraHours--
      hoursCount.textContent = extraHours
      recalc()
    }
  })

  // Initial calculation
  recalc()

  // ============================================
  // SECTION JUMP NAVIGATION
  // ============================================
  const jumpBtns = document.querySelectorAll('.jump-btn')
  jumpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-scroll')
      const targetEl = document.getElementById(targetId)
      if (targetEl) {
        const navbar = document.querySelector('.navbar')
        const offset = navbar ? navbar.offsetHeight + 20 : 80
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: targetPosition, behavior: 'smooth' })
      }
    })
  })

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  const backToTopBtn = document.getElementById('backToTop')

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible')
    } else {
      backToTopBtn.classList.remove('visible')
    }
  })

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  // FLOATING CALCULATOR BUTTON 
  const floatingBtn = document.getElementById('floatingCalcBtn')
  if (floatingBtn) {
    floatingBtn.addEventListener('click', () => {
      const targetEl = document.getElementById('calculator')
      if (targetEl) {
        const navbar = document.querySelector('.navbar')
        const offset = navbar ? navbar.offsetHeight + 20 : 80
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: targetPosition, behavior: 'smooth' })
      }
    })
  }

})