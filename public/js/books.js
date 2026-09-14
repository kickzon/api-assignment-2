const BOOKS_PATH = '/books'

async function fetchBooks() {
  try {
    const response = await fetch(API_URL + BOOKS_PATH)
    const data = await response.json()

    renderBooks(data)
  } catch (e) {
    console.error('Error:', e)
  }
}

fetchBooks()

function renderBooks(data) {
  const element = document.querySelector('')
  element.innerHTML = data
    .map(
      (book) => `
  <a href='#'>
  <img src='${book.image}' alt='${book.title}'>
  <h3>${book.title}</h3>
  </a>
  <p>${book.author}</p>
  <p>${book.published_year}</p>
  <p>${book.genres}</p>`,
    )
    .join('')
}

// // Hard coded while testing
// const id = '6aa6bacbe88fbfdaa210a01f'

async function fetchBook(id) {
  try {
    const response = await fetch(API_URL + BOOKS_PATH + `/${id}`)
    const data = await response.json()

    renderBook(data)
  } catch (e) {
    console.error('Error:', e)
  }
}

fetchBook(id)

function renderBook(book) {
  const element = document.querySelector('')
  element.innerHTML = `
    <img src='${book.image}' alt='${book.title}'>
    <h3>${book.title}</h3>
    <p>${book.author}</p>
    <p>${book.published_year}</p>
    <p>${book.genres}</p>`
}
