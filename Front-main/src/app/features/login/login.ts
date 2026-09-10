import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  errorMessage = '';

  submitting = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  login(form: NgForm): void {

    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please enter a valid email and password.';
      return;
    }

    this.submitting = true;

    this.authService
      .login(form.value.email, form.value.password)
      .subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.submitting = false;
          this.errorMessage = err?.message ?? 'Login failed.';
        }
      });
  }
}
