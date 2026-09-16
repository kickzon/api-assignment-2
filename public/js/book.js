const params = new URLSearchParams(window.location.search)
const bookId = params.get('id')

async function getBook() {
  const response = await fetch(`${API_URL}/books/${bookId}`)
  const book = await response.json()
  renderBook(book)
}

function renderBook(book) {
  const container = document.querySelector('#book-container')
  container.innerHTML = `
    <img src="${book.image}" alt="${book.title}">
    <h1>${book.title}</h1>
    <p>${book.author}</p>
    <p>${book.published_year}</p>
    <p>${book.description}</p>
    <p>${book.genres}</p>
    <a href="index.html">Tillbaka</a>

    <h2>Skriv en recension</h2>
    <form id="review-form">
      <input type="text" name="name" placeholder="Ditt namn" required>
      <textarea name="content" placeholder="Din recension" required></textarea>
      <input type="number" name="rating" min="1" max="5" placeholder="Betyg (1-5)" required>
      <button type="submit">Skicka</button>
    </form>

    <h2>Reviews</h2>
    <div id="reviews-list">
      ${book.reviews.map(review => `
        <div>
          <p><strong>${review.name}</strong> - ${review.rating}/5</p>
          <p>${review.content}</p>
          <p><small>${review.created_at}</small></p>
        </div>
      `).join('')}
    </div>
  `

  const form = document.querySelector('#review-form')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(form)
    const newReview = {
      name: formData.get('name'),
      content: formData.get('content'),
      rating: formData.get('rating'),
      book_id: bookId,
    }

    await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview),
    })

    getBook()
  })
}

getBook()