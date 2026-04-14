//  927 TECHNOLOGIES — CONTACT PAGE

document.addEventListener('DOMContentLoaded', () => {

  window.revealOnScroll('.contact-info', { threshold: 0.08 })
  window.revealOnScroll('.contact-form-panel', { threshold: 0.08, delay: 0.1 })

  // Select styling (unchanged)
  document.querySelectorAll('.form-group select').forEach(select => {
    select.addEventListener('change', () => {
      select.classList.toggle('has-value', select.value !== '')
    })
  })

  // PROJECT TYPE: max 2 checkboxes
  const projectTypeCheckboxes = document.querySelectorAll('input[name="projectType"]')
  const projectTypeError = document.getElementById('projectTypeError')

  function validateProjectType() {
    const checked = Array.from(projectTypeCheckboxes).filter(cb => cb.checked)
    if (checked.length === 0) {
      projectTypeError.textContent = 'Please select at least one project type (max 2)'
      projectTypeError.classList.add('visible')
      return false
    } else if (checked.length > 2) {
      projectTypeError.textContent = 'You can select a maximum of 2 project types'
      projectTypeError.classList.add('visible')
      return false
    } else {
      projectTypeError.classList.remove('visible')
      return true
    }
  }

  projectTypeCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = Array.from(projectTypeCheckboxes).filter(c => c.checked)
      if (checked.length > 2) {
        cb.checked = false
        validateProjectType()
      } else {
        validateProjectType()
      }
    })
  })

  // Standard validation rules (budget field id is 'budget')
  const rules = [
    { id: 'firstName',   errorId: 'firstNameError',   test: v => v.trim().length >= 2 },
    { id: 'lastName',    errorId: 'lastNameError',    test: v => v.trim().length >= 2 },
    { id: 'email',       errorId: 'emailError',       test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'budget',      errorId: 'budgetError',      test: v => v !== '' && v !== 'Not Sure' ? true : v === 'Not Sure' ? true : false }, // allow Not Sure
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

  rules.forEach(rule => {
    const field = document.getElementById(rule.id)
    if (field) {
      field.addEventListener('input', () => validateField(rule))
      field.addEventListener('change', () => validateField(rule))
    }
  })

  // Budget special: allow "Not Sure"
  const budgetSelect = document.getElementById('budget')
  if (budgetSelect) {
    budgetSelect.addEventListener('change', () => {
      const valid = budgetSelect.value !== ''
      budgetSelect.classList.toggle('error', !valid)
      document.getElementById('budgetError').classList.toggle('visible', !valid)
    })
  }

  const consent = document.getElementById('consent')
  const consentError = document.getElementById('consentError')
  const validateConsent = () => {
    const valid = consent && consent.checked
    if (consentError) consentError.classList.toggle('visible', !valid)
    return valid
  }
  if (consent) consent.addEventListener('change', validateConsent)

  const form = document.getElementById('contactForm')
  const formSuccess = document.getElementById('formSuccess')
  const submitBtn = document.getElementById('submitBtn')
  const successEmail = document.getElementById('successEmail')

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const fieldResults = rules.map(rule => validateField(rule))
      const consentResult = validateConsent()
      const projectTypeResult = validateProjectType()
      const allValid = fieldResults.every(Boolean) && consentResult && projectTypeResult

      if (!allValid) {
        const firstError = form.querySelector('.error')
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
          firstError.focus()
        }
        return
      }

      const emailVal = document.getElementById('email').value

      submitBtn.classList.add('loading')
      submitBtn.textContent = 'Sending...'

      // Combine project types into a single string for form submission
      const selectedTypes = Array.from(projectTypeCheckboxes).filter(cb => cb.checked).map(cb => cb.value)
      const hiddenProjectType = document.createElement('input')
      hiddenProjectType.type = 'hidden'
      hiddenProjectType.name = 'projectType'
      hiddenProjectType.value = selectedTypes.join(', ')
      form.appendChild(hiddenProjectType)

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        })

        if (res.ok) {
          if (successEmail) successEmail.textContent = emailVal
          form.style.opacity = '0'
          form.style.transform = 'translateY(-10px)'
          form.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
          setTimeout(() => {
            form.style.display = 'none'
            document.querySelector('.contact-form-header').style.display = 'none'
            formSuccess.classList.add('visible')
          }, 400)
        } else {
          submitBtn.classList.remove('loading')
          submitBtn.textContent = 'Send Enquiry'
          alert('Something went wrong. Please email us directly at contact927tech@gmail.com')
        }
      } catch (err) {
        submitBtn.classList.remove('loading')
        submitBtn.textContent = 'Send Enquiry'
        alert('Could not send message. Please email us directly at contact927tech@gmail.com')
      } finally {
        hiddenProjectType.remove()
      }
    })
  }
})