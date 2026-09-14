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

function renderPublicBooks(data) {
  const element = document.querySelector('body') // Define right element later
  element.innerHTML = data
    .map(
      (book) => `
  <a href='#'>
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

// async function initPublicBooks() {
//   const data = await fetchBooks()
//   renderPublicBooks(data)
// }

// initPublicBooks()

// // protected.html
// const tableContainer = document.querySelector('body')
// tableContainer.innerHTML = `
// <table>
//   <thead>
//     <tr>
//       <th>Titel</th>
//       <th>Författare</th>
//       <th>Genrer</th>
//       <th>Skapad</th>
//     </tr>
//   </thead>
// </table>`

function renderAdminBooks(data) {
  const element = document.querySelector('table') // Define right element later
  element.innerHTML = data
    .map(
      (book) => `
  <tbody>
    <tr>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genres}</td>
      <td>${book.created_at}</td>
    </tr>
  </tbody>
  `,
    )
    .join('')
}

// async function initAdminBooks() {
//   const data = await fetchBooks()
//   renderAdminBooks(data)
// }

// initAdminBooks()

// Hard coded while testing
const id = '6aa6bacbe88fbfdaa210a01f'

async function fetchBook(id) {
  try {
    const response = await fetch(API_URL + BOOKS_PATH + `/${id}`)
    const data = await response.json()

    return data
  } catch (e) {
    console.error('Error:', e)
  }
}

function renderBook(book) {
  const element = document.querySelector('body') // Define right element later
  element.innerHTML = ` 
    Detta är innerHTML för en specifik bok med tillhörande reviews.`
}

// async function initBook() {
//   const data = await fetchBook(id)
//   renderBook(data)
// }

// initBook()
