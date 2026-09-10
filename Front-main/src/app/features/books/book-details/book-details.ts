import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Book } from '../../../models/book';
import { BookService } from '../../../core/services/book';
import { bookCoverDataUri } from '../../../shared/book-cover.util';

@Component({
  selector: 'app-book-details',
  imports: [RouterLink],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {

  book?: Book;

  notFound = false;

  loading = true;

  private placeholder = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.notFound = true;
      this.loading = false;
      return;
    }

    this.bookService.getBookById(id).subscribe(book => {
      this.loading = false;
      this.notFound = !book;
      this.book = book;
      if (book) {
        this.placeholder = bookCoverDataUri(book.title, book.author);
      }
    });
  }

  cover(): string {

    if (!this.book) {
      return '';
    }

    if (this.book.imageLink && /^https?:\/\//.test(this.book.imageLink)) {
      return this.book.imageLink;
    }

    return this.placeholder;
  }

  handleImageError(event: Event): void {

    const img = event.target as HTMLImageElement;

    if (this.book && img.src !== this.placeholder) {
      img.src = this.placeholder;
    }
  }

  toggleStatus(): void {

    if (!this.book) {
      return;
    }

    const next: Book['status'] =
      this.book.status === 'Available' ? 'Borrowed' : 'Available';

    this.bookService
      .updateBook(this.book.id, { status: next })
      .subscribe(updated => {
        if (updated) {
          this.book = updated;
        }
      });
  }

  deleteBook(): void {

    if (!this.book) {
      return;
    }

    if (!confirm(`Delete "${this.book.title}"?`)) {
      return;
    }

    this.bookService
      .deleteBook(this.book.id)
      .subscribe(() => this.router.navigate(['/books']));
  }

  formatYear(year: number): string {

    if (year < 0) {
      return `${Math.abs(year)} BC`;
    }

    return String(year);
  }
}
