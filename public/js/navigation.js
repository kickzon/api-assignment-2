// Anpassar navigationen efter om besökaren är inloggad.
async function initializeNavigation() {
  const navList = document.querySelector('.nav-list')

  if (!navList) return

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include',
    })

    if (!response.ok) {
      return
    }
    const user = await response.json()

    const registerLink = navList.querySelector(
      'a[href="register.html"]',
    )
    const loginLink = navList.querySelector('.nav-login-link')

    registerLink?.closest('li')?.remove()

    if (loginLink) {
      loginLink.href = 'protected.html'
      loginLink.textContent = user.is_admin ? 'Adminpanel' : 'Mitt konto'
      loginLink.classList.remove('nav-login-link')
    }

    const logoutItem = document.createElement('li')
    const logoutButton = document.createElement('button')

    logoutButton.type = 'button'
    logoutButton.className = 'nav-logout-button'
    logoutButton.textContent = 'Logga ut'

    logoutButton.addEventListener('click', async () => {
      logoutButton.disabled = true
      logoutButton.textContent = 'Loggar ut...'

      try {
        const logoutResponse = await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        })

        if (!logoutResponse.ok) {
          throw new Error(`Logout failed: ${logoutResponse.status}`)
        }

        window.location.href = 'index.html'
      } catch (error) {
        console.error('Error logging out:', error)
        logoutButton.disabled = false
        logoutButton.textContent = 'Logga ut'
        window.alert('Det gick inte att logga ut. Försök igen.')
      }
    })

    logoutItem.appendChild(logoutButton)
    navList.appendChild(logoutItem)
  } catch (error) {
    console.error('Error checking login status:', error)
  }
}

initializeNavigation()