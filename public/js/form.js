const addBookBtn = document.querySelector('.add-book-btn')
const bookForm = document.querySelector('.create-book-form')
const modal = document.querySelector('.modal')

addBookBtn.addEventListener('click', showForm)
bookForm.addEventListener('submit', addBook)

function showForm() {
  bookForm.reset()
  modal.classList.remove('hidden')
  addBookBtn.classList.add('hidden')
}

async function addBook(event) {
  event.preventDefault()
  const formData = new FormData(bookForm)
  console.log(formData)

  const book = {
    title: formData.get('title'),
    author: formData.get('author'),
    description: formData.get('description'),
    genres: formData.get('genres').split(','),
    image: formData.get('image'),
    published_year: Number(formData.get('published_year')),
  }

  await createBook(book)
  window.location.reload()
}
