const BOOKS_PATH = '/books'

async function fetchBooks() {
  try {
    const response = await fetch(API_URL + BOOKS_PATH)
    const data = await response.json()
    return data
  } catch (e) {
    console.error('Error:', e)
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
  element.innerHTML = data
    .map(
      (book) => `
  <a href='book.html?id=${book._id}'>
  <img 
  src='${book.image}' 
  alt='${book.title}'>
  <h3>${book.title}</h3>
  </a>
  <p>${book.author}</p>
  <p>${book.published_year}</p>
  <p>${book.genres}</p>`,
    )
    .join('')
}

function renderAdminBooks(data) {
  const element = document.querySelector('.books-table-body')
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
  const data = await fetchBooks()
  renderPublicBooks(data)
}

async function initAdminBooks() {
  const data = await fetchBooks()
  renderAdminBooks(data)
}

initPublicBooks()
initAdminBooks()
// createBook(book)
