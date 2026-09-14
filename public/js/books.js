async function fetchBooks() {
  try {
    const response = await fetch(API_URL + '/books')
    const data = await response.json()

    renderBooks(data)
  } catch (e) {
    console.error('Error:', e)
  }
}

fetchBooks()

function renderBooks(data) {
  const booksElement = document.querySelector('')
  booksElement.innerHTML = data
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
