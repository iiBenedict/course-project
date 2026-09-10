import { Component } from '@angular/core';
import {
  FormsModule,
  NgForm
} from '@angular/forms';

import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  login(form: NgForm): void {

    if (form.invalid) {
      this.errorMessage =
        'Please enter email and password';
      return;
    }

    const success =
      this.authService.login(
        form.value.email,
        form.value.password
      );

    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }
}
