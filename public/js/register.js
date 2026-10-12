const registerForm = document.querySelector('#register-form')
const usernameInput = document.querySelector('#username')
const passwordInput = document.querySelector('#password')
const usernameError = document.querySelector('#username-error')
const passwordError = document.querySelector('#password-error')
const registerMessage = document.querySelector('#register-message')
const registerButton = document.querySelector('#register-btn')

// Visar ett felmeddelande och markerar det berörda fältet.
function showFieldError(input, errorElement, message) {
  errorElement.textContent = message
  input.classList.add('invalid')
  input.setAttribute('aria-invalid', 'true')
}

// Tar bort felmeddelandet när användaren rättar ett fält.
function clearFieldError(input, errorElement) {
  errorElement.textContent = ''
  input.classList.remove('invalid')
  input.removeAttribute('aria-invalid')
}

// Kontrollerar registreringsfältens värden innan API-anropet görs.
function validateRegistration() {
  const username = usernameInput.value.trim()
  const password = passwordInput.value
  let isValid = true

  clearFieldError(usernameInput, usernameError)
  clearFieldError(passwordInput, passwordError)

  if (!username) {
    showFieldError(
      usernameInput,
      usernameError,
      'Du måste ange ett användarnamn.',
    )
    isValid = false
  } else if (username.length < 3) {
    showFieldError(
      usernameInput,
      usernameError,
      'Användarnamnet måste innehålla minst 3 tecken.',
    )
    isValid = false
  }

  if (!password) {
    showFieldError(
      passwordInput,
      passwordError,
      'Du måste ange ett lösenord.',
    )
    isValid = false
  } else if (password.length < 8) {
    showFieldError(
      passwordInput,
      passwordError,
      'Lösenordet måste innehålla minst 8 tecken.',
    )
    isValid = false
  }

  if (!isValid) {
    const firstInvalidInput = registerForm.querySelector('.invalid')
    firstInvalidInput.focus()
  }

  return isValid
}

// Skickar registreringen till API:t efter godkänd validering.
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  registerMessage.textContent = ''
  registerMessage.className = ''

  if (!validateRegistration()) {
    return
  }

  registerButton.disabled = true
  registerButton.textContent = 'Skapar konto...'

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value,
      }),
      credentials: 'include',
    })

    if (response.ok) {
      window.location.href = 'login.html'
      return
    }

    if (response.status === 409) {
      showFieldError(
        usernameInput,
        usernameError,
        'Användarnamnet är redan upptaget.',
      )
      usernameInput.focus()
      return
    }

    registerMessage.className = 'alert alert-danger'
    registerMessage.textContent = 'Registreringen misslyckades. Försök igen.'
  } catch (error) {
    console.error('Error registering user:', error)
    registerMessage.className = 'alert alert-danger'
    registerMessage.textContent = 'Det gick inte att ansluta till servern.'
  } finally {
    registerButton.disabled = false
    registerButton.textContent = 'Skapa konto'
  }
})

// Tar bort ett gammalt fel så fort användaren börjar rätta fältet.
usernameInput.addEventListener('input', () => {
  clearFieldError(usernameInput, usernameError)
})

passwordInput.addEventListener('input', () => {
  clearFieldError(passwordInput, passwordError)
})
