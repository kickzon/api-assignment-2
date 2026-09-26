// Hämtar alla recensioner från API:t för visning i adminpanelen.
async function fetchAdminReviews() {
  const messageElement = document.querySelector('#reviews-message')

  try {
    const response = await fetch(`${API_URL}/reviews`, {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Could not fetch reviews')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching reviews:', error)
    messageElement.textContent =
      'Det gick inte att hämta recensionerna. Försök igen senare.'
    return null
  }
}

// Hämtar böckerna och kopplar varje bok-id till rätt titel.
async function fetchAdminBookTitles() {
  try {
    const response = await fetch(`${API_URL}/books`)

    if (!response.ok) {
      throw new Error('Could not fetch books')
    }

    const books = await response.json()

    return new Map(books.map((book) => [book._id, book.title]))
  } catch (error) {
    console.error('Error fetching book titles:', error)
    return new Map()
  }
}

// Skapar en knapp som låter en admin radera en recension.
function createDeleteReviewButton(review) {
  const button = document.createElement('button')

  button.type = 'button'
  button.className = 'delete-review-button'
  button.textContent = 'Radera'

  button.addEventListener('click', async () => {
    const confirmed = window.confirm(
      `Vill du radera recensionen från ${review.name}?`,
    )

    if (!confirmed) {
      return
    }

    const messageElement = document.querySelector('#reviews-message')
    button.disabled = true

    try {
      const response = await fetch(`${API_URL}/reviews/${review._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.status === 401) {
        window.location.href = 'login.html'
        return
      }

      if (response.status === 403) {
        messageElement.textContent =
          'Du har inte behörighet att radera recensioner.'
        button.disabled = false
        return
      }

      if (!response.ok) {
        throw new Error('Could not delete review')
      }

      await loadAdminReviews()
      messageElement.textContent = 'Recensionen har raderats.'
    } catch (error) {
      console.error('Error deleting review:', error)
      messageElement.textContent =
        'Det gick inte att radera recensionen. Försök igen.'
      button.disabled = false
    }
  })

  return button
}

// Skapar och visar en tabellrad för varje recension.
function renderAdminReviews(reviews, bookTitles) {
  const listElement = document.querySelector('#admin-reviews-list')
  listElement.replaceChildren()

  if (reviews.length === 0) {
    const row = document.createElement('tr')
    const cell = document.createElement('td')

    cell.colSpan = 6
    cell.textContent = 'Det finns inga recensioner att visa.'

    row.appendChild(cell)
    listElement.appendChild(row)
    return
  }

  reviews.forEach((review) => {
    const row = document.createElement('tr')

    const bookCell = document.createElement('td')
    bookCell.dataset.label = 'Bok'
    bookCell.textContent = bookTitles.get(review.book_id) || 'Okänd bok'

    const nameCell = document.createElement('td')
    nameCell.dataset.label = 'Namn'
    nameCell.textContent = review.name

    const ratingCell = document.createElement('td')
    ratingCell.dataset.label = 'Betyg'
    ratingCell.textContent = `${review.rating} av 5`

    const contentCell = document.createElement('td')
    contentCell.dataset.label = 'Recension'
    contentCell.textContent = review.content

    const createdCell = document.createElement('td')
    createdCell.dataset.label = 'Skapad'
    createdCell.textContent = new Date(review.created_at).toLocaleDateString(
      'sv-SE',
    )

    const actionCell = document.createElement('td')
    actionCell.dataset.label = 'Åtgärd'
    actionCell.appendChild(createDeleteReviewButton(review))

    row.append(
      bookCell,
      nameCell,
      ratingCell,
      contentCell,
      createdCell,
      actionCell,
    )

    listElement.appendChild(row)
  })
}

// Laddar recensionerna och visar dem i adminpanelens tabell.
async function loadAdminReviews() {
  const messageElement = document.querySelector('#reviews-message')

  messageElement.textContent = 'Laddar recensioner...'

  const [reviews, bookTitles] = await Promise.all([
    fetchAdminReviews(),
    fetchAdminBookTitles(),
  ])

  if (!reviews) {
    return
  }

  messageElement.textContent = ''
  renderAdminReviews(reviews, bookTitles)
}