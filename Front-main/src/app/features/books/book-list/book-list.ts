import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';

import { Book } from '../../../models/book';
import { BookService } from '../../../core/services/book';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList implements OnInit {

  books: Book[] = [];

  constructor(
    private bookService: BookService
  ) {}

  ngOnInit(): void {

    this.loadBooks();

  }

  loadBooks(): void {

    this.bookService
      .getBooks()
      .subscribe({
        next: (data) => {
          this.books = data;
        },

        error: (error) => {
          console.error(error);
        }
      });

  }

  deleteBook(id: number): void {

    this.bookService
      .deleteBook(id)
      .subscribe(() => {

        this.loadBooks();

      });

  }
}
