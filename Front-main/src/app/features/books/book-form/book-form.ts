import { Component, OnInit } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { BookService } from '../../../core/services/book';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookForm implements OnInit {

  isEditMode = false;

  bookId?: string;

  submitting = false;

  errorMessage = '';

  bookForm!: FormGroup<{
    title: FormControl<string>;
    author: FormControl<string>;
    category: FormControl<string>;
    isbn: FormControl<string>;
    publishedYear: FormControl<number | null>;
    pages: FormControl<number | null>;
    imageLink: FormControl<string>;
    status: FormControl<'Available' | 'Borrowed'>;
  }>;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.bookForm = new FormGroup({

      title: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),

      author: new FormControl('', {
        nonNullable: true,
        validators: Validators.required
      }),

      category: new FormControl('General', {
        nonNullable: true,
        validators: Validators.required
      }),

      isbn: new FormControl('', { nonNullable: true }),

      publishedYear: new FormControl<number | null>(null),

      pages: new FormControl<number | null>(null),

      imageLink: new FormControl('', { nonNullable: true }),

      status: new FormControl<'Available' | 'Borrowed'>('Available', {
        nonNullable: true,
        validators: Validators.required
      })

    });
  }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.bookId = id;
      this.loadBook(id);
    }
  }

  loadBook(id: string): void {

    this.bookService.getBookById(id).subscribe(book => {

      if (!book) {
        this.errorMessage = 'Book not found.';
        return;
      }

      this.bookForm.patchValue({
        title: book.title,
        author: book.author,
        category: book.category ?? 'General',
        isbn: book.isbn ?? '',
        publishedYear: book.publishedYear ?? null,
        pages: book.pages ?? null,
        imageLink: book.imageLink ?? '',
        status: book.status
      });
    });
  }

  saveBook(): void {

    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const value = this.bookForm.getRawValue();

    const payload = {
      title: value.title.trim(),
      author: value.author.trim(),
      category: value.category.trim(),
      isbn: value.isbn.trim() || undefined,
      publishedYear: value.publishedYear ?? undefined,
      pages: value.pages ?? undefined,
      imageLink: value.imageLink.trim() || undefined,
      status: value.status
    };

    const request$ = this.isEditMode && this.bookId
      ? this.bookService.updateBook(this.bookId, payload)
      : this.bookService.addBook(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/books']),
      error: err => {
        this.submitting = false;
        this.errorMessage = err?.message ?? 'Failed to save book.';
      }
    });
  }
}
