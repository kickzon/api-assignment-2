const BOOKS_PATH = '/books'

async function fetchBooks() {
  try {
    const response = await fetch(API_URL + BOOKS_PATH)

    if (!response.ok) {
      throw new Error('Could not fetch books')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching books:', error)
    return null
  }
}

async function fetchBook(id) {
  try {
    const response = await fetch(API_URL + BOOKS_PATH + `/${id}`)
    const data = await response.json()
    return data
  } catch (e) {
    console.error('Error:', e)
  }
}

// Skapar en ny bok och returnerar API-svaret.
async function createBook(book) {
  const response = await fetch(`${API_URL}${BOOKS_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Could not create book: ${response.status}`)
  }

  return await response.json()
}

// Uppdaterar en befintlig bok och returnerar API-svaret.
async function updateBook(id, book) {
  const response = await fetch(`${API_URL}${BOOKS_PATH}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
    credentials: 'include',
  })

  if (response.status === 401) {
    window.location.href = 'login.html'
    return null
  }

  if (response.status === 403) {
    throw new Error('You are not allowed to update books')
  }

  if (!response.ok) {
    throw new Error(`Could not update book: ${response.status}`)
  }

  return await response.json()
}

// Raderar en bok efter att administratören har bekräftat valet.
async function handleDeleteBook(book) {
  const confirmed = window.confirm(
    `Vill du radera "${book.title}"? Bokens recensioner raderas också.`,
  )

  if (!confirmed) return

  showMessage('Boken raderas...')

  try {
    const response = await fetch(
      `${API_URL}${BOOKS_PATH}/${book._id}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    )

    if (response.status === 401) {
      window.location.href = 'login.html'
      return
    }

    if (response.status === 403) {
      showMessage('Du har inte behörighet att radera böcker.')
      return
    }

    if (!response.ok) {
      throw new Error(`Could not delete book: ${response.status}`)
    }

    await initAdminBooks()
    await loadAdminReviews()

    showMessage(`"${book.title}" har raderats.`)
  } catch (error) {
    console.error('Error deleting book:', error)
    showMessage('Det gick inte att radera boken.')
  }
}

function renderPublicBooks(data) {
  const element = document.querySelector('.books')
  if (!element) return
  element.innerHTML = data
    .map(
      (book) => `
  <article class="book-card">
    <a href="book.html?id=${book._id}" class="book-card-link">
      <img
        class="book-cover"
        src="${book.image}"
        alt="Omslag till ${book.title}"
      >
      <h3>${book.title}</h3>
    </a>

    <div class="book-info">
      <p class="book-author">${book.author}</p>
      <p>${book.published_year}</p>
      <p>${book.genres}</p>
    </div>
  </article>`,
    )
    .join('')
}

// Visar böckerna och deras adminåtgärder i boktabellen.
function renderAdminBooks(data) {
  const tableBody = document.querySelector('.books-table-body')

  if (!tableBody) return

  tableBody.replaceChildren()

  if (data.length === 0) {
    const row = document.createElement('tr')
    const cell = document.createElement('td')

    cell.colSpan = 6
    cell.textContent = 'Det finns inga böcker att visa.'

    row.appendChild(cell)
    tableBody.appendChild(row)
    return
  }

  data.forEach((book) => {
    const row = document.createElement('tr')

    const titleCell = document.createElement('td')
    titleCell.textContent = book.title

    const authorCell = document.createElement('td')
    authorCell.textContent = book.author

    const genresCell = document.createElement('td')
    genresCell.textContent = Array.isArray(book.genres)
      ? book.genres.join(', ')
      : book.genres

    const publishedYearCell = document.createElement('td')
    publishedYearCell.textContent = book.published_year

    const createdCell = document.createElement('td')
    createdCell.textContent = new Date(book.created_at).toLocaleDateString(
      'sv-SE',
    )

    const actionsCell = document.createElement('td')
    const actions = document.createElement('div')
    actions.className = 'book-actions'

    const editButton = document.createElement('button')
    editButton.type = 'button'
    editButton.className = 'book-action-button edit-book-button'
    editButton.textContent = 'Redigera'
    editButton.addEventListener('click', () => {
      showEditBookForm(book)
    })

    const deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.className = 'book-action-button delete-book-button'
    deleteButton.textContent = 'Radera'
    deleteButton.addEventListener('click', () => {
      handleDeleteBook(book)
    })

    actions.append(editButton, deleteButton)
    actionsCell.appendChild(actions)

    row.append(
      titleCell,
      authorCell,
      genresCell,
      publishedYearCell,
      createdCell,
      actionsCell,
    )

    tableBody.appendChild(row)
  })
}

async function initPublicBooks() {
  const booksElement = document.querySelector('.books')
  const statusElement = document.querySelector('#books-status')

  if (!booksElement) return

  const data = await fetchBooks()

  if (!data) {
    statusElement.textContent =
      'Det gick inte att hämta böckerna. Försök igen senare.'
    statusElement.classList.add('error')
    return
  }

  if (data.length === 0) {
    statusElement.textContent = 'Det finns inga böcker att visa ännu.'
    return
  }

  statusElement.hidden = true
  renderPublicBooks(data)
}

async function initAdminBooks() {
  const tableBody = document.querySelector('.books-table-body')

  if (!tableBody) return

  const data = await fetchBooks()

  if (!data) return

  renderAdminBooks(data)
}

initPublicBooks()
initAdminBooks()
// createBook(book)
