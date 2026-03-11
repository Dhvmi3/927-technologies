/* ============================================
   927 TECHNOLOGIES — CONTACT PAGE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. SCROLL REVEALS
     ============================================ */
  window.revealOnScroll('.contact-info',        { threshold: 0.08 })
  window.revealOnScroll('.contact-form-panel',  { threshold: 0.08, delay: 0.1 })


  /* ============================================
     2. SELECT STYLING — colour when value chosen
     ============================================ */
  document.querySelectorAll('.form-group select').forEach(select => {
    select.addEventListener('change', () => {
      select.classList.toggle('has-value', select.value !== '')
    })
  })


  /* ============================================
     3. FORM VALIDATION
     ============================================ */
  const rules = [
    { id: 'firstName',   errorId: 'firstNameError',   test: v => v.trim().length >= 2 },
    { id: 'lastName',    errorId: 'lastNameError',    test: v => v.trim().length >= 2 },
    { id: 'email',       errorId: 'emailError',       test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'projectType', errorId: 'projectTypeError', test: v => v !== '' },
    { id: 'budget',      errorId: 'budgetError',      test: v => v !== '' },
    { id: 'business',    errorId: 'businessError',    test: v => v.trim().length >= 5 },
  ]

  const validateField = (rule) => {
    const field = document.getElementById(rule.id)
    const error = document.getElementById(rule.errorId)
    if (!field || !error) return true
    const valid = rule.test(field.value)
    field.classList.toggle('error', !valid)
    error.classList.toggle('visible', !valid)
    return valid
  }

  // Live validation — clear errors as user types
  rules.forEach(rule => {
    const field = document.getElementById(rule.id)
    if (field) {
      field.addEventListener('input',  () => validateField(rule))
      field.addEventListener('change', () => validateField(rule))
    }
  })

  // Checkbox
  const consent      = document.getElementById('consent')
  const consentError = document.getElementById('consentError')

  const validateConsent = () => {
    const valid = consent && consent.checked
    if (consentError) consentError.classList.toggle('visible', !valid)
    return valid
  }

  if (consent) consent.addEventListener('change', validateConsent)


  /* ============================================
     4. FORM SUBMIT
     ============================================ */
  const form        = document.getElementById('contactForm')
  const formSuccess = document.getElementById('formSuccess')
  const submitBtn   = document.getElementById('submitBtn')
  const successEmail = document.getElementById('successEmail')

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      // Validate all fields
      const fieldResults  = rules.map(rule => validateField(rule))
      const consentResult = validateConsent()
      const allValid      = fieldResults.every(Boolean) && consentResult

      if (!allValid) {
        // Scroll to first error
        const firstError = form.querySelector('.error')
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
          firstError.focus()
        }
        return
      }

      // Grab the email for the success message
      const emailVal = document.getElementById('email').value

      // Show loading state
      submitBtn.classList.add('loading')
      submitBtn.textContent = 'Sending...'

      try {
        // Submit to Formspree
        const res = await fetch(form.action, {
          method:  'POST',
          body:    new FormData(form),
          headers: { 'Accept': 'application/json' }
        })

        if (res.ok) {
          // Show success
          if (successEmail) successEmail.textContent = emailVal

          form.style.opacity    = '0'
          form.style.transform  = 'translateY(-10px)'
          form.style.transition = 'opacity 0.4s ease, transform 0.4s ease'

          setTimeout(() => {
            form.style.display = 'none'
            document.querySelector('.contact-form-header').style.display = 'none'
            formSuccess.classList.add('visible')
          }, 400)

        } else {
          // Formspree returned an error
          submitBtn.classList.remove('loading')
          submitBtn.textContent = 'Send Enquiry'
          alert('Something went wrong. Please email us directly at contact927tech@gmail.com')
        }

      } catch (err) {
        // Network error
        submitBtn.classList.remove('loading')
        submitBtn.textContent = 'Send Enquiry'
        alert('Could not send message. Please email us directly at contact927tech@gmail.com')
      }
    })
  }

})
