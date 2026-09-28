const loginForm = document.querySelector('#login-form')
const loginUsernameInput = document.querySelector('#username')
const loginPasswordInput = document.querySelector('#password')
const loginUsernameError = document.querySelector('#login-username-error')
const loginPasswordError = document.querySelector('#login-password-error')
const loginMessage = document.querySelector('#login-message')
const loginButton = document.querySelector('#login-btn')

// Visar ett felmeddelande och markerar det berörda fältet.
function showLoginFieldError(input, errorElement, message) {
  errorElement.textContent = message
  input.classList.add('invalid')
  input.setAttribute('aria-invalid', 'true')
}

// Tar bort felmeddelandet när användaren rättar ett fält.
function clearLoginFieldError(input, errorElement) {
  errorElement.textContent = ''
  input.classList.remove('invalid')
  input.removeAttribute('aria-invalid')
}

// Tar bort det allmänna meddelandet ovanför formulärets länk.
function clearLoginMessage() {
  loginMessage.textContent = ''
  loginMessage.className = ''
}

// Kontrollerar att båda inloggningsfälten är ifyllda.
function validateLogin() {
  const username = loginUsernameInput.value.trim()
  const password = loginPasswordInput.value
  let isValid = true

  clearLoginFieldError(loginUsernameInput, loginUsernameError)
  clearLoginFieldError(loginPasswordInput, loginPasswordError)

  if (!username) {
    showLoginFieldError(
      loginUsernameInput,
      loginUsernameError,
      'Du måste ange ditt användarnamn.',
    )
    isValid = false
  }

  if (!password) {
    showLoginFieldError(
      loginPasswordInput,
      loginPasswordError,
      'Du måste ange ditt lösenord.',
    )
    isValid = false
  }

  if (!isValid) {
    const firstInvalidInput = loginForm.querySelector('.invalid')
    firstInvalidInput.focus()
  }

  return isValid
}

// Skickar inloggningen till API:t efter godkänd validering.
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  clearLoginMessage()

  if (!validateLogin()) {
    return
  }

  loginButton.disabled = true
  loginButton.textContent = 'Loggar in...'

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: loginUsernameInput.value.trim(),
        password: loginPasswordInput.value,
      }),
      credentials: 'include',
    })

    if (response.ok) {
      window.location.href = 'protected.html'
      return
    }

    loginMessage.className = 'alert alert-danger'
    loginMessage.textContent =
      response.status === 401
        ? 'Fel användarnamn eller lösenord.'
        : 'Inloggningen misslyckades. Försök igen.'
  } catch (error) {
    console.error('Error logging in:', error)
    loginMessage.className = 'alert alert-danger'
    loginMessage.textContent = 'Det gick inte att ansluta till servern.'
  } finally {
    loginButton.disabled = false
    loginButton.textContent = 'Logga in'
  }
})

// Tar bort gamla felmeddelanden när användaren börjar rätta fälten.
loginUsernameInput.addEventListener('input', () => {
  clearLoginFieldError(loginUsernameInput, loginUsernameError)
  clearLoginMessage()
})

loginPasswordInput.addEventListener('input', () => {
  clearLoginFieldError(loginPasswordInput, loginPasswordError)
  clearLoginMessage()
})
