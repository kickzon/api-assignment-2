const addBookBtn = document.querySelector('.add-book-btn')
const cancelBookForm = document.querySelector('#cancel-book-form')
const bookForm = document.querySelector('.create-book-form')
const modal = document.querySelector('.modal')
const titleInput = document.querySelector('#title')
const authorInput = document.querySelector('#author')
const descriptionInput = document.querySelector('#description')
const genresInput = document.querySelector('#genres')
const imageInput = document.querySelector('#image')
const publishedYearInput = document.querySelector('#published-year')

const titleError = document.querySelector('#title-error')
const authorError = document.querySelector('#author-error')
const descriptionError = document.querySelector('#description-error')
const genresError = document.querySelector('#genres-error')
const imageError = document.querySelector('#image-error')
const publishedYearError = document.querySelector('#published-year-error')

const bookFormMessage = document.querySelector('#book-form-message')
const createBookSubmit = document.querySelector('#create-book-submit')

const currentYear = new Date().getFullYear()
publishedYearInput.max = String(currentYear)

addBookBtn.addEventListener('click', showForm)
bookForm.addEventListener('submit', addBook)

// Visar ett valideringsfel vid ett fält i bokformuläret.
function showBookFieldError(input, errorElement, message) {
  errorElement.textContent = message
  input.classList.add('invalid')
  input.setAttribute('aria-invalid', 'true')
}

// Tar bort ett valideringsfel när användaren rättar fältet.
function clearBookFieldError(input, errorElement) {
  errorElement.textContent = ''
  input.classList.remove('invalid')
  input.removeAttribute('aria-invalid')
}

// Kontrollerar att bildadressen använder http eller https.
function isValidImageUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// Validerar bokformuläret och returnerar de rensade värdena.
function validateBookForm() {
  const title = titleInput.value.trim()
  const author = authorInput.value.trim()
  const description = descriptionInput.value.trim()
  const genres = genresInput.value
    .split(',')
    .map((genre) => genre.trim())
    .filter(Boolean)
  const image = imageInput.value.trim()
  const publishedYear = Number(publishedYearInput.value)

  let isValid = true

  clearBookFieldError(titleInput, titleError)
  clearBookFieldError(authorInput, authorError)
  clearBookFieldError(descriptionInput, descriptionError)
  clearBookFieldError(genresInput, genresError)
  clearBookFieldError(imageInput, imageError)
  clearBookFieldError(publishedYearInput, publishedYearError)

  if (!title) {
    showBookFieldError(
      titleInput,
      titleError,
      'Du måste ange en titel.',
    )
    isValid = false
  }

  if (author.length < 2) {
    showBookFieldError(
      authorInput,
      authorError,
      'Författarens namn måste innehålla minst 2 tecken.',
    )
    isValid = false
  }

  if (description.length < 10) {
    showBookFieldError(
      descriptionInput,
      descriptionError,
      'Beskrivningen måste innehålla minst 10 tecken.',
    )
    isValid = false
  }

  if (genres.length === 0) {
    showBookFieldError(
      genresInput,
      genresError,
      'Du måste ange minst en genre.',
    )
    isValid = false
  }

  if (!isValidImageUrl(image)) {
    showBookFieldError(
      imageInput,
      imageError,
      'Du måste ange en giltig bildadress med http eller https.',
    )
    isValid = false
  }

  if (
    !publishedYearInput.value ||
    !Number.isInteger(publishedYear) ||
    publishedYear < 0 ||
    publishedYear > currentYear
  ) {
    showBookFieldError(
      publishedYearInput,
      publishedYearError,
      `Utgivningsåret måste vara ett heltal mellan 0 och ${currentYear}.`,
    )
    isValid = false
  }

  if (!isValid) {
    bookForm.querySelector('.invalid').focus()
    return null
  }

  return {
    title,
    author,
    description,
    genres,
    image,
    published_year: publishedYear,
  }
}

const bookFields = [
  [titleInput, titleError],
  [authorInput, authorError],
  [descriptionInput, descriptionError],
  [genresInput, genresError],
  [imageInput, imageError],
  [publishedYearInput, publishedYearError],
]

// Rensar alla validerings- och statusmeddelanden i bokformuläret.
function clearBookFormFeedback() {
  bookFields.forEach(([input, errorElement]) => {
    clearBookFieldError(input, errorElement)
  })

  bookFormMessage.textContent = ''
  bookFormMessage.className = ''
}

bookFields.forEach(([input, errorElement]) => {
  input.addEventListener('input', () => {
    clearBookFieldError(input, errorElement)
    bookFormMessage.textContent = ''
    bookFormMessage.className = ''
  })
})

function showForm() {
  bookForm.reset()
  clearBookFormFeedback()
  modal.classList.remove('hidden')
  addBookBtn.classList.add('hidden')
}

// Stänger bokformuläret utan att spara något.
function hideForm() {
  bookForm.reset()
  clearBookFormFeedback()
  modal.classList.add('hidden')
  addBookBtn.classList.remove('hidden')
}

cancelBookForm.addEventListener('click', hideForm)

// Validerar och skickar en ny bok till API:t.
async function addBook(event) {
  event.preventDefault()

  const book = validateBookForm()

  if (!book) {
    return
  }

  createBookSubmit.disabled = true
  cancelBookForm.disabled = true
  createBookSubmit.textContent = 'Sparar bok...'
  bookFormMessage.textContent = 'Boken sparas...'
  bookFormMessage.className = ''

  try {
    await createBook(book)

    bookForm.reset()
    clearBookFormFeedback()
    modal.classList.add('hidden')
    addBookBtn.classList.remove('hidden')

    await initAdminBooks()
    showMessage('Boken har lagts till.')
  } catch (error) {
    console.error('Error creating book:', error)
    bookFormMessage.textContent =
      'Det gick inte att lägga till boken. Försök igen.'
    bookFormMessage.className = 'error'
  } finally {
    createBookSubmit.disabled = false
    cancelBookForm.disabled = false
    createBookSubmit.textContent = 'Lägg till bok'
  }
}
