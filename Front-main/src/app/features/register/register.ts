import { Component } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  errorMessage = '';

  submitting = false;

  form = new FormGroup({

    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)]
    }),

    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    }),

    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    role: new FormControl<'Admin' | 'Librarian'>('Librarian', {
      nonNullable: true,
      validators: Validators.required
    })

  });

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  submit(): void {

    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (value.password !== value.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.submitting = true;

    this.authService
      .register({
        name: value.name,
        email: value.email,
        password: value.password,
        role: value.role
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.submitting = false;
          this.errorMessage = err?.message ?? 'Registration failed.';
        }
      });
  }
}
