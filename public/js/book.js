const params = new URLSearchParams(window.location.search)
const bookId = params.get('id')

const REVIEWS_PER_PAGE = 2
let visibleCount = REVIEWS_PER_PAGE

async function getBook() {
  const statusElement = document.querySelector('#book-status')

  if (!bookId) {
    statusElement.textContent = 'Ingen bok har valts.'
    statusElement.classList.add('error')
    return
  }

  try {
    const response = await fetch(`${API_URL}/books/${bookId}`)

    if (response.status === 404) {
      statusElement.textContent = 'Boken kunde inte hittas.'
      statusElement.classList.add('error')
      return
    }

    if (!response.ok) {
      throw new Error('Could not fetch book')
    }

    const book = await response.json()
    renderBook(book)
  } catch (error) {
    console.error('Error fetching book:', error)
    statusElement.textContent =
      'Det gick inte att hämta boken. Försök igen senare.'
    statusElement.classList.add('error')
  }
}

function starString(rating) {
  const rounded = Math.round(rating)
  return '★'.repeat(rounded) + '☆'.repeat(5 - rounded)
}

// Visar ett valideringsfel vid ett fält i recensionsformuläret.
function showReviewFieldError(input, errorElement, message) {
  errorElement.textContent = message
  input.classList.add('invalid')
  input.setAttribute('aria-invalid', 'true')
}

// Tar bort ett valideringsfel när användaren rättar fältet.
function clearReviewFieldError(input, errorElement) {
  errorElement.textContent = ''
  input.classList.remove('invalid')
  input.removeAttribute('aria-invalid')
}

// Kontrollerar recensionen och returnerar de rensade värdena.
function validateReviewForm(form) {
  const nameInput = form.querySelector('#review-name')
  const contentInput = form.querySelector('#review-content')
  const ratingInput = form.querySelector('#review-rating')

  const nameError = form.querySelector('#review-name-error')
  const contentError = form.querySelector('#review-content-error')
  const ratingError = form.querySelector('#review-rating-error')

  const name = nameInput.value.trim()
  const content = contentInput.value.trim()
  const rating = Number(ratingInput.value)
  let isValid = true

  clearReviewFieldError(nameInput, nameError)
  clearReviewFieldError(contentInput, contentError)
  clearReviewFieldError(ratingInput, ratingError)

  if (name.length < 2) {
    showReviewFieldError(
      nameInput,
      nameError,
      'Namnet måste innehålla minst 2 tecken.',
    )
    isValid = false
  }

  if (content.length < 10) {
    showReviewFieldError(
      contentInput,
      contentError,
      'Recensionen måste innehålla minst 10 tecken.',
    )
    isValid = false
  }

  if (
    !ratingInput.value ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    showReviewFieldError(
      ratingInput,
      ratingError,
      'Betyget måste vara ett heltal mellan 1 och 5.',
    )
    isValid = false
  }

  if (!isValid) {
    form.querySelector('.invalid').focus()
    return null
  }

  return {
    name,
    content,
    rating,
  }
}

function renderBook(book) {
  document.title = `Bokmärkt – ${book.title}`

  const avgRating = book.reviews.length
    ? (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(2)
    : null

  const genreList = Array.isArray(book.genres) ? book.genres : [book.genres]

  const container = document.querySelector('#book-container')
  container.innerHTML = `
    <div class="book-layout">
      <div class="book-image">
        <img src="${book.image}" alt="Omslag till ${book.title}">
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
      <form id="review-form" class="review-form hidden" novalidate>
      <div class="review-form-group">
        <label for="review-name">Ditt namn</label>
        <input
          type="text"
          id="review-name"
          name="name"
          minlength="2"
          maxlength="50"
          autocomplete="name"
          aria-describedby="review-name-error"
          required
        >
        <p
          id="review-name-error"
          class="review-field-error"
          aria-live="polite"
        ></p>
      </div>

    <div class="review-form-group">
      <label for="review-content">Din recension</label>
      <textarea
        id="review-content"
        name="content"
        minlength="10"
        maxlength="1000"
        aria-describedby="review-content-error"
        required
      ></textarea>
      <p
        id="review-content-error"
        class="review-field-error"
        aria-live="polite"
      ></p>
    </div>

    <div class="review-form-group">
      <label for="review-rating">Betyg, 1–5</label>
      <input
        type="number"
        id="review-rating"
        name="rating"
        min="1"
        max="5"
        step="1"
        aria-describedby="review-rating-error"
        required
      >
      <p
        id="review-rating-error"
        class="review-field-error"
        aria-live="polite"
      ></p>
    </div>

    <button type="submit">Skicka</button>
  </form>

      <p id="review-status" class="review-status" aria-live="polite"></p>

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

  const reviewFields = [
    [
      form.querySelector('#review-name'),
      form.querySelector('#review-name-error'),
    ],
    [
      form.querySelector('#review-content'),
      form.querySelector('#review-content-error'),
    ],
    [
      form.querySelector('#review-rating'),
      form.querySelector('#review-rating-error'),
    ],
  ]

  reviewFields.forEach(([input, errorElement]) => {
    input.addEventListener('input', () => {
      clearReviewFieldError(input, errorElement)
    })
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const validatedReview = validateReviewForm(form)

    if (!validatedReview) {
      return
    }

    const statusElement = document.querySelector('#review-status')
    const submitButton = form.querySelector('button[type="submit"]')

    statusElement.textContent = 'Recensionen skickas...'
    statusElement.className = 'review-status'
    submitButton.disabled = true

    const newReview = {
      ...validatedReview,
      book_id: bookId,
    }

    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      })

      if (!response.ok) {
        throw new Error('Could not create review')
      }

      form.reset()
      visibleCount = REVIEWS_PER_PAGE
      await getBook()

      const updatedStatusElement = document.querySelector('#review-status')
      updatedStatusElement.textContent = 'Recensionen har sparats!'
      updatedStatusElement.classList.add('success')
    } catch (error) {
      console.error('Error creating review:', error)
      statusElement.textContent =
        'Det gick inte att spara recensionen. Försök igen.'
      statusElement.classList.add('error')
      submitButton.disabled = false
    }
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