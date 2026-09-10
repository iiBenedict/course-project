import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';

import { Book } from '../../models/book';

const STORAGE_KEY = 'libraryBooks_v2';
const SOURCE_URL = 'books2.json';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private booksSubject = new BehaviorSubject<Book[]>([]);

  books$ = this.booksSubject.asObservable();

  private loaded = false;

  constructor(private http: HttpClient) {
    this.hydrateFromStorage();
  }

  private hydrateFromStorage(): void {

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Book[];
      this.booksSubject.next(parsed);
      this.loaded = true;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.booksSubject.value));
  }

  private normalize(raw: any, index: number): Book {

    const title = String(raw.title ?? raw.TITLE ?? '').trim();

    const authorRaw = String(raw.author ?? raw.AUTHOR ?? '').trim();

    const category = raw.category ?? raw.CATEGORY ?? 'General';

    const idSource = raw.id ?? raw.ASIN ?? `seed-${index}`;

    const imageLink = raw.imageLink ?? raw.IMAGE_URL;

    const year = raw.year ?? raw.publishedYear;

    const isbnSource = raw.isbn ?? raw.ASIN;

    return {
      id: String(idSource),
      title: title || 'Untitled',
      author: authorRaw || 'Unknown',
      category: String(category).trim(),
      isbn: isbnSource != null ? String(isbnSource) : undefined,
      publishedYear:
        year != null && Number(year) !== 0 ? Number(year) : undefined,
      status: raw.status ?? 'Available',
      language: raw.language,
      country: raw.country,
      pages: raw.pages,
      imageLink: typeof imageLink === 'string' ? imageLink.trim() : undefined,
      link: typeof raw.link === 'string' ? raw.link.trim() : undefined
    };
  }

  loadIfNeeded(): Observable<Book[]> {

    if (this.loaded) {
      return of(this.booksSubject.value);
    }

    return this.http
      .get<any[]>(SOURCE_URL)
      .pipe(
        map(list => list.map((b, i) => this.normalize(b, i))),
        tap(books => {
          this.booksSubject.next(books);
          this.loaded = true;
          this.persist();
        })
      );
  }

  getBooks(): Observable<Book[]> {
    return this.loadIfNeeded();
  }

  searchBooks(term: string): Observable<Book[]> {
    return this.loadIfNeeded().pipe(map(books => this.filter(books, term)));
  }

  private filter(books: Book[], term: string): Book[] {

    const q = term.trim().toLowerCase();

    if (!q) {
      return books;
    }

    return books.filter(book =>
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      (book.category ?? '').toLowerCase().includes(q) ||
      (book.language ?? '').toLowerCase().includes(q) ||
      (book.country ?? '').toLowerCase().includes(q) ||
      String(book.publishedYear ?? '').includes(q) ||
      (book.isbn ?? '').toLowerCase().includes(q)
    );
  }

  getBookById(id: string): Observable<Book | undefined> {
    return this.loadIfNeeded().pipe(
      map(books => books.find(b => b.id === id))
    );
  }

  addBook(book: Omit<Book, 'id'> & { id?: string }): Observable<Book> {

    const newBook: Book = { ...book, id: book.id ?? this.generateId() };

    this.booksSubject.next([newBook, ...this.booksSubject.value]);

    this.persist();

    return of(newBook);
  }

  updateBook(id: string, changes: Partial<Book>): Observable<Book | undefined> {

    const list = this.booksSubject.value.slice();

    const idx = list.findIndex(b => b.id === id);

    if (idx === -1) {
      return of(undefined);
    }

    const updated = { ...list[idx], ...changes, id };

    list[idx] = updated;

    this.booksSubject.next(list);
    this.persist();

    return of(updated);
  }

  deleteBook(id: string): Observable<boolean> {

    this.booksSubject.next(
      this.booksSubject.value.filter(b => b.id !== id)
    );

    this.persist();

    return of(true);
  }

  categories(): Observable<string[]> {
    return this.loadIfNeeded().pipe(
      map(books => {
        const set = new Set<string>();
        for (const b of books) {
          if (b.category) {
            set.add(b.category);
          }
        }
        return Array.from(set).sort();
      })
    );
  }

  private generateId(): string {
    return 'book-' + Date.now().toString(36) +
      '-' + Math.random().toString(36).slice(2, 8);
  }
}
