
class Book {
    constructor(title, author, total, read, rating, id) {
        this.title = title;
        this.author = author;
        this.total = total;
        this.read = read;
        this.pagesLeft = total - read;
        this.rating = rating;
        this.id = id;
    }
}

//vietinė knygu saugykla

class LocalStore {
    static getBooks() {
        let books;

        if (localStorage.getItem('books')) {
            books = JSON.parse(localStorage.getItem('books'));
        } else {
            books = [];
        }
        return books;
    }
    static addBook(book, index = -1) {
        let books = LocalStore.getBooks();
        if (index == -1) {
            books.push(book);
        } else {
            books.splice(index, 0, book);
        }
        localStorage.setItem('books', JSON.stringify(books));
    }
    static getBook(id) {
        let books = LocalStore.getBooks();
        let book = books.map((book) => {
            if (book.id === Number(id)) {
                return book;
            }
        }).filter(function (x) {
            return x !== undefined;
        });
        return book[0];
    }
    static getId() {
        let books = LocalStore.getBooks();
        let rand = Math.round(Math.random() * 100000000);
        let check = false;
        books.map((book) => {
            if (book.id == rand) {
                check = true;
            }
        })
        if (check) {
            return this.getId();
        }
        return rand;
    }
    static removeBook(id) {
        let books = LocalStore.getBooks();
        let indexNr;
        books.forEach((book, index) => {
            if (book.id === Number(id)) {
                books.splice(index, 1);
                indexNr = index;
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
        //indexNr grazinamas po naujos eilutes iterpimo
        return indexNr;
    }
}

//Naudotojo Interrfeisas 

class UI {
    static displayBooks() {
        const books = LocalStore.getBooks();
        books.forEach((book) => UI.addBook(book));
    }
    static addBook(book) {
        const list = document.getElementById('bookList');
        const rating = this.getRating(book.rating);
        const row = document.createElement('tr');
        row.id = book.id;
        row.innerHTML = `
        <th>${book.title}</th>
        <th>${book.author}</th>
        <th>${book.pagesLeft}</th>
        <th>${rating}</th>
        <td class="border-right">
        <a href="#" class="btn btn-sm delete fa fa-trash"></a>
        </td>
        <td>
        <a href="#booForm" class="btnSub"></a>
        </td>
        `;

        list.appendChild(row);
    }
    static editBook(book) {
        const row = document.getElementById(`${book.id}`);
        const rating = this.getRating(book.rating);
        row.innerHTML = `
        <th>${book.title}</th>
        <th>${book.author}</th>
        <th>${book.pagesLeft}</th>
        <th>${rating}</th>
        <td class="border-right">
        <a href="#" class="btn btn-sm delete fa fa-trash"></a>
        </td>
        <td>
        <a href="#booForm" class="btnSub"></a>
        </td>
        `;
    }

    //išvalo langus kai knyga idedama i lentiną
    static clearField() {
        document.getElementById("title").value = '';
        document.getElementById("author").value = '';
        document.getElementById("total").value = '';
        document.getElementById("read").value = '';
        document.querySelector('input[name="rate"]:checked').checked = 0;
    }
    //prideda knyga i lentyna
    static displayEditOptions(book) {
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("total").value = book.pagesTotal;
        document.getElementById("read").value = book.pagesRead;
        document.getElementById("book.rating").checked = 1;
        this.editBtn();
    }
    //pakecia mygtuka i edit
    static editBtn() {
        let btn = document.getElementById("submit");
        document.getElementById("submit").classList.remove('btnSub');
        document.getElementById("submit").classList.add('edbutton');
        btn.value = "Edit";
    }
    //pakecia migtuka i reset
    static resetBtn() {
        let btn = document.getElementById("submit");
        document.getElementById("submit").classList.add('btnSub');
        document.getElementById("submit").classList.remove('edbutton');
        btn.value = "Submit";
    }
    //erroro reportas arba parodo kad vekia gerai
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} pl-5 p-1`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const table = document.querySelector(".table");
        container.insertBefore(div, table);
        preventClick = 1;
        setTimeout(() => {
            document.querySelector('.alert').remove();
            preventClick = 0;
        }, 1250);
    }

    //getRating skirtas parodyti ir tinkamai suskaiciuoti reitinga is formos

    static getRating(rating) {
        let starRating = {
            'rate-1': `<span class="fas fa-star active"></span><span class="fas fa-star"></span><span class="fas fa-star"></span><span class="fas fa-star"></span><span class="fas fa-star"></span>`,
            'rate-2': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star"></span><span class="fas fa-star"></span><span class="fas fa-star"></span>`,
            'rate-3': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star"></span><span class="fas fa-star"></span>`,
            'rate-4': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star"></span>`,
            'rate-5': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span>`
        };
        return starRating[rating];
    }
    static deleteBook(element) {
        element.parentElement.parentElement.remove();
        UI.showAlert("Book has been deleted successfully", "success");
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);

// prideti arba redaguoti knygas jei visi langeliai turi reikšmes, su salyga jei langeliuose 'total pages' ir 'pages read'  yra skaiciai.

document.addEventListener('submit', function (e) {
    e.preventDefault();
    if (preventClick == 1) return;
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const total = document.querySelector("#total").value;
    const read = document.querySelector("#read").value;
    let rating = document.querySelector('input[name="rate"]:checked');
    if (!title || !author || !total || !read || !rating) {
        UI.showAlert("All fields should be filled. Rating is obligatory", "danger");
    } else if (!Number(read) || !Number(total)) {
        UI.showAlert("'Total pages' and 'Pages already read' fields should contain numeric values.", "danger");
    } else if (Number(total) < Number(read)) {
        UI.showAlert("'Pages already read' cannot exceed total pages.", "danger");
    } else if (editMode) {
        rating = rating.id;
        const book = new Book(title, author, total, read, rating, editMode);
        let index = LocalStore.removeBook(editMode);
        LocalStore.addBook(book, index);
        UI.editBook(book);
        editMode = 0;
        UI.resetBtn();
        UI.showAlert("Book has been edited successfully", "success");
        UI.clearField();
    } else {
        rating = rating.id;
        let id = LocalStore.getId();
        const book = new Book(title, author, total, read, rating, id);
        UI.addBook(book);
        LocalStore.addBook(book);
        UI.showAlert("Book has been added successfully", "success");
        UI.clearField();
    }
});

//prideti arba ismeti knyga is saraso

document.querySelector('#bookList').addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('delete')) {
        let id = e.target.parentElement.parentElement.id;
        LocalStore.removeBook(id);
        UI.deleteBook(e.target);
    } else if (e.target.classList.contains('edit')) {
        let id = e.target.parentElement.parentElement.id;
        let book = LocalStore.getBook(id);
        UI.displayEditOptions(book);
        editMode = book.id;
    }
});