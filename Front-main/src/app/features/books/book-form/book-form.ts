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
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookForm implements OnInit {

  isEditMode = false;

  bookId?: number;

  bookForm!: FormGroup<{
    title: FormControl<string>;
    author: FormControl<string>;
    category: FormControl<string>;
    isbn: FormControl<string>;
    publishedYear: FormControl<number>;
  }>;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.bookForm = new FormGroup({

      title: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2)
        ]
      }),

      author: new FormControl('', {
        nonNullable: true,
        validators: Validators.required
      }),

      category: new FormControl('', {
        nonNullable: true,
        validators: Validators.required
      }),

      isbn: new FormControl('', {
        nonNullable: true,
        validators: Validators.required
      }),

      publishedYear: new FormControl(2026, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(1900),
          Validators.max(2026)
        ]
      })

    });

  }

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.isEditMode = true;

      this.bookId = Number(id);

      this.loadBook(this.bookId);

    }

  }

  loadBook(id: number): void {

    this.bookService
      .getBookById(id)
      .subscribe(book => {

        if (!book) {
          return;
        }

        this.bookForm.patchValue({

          title: book.title,
          author: book.author,
          category: book.category,
          isbn: book.isbn,
          publishedYear: book.publishedYear

        });

      });

  }

  saveBook(): void {

    if (this.bookForm.invalid) {

      this.bookForm.markAllAsTouched();

      return;

    }

    const formValue =
      this.bookForm.getRawValue();

    const newBook = {

      id: this.bookId ?? Date.now(),

      title: formValue.title,
      author: formValue.author,
      category: formValue.category,
      isbn: formValue.isbn,
      publishedYear: formValue.publishedYear,

      status: 'Available' as const

    };

    this.bookService
      .addBook(newBook)
      .subscribe(() => {

        this.router.navigate(['/books']);

      });

  }

}

