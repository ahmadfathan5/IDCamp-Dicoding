const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(even) {
        even.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const titleBook = document.getElementById('title').value;
    const authorBook = document.getElementById('author').value;
    const yearBook = document.getElementById('year').value;
    const isCompleted = document.getElementById('complete').checked;

    const generatedID = generatedId();
    const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    alert('Yeay!! New Book!')
}

function generatedId() {
    return +new Date();
}

function generateBookObject(id, titleBook, authorBook, yearBook, isCompleted) {
    return {
        id,
        titleBook,
        authorBook,
        yearBook,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const unfinishedBookList = document.getElementById('incompleteBookshelfList');
    unfinishedBookList.innerHTML = '';

    const finishedBookList = document.getElementById('completeBookshelfList');
    finishedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = bookOnShelf(bookItem);
        if (!bookItem.isCompleted) {
            unfinishedBookList.append(bookElement);
        } else {
            finishedBookList.append(bookElement);
        }
    }

})

function bookOnShelf(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.titleBook;
        
    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Author: " + bookObject.authorBook;

    const textYear = document.createElement('p');
    textYear.innerText = "Year: " + bookObject.yearBook;

    const Article = document.createElement('article');
    Article.classList.add('book_item');
    Article.append(textTitle, textAuthor, textYear);
    Article.setAttribute('id', 'book-$bookObject.id');
    
    if (bookObject.isCompleted) {
        const buttonUnfinished = document.createElement('button');
        buttonUnfinished.classList.add('green');
        buttonUnfinished.innerText = "Unfinished";

        buttonUnfinished.addEventListener('click', function(){
            undoBookFromFinished(bookObject.id);
        });

        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('red');
        buttonDelete.innerText = "Delete";

        buttonDelete.addEventListener('click', function() {
            deleteBookFromList(bookObject.id);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        buttonContainer.append(buttonUnfinished, buttonDelete);
        
        Article.append(buttonContainer);
        
    } else {
        const buttonFinished = document.createElement('button');
        buttonFinished.classList.add('green');
        buttonFinished.innerText = "Finished";

        buttonFinished.addEventListener('click', function(){
            addBookToFinished(bookObject.id);
        });

        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('red');
        buttonDelete.innerText = "Delete";

        buttonDelete.addEventListener('click', function() {
            deleteBookFromList(bookObject.id);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        buttonContainer.append(buttonFinished, buttonDelete);  

        Article.append(buttonContainer);
    }    

    return Article;
}

function addBookToFinished (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    alert("let's read more book")
}

function deleteBookFromList(bookId){
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    alert('thank you for reading this book')
}

function undoBookFromFinished(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    alert('re-read this book')
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF-APPS';

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert('Your browser does not support local storage ');
        return false;
    }
    return true
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}