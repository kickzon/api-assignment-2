const params = new URLSearchParams(window.location.search)
const bookId = params.get('id')

const REVIEWS_PER_PAGE = 2
let visibleCount = REVIEWS_PER_PAGE

async function getBook() {
  const response = await fetch(`${API_URL}/books/${bookId}`)
  const book = await response.json()
  renderBook(book)
}

function starString(rating) {
  const rounded = Math.round(rating)
  return '★'.repeat(rounded) + '☆'.repeat(5 - rounded)
}

function renderBook(book) {
  const avgRating = book.reviews.length
    ? (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(2)
    : null

  const genreList = Array.isArray(book.genres) ? book.genres : [book.genres]

  const container = document.querySelector('#book-container')
  container.innerHTML = `
    <div class="book-layout">
      <div class="book-image">
        <img src="${book.image}" alt="${book.title}">
      </div>

      <div class="book-info">
        <h1>${book.title}</h1>
        <h2>${book.author}</h2>
        <button class="rating-summary" onclick="document.querySelector('.reviews-section').scrollIntoView({ behavior: 'smooth' })">
  <span class="stars">${starString(avgRating || 0)}</span>
  ${avgRating ? `<span class="rating-number">${avgRating}</span> · ${book.reviews.length} recensioner` : 'Inga recensioner än'}
</button>
        <p>${book.published_year}</p>
        <p>${book.description}</p>
        <div class="genre-tags">
          ${genreList.map(g => `<span class="genre-tag">${g}</span>`).join('')}
        </div>
        <a href="index.html" class="back-link">← Tillbaka</a>
      </div>
    </div>

    <div class="reviews-section">
      <h2>Recensioner</h2>

      <button id="toggle-form-btn" class="toggle-form-btn">Skriv en recension</button>
      <form id="review-form" class="review-form hidden">
        <input type="text" name="name" placeholder="Ditt namn" required>
        <textarea name="content" placeholder="Din recension" required></textarea>
        <input type="number" name="rating" min="1" max="5" placeholder="Betyg (1-5)" required>
        <button type="submit">Skicka</button>
      </form>

      <div id="reviews-list"></div>
      <button id="show-more-btn" class="show-more-btn">Visa fler</button>
    </div>
  `

  renderReviewsList(book.reviews)

  const toggleFormBtn = document.querySelector('#toggle-form-btn')
  const form = document.querySelector('#review-form')

  toggleFormBtn.addEventListener('click', () => {
    form.classList.toggle('hidden')
  })

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

    visibleCount = REVIEWS_PER_PAGE
    getBook()
  })
}

function renderReviewsList(reviews) {
  const list = document.querySelector('#reviews-list')
  const showMoreBtn = document.querySelector('#show-more-btn')

  const visibleReviews = reviews.slice(0, visibleCount)

  list.innerHTML = visibleReviews.map(review => `
    <div class="review-card">
      <div class="review-header">
        <strong>${review.name}</strong>
        <span class="stars">${starString(review.rating)}</span>
      </div>
      <p>${review.content}</p>
      <small>${new Date(review.created_at).toLocaleDateString('sv-SE')}</small>
    </div>
  `).join('')

  if (visibleCount >= reviews.length) {
    showMoreBtn.style.display = 'none'
  } else {
    showMoreBtn.style.display = 'block'
    showMoreBtn.onclick = () => {
      visibleCount += REVIEWS_PER_PAGE
      renderReviewsList(reviews)
    }
  }
}

getBook()