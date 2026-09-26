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

async function createBook(book) {
  try {
    const response = await fetch(API_URL + BOOKS_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    })
    const data = await response.json()
    console.log(data)
  } catch (e) {
    console.error('Error:', e)
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

function renderAdminBooks(data) {
  const element = document.querySelector('.books-table-body')
  if (!element) return
  element.innerHTML = data
    .map(
      (book) => `
    <tr>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genres}</td>
      <td>${book.created_at}</td>
    </tr>
  `,
    )
    .join('')
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
