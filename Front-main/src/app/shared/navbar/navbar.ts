import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { Auth } from '../../core/services/auth';

@Component({
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {

  constructor(public authService: Auth) {}

  logout(): void {
    this.authService.logout();
  }

  initials(name: string): string {

    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]!.toUpperCase())
      .join('');
  }
}
