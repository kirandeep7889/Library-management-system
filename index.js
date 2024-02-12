function Book(id, title, author, isBorrowed = false) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isBorrowed = isBorrowed; 
}

let library = [];

function loadBooksFromLocalStorage() {
    const storedBooks = JSON.parse(localStorage.getItem('library'));
    if (storedBooks) {
        library = storedBooks.map(bookData => new Book(bookData.id, bookData.title, bookData.author, bookData.isBorrowed));
        displayBooks();
    }
}

function saveBooksToLocalStorage() {
    localStorage.setItem('library', JSON.stringify(library));
}

function showAlert(message, type = 'info', target) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `<i class="fas fa-${getIcon(type)}"></i> ${message}`; 
    target.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function getIcon(type) {
    switch (type) {
        case 'info':
            return 'info-circle';
        case 'warning':
            return 'exclamation-triangle';
        case 'success':
            return 'check-circle';
        case 'danger':
            return 'times-circle';
        default:
            return 'info-circle';
    }
}

function addBook() {
    const bookId = document.getElementById("bookId").value;
    const bookTitle = document.getElementById("bookTitle").value;
    const authorName = document.getElementById("authorName").value;

    if (!bookId || !bookTitle || !authorName) {
        showAlert("Please fill in all fields.", 'danger', document.getElementById("addBookAlertArea"));
        return;
    }

    const newBook = new Book(bookId, bookTitle, authorName);
    library.push(newBook);
    displayBooks();
    
    document.getElementById("bookId").value = "";
    document.getElementById("bookTitle").value = "";
    document.getElementById("authorName").value = "";
    showAlert(`Book "${newBook.title}" by ${newBook.author} added successfully.`, 'success', document.getElementById("addBookAlertArea"));
    saveBooksToLocalStorage();
}

function borrowBook(id) {
    const book = library.find(book => Number(book.id) === Number(id));
    if (book) {
        if (book.isBorrowed) {
            showAlert("Sorry, this book is already borrowed.", 'warning', document.getElementById("borrowReturnAlertArea"));
        } else {
            book.isBorrowed = true;
            displayBooks();
            showAlert(`You have successfully borrowed the book "${book.title}" by ${book.author}.`, 'success', document.getElementById("borrowReturnAlertArea"));
            saveBooksToLocalStorage();
        }
    } else {
        showAlert("Book not found.", 'danger', document.getElementById("borrowReturnAlertArea"));
    }
}

function returnBook(id) {
    const book = library.find(book => Number(book.id) === Number(id));
    if (book) {
        if (book.isBorrowed) {
            book.isBorrowed = false;
            displayBooks();
            showAlert(`You have successfully returned the book "${book.title}" by ${book.author}.`, 'success', document.getElementById("borrowReturnAlertArea"));
            saveBooksToLocalStorage();
        } else {
            showAlert("This book is not currently borrowed.", 'warning', document.getElementById("borrowReturnAlertArea"));
        }
    } else {
        showAlert("Book not found.", 'danger', document.getElementById("borrowReturnAlertArea"));
    }
}

function saveBooksToLocalStorage() {
    localStorage.setItem('library', JSON.stringify(library));
}

function loadBooksFromLocalStorage() {
    const storedBooks = JSON.parse(localStorage.getItem('library'));
    if (storedBooks) {
        library = storedBooks.map(bookData => new Book(bookData.id, bookData.title, bookData.author, bookData.isBorrowed));
        displayBooks();
    }
}

function displayBooks() {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    library.forEach(book => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>Title:</strong> ${book.title} <br> <strong>Author:</strong> ${book.author} <br>`;
        const button = document.createElement("button");
        button.textContent = book.isBorrowed ? "Return" : "Borrow";
        button.onclick = () => {
            book.isBorrowed ? returnBook(book.id) : borrowBook(book.id);
        };
        button.classList.add(book.isBorrowed ? 'returnButton' : 'borrowButton');
        listItem.appendChild(button);
        bookList.appendChild(listItem);
    });
}

function searchBook() {
    const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
    
    if (!searchTerm) {
        showAlert("Please enter a valid book title.", 'danger', document.getElementById("searchAlertArea"));
        return;
    }

    const foundBooks = library.filter(book => book.title.toLowerCase().includes(searchTerm));
    const searchResultsList = document.getElementById("searchResults");
    
    searchResultsList.innerHTML = ""; 

    if (foundBooks.length > 0) {
        foundBooks.forEach(book => {
            const listItem = document.createElement("li");
            listItem.textContent = `${book.title} by ${book.author}`;
            searchResultsList.appendChild(listItem);
        });
    } else {
        showAlert("No books found with the given title.", 'info', document.getElementById("searchAlertArea"));
    }
}

window.onload = function() {
        library.push(new Book(1, "The Great Gatsby", "F. Scott Fitzgerald"));
        library.push(new Book(2, "To Kill a Mockingbird", "Harper Lee"));
        library.push(new Book(3, "1984", "George Orwell"));
        library.push(new Book(4, "Pride and Prejudice", "Jane Austen"));
        library.push(new Book(5, "The Catcher in the Rye", "J.D. Salinger"));
        library.push(new Book(6, "To the Lighthouse", "Virginia Woolf"));
    
        displayBooks();
    
    loadBooksFromLocalStorage();
}

document.getElementById("addBookBtn").addEventListener("click", addBook);

document.getElementById("searchBtn").addEventListener("click", searchBook);
