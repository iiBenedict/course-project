import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private currentUserSubject =
    new BehaviorSubject<User | null>(null);

  currentUser$ =
    this.currentUserSubject.asObservable();

  constructor() {

    const savedUser =
      localStorage.getItem('libraryUser');

    if (savedUser) {
      this.currentUserSubject.next(
        JSON.parse(savedUser)
      );
    }
  }

  login(email: string, password: string): boolean {

    if (!email || !password) {
      return false;
    }

    const user: User = {
      id: 1,
      name: 'Ahmed',
      email: email,
      role: 'Admin'
    };

    localStorage.setItem(
      'libraryUser',
      JSON.stringify(user)
    );

    this.currentUserSubject.next(user);

    return true;
  }

  logout(): void {

    localStorage.removeItem('libraryUser');

    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
