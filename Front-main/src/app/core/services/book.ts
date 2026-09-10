import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Book } from '../../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private books: Book[] = [

    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Programming',
      isbn: '9780132350884',
      publishedYear: 2008,
      status: 'Available'
    },

    {
      id: 2,
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      category: 'Programming',
      isbn: '9780135957059',
      publishedYear: 2019,
      status: 'Borrowed'
    },

    {
      id: 3,
      title: 'Atomic Habits',
      author: 'James Clear',
      category: 'Self Development',
      isbn: '9780735211292',
      publishedYear: 2018,
      status: 'Available'
    },

    {
      id: 4,
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      category: 'Programming',
      isbn: '9780596517748',
      publishedYear: 2008,
      status: 'Available'
    }

  ];


  getBooks(): Observable<Book[]> {
    return of(this.books);
  }


  getBookById(id: number): Observable<Book | undefined> {

    const book =
      this.books.find(book => book.id === id);

    return of(book);
  }


  addBook(book: Book): Observable<Book> {

    this.books.push(book);

    return of(book);
  }


  deleteBook(id: number): Observable<boolean> {

    this.books =
      this.books.filter(book => book.id !== id);

    return of(true);
  }

}
