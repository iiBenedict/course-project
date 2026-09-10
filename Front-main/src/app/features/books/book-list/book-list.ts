import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Book } from '../../../models/book';
import { BookService } from '../../../core/services/book';
import { bookCoverDataUri } from '../../../shared/book-cover.util';

type ViewMode = 'grid' | 'table';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList implements OnInit {

  books: Book[] = [];

  filtered: Book[] = [];

  categories: string[] = [];

  loading = false;

  searchTerm = '';

  statusFilter: 'All' | 'Available' | 'Borrowed' = 'All';

  categoryFilter = 'All';

  view: ViewMode = 'grid';

  private coverCache = new Map<string, string>();

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: data => {
        this.books = data;
        this.categories = Array.from(
          new Set(data.map(b => b.category).filter(Boolean))
        ).sort();
        this.applyFilters();
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    const q = this.searchTerm.trim().toLowerCase();

    this.filtered = this.books.filter(book => {
      if (this.statusFilter !== 'All' && book.status !== this.statusFilter) {
        return false;
      }
      if (this.categoryFilter !== 'All' && book.category !== this.categoryFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.category ?? '').toLowerCase().includes(q) ||
        (book.isbn ?? '').toLowerCase().includes(q)
      );
    });
  }

  onSearchChange(): void { this.applyFilters(); }
  setStatusFilter(status: 'All' | 'Available' | 'Borrowed'): void {
    this.statusFilter = status;
    this.applyFilters();
  }
  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'All';
    this.categoryFilter = 'All';
    this.applyFilters();
  }
  setView(view: ViewMode): void { this.view = view; }

  deleteBook(id: string, title: string): void {
    if (!confirm(`Remove "${title}" from the catalogue?`)) {
      return;
    }
    this.bookService.deleteBook(id).subscribe(() => this.loadBooks());
  }

  coverFor(book: Book): string {
    if (book.imageLink && /^https?:\/\//.test(book.imageLink)) {
      return book.imageLink;
    }
    const cached = this.coverCache.get(book.id);
    if (cached) {
      return cached;
    }
    const uri = bookCoverDataUri(book.title, book.author);
    this.coverCache.set(book.id, uri);
    return uri;
  }

  handleImageError(event: Event, book: Book): void {
    const img = event.target as HTMLImageElement;
    const placeholder = bookCoverDataUri(book.title, book.author);
    this.coverCache.set(book.id, placeholder);
    if (img.src !== placeholder) {
      img.src = placeholder;
    }
  }
}
