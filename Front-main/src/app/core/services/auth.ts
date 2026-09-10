import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import { User } from '../../models/user';

interface StoredUser extends User {
  passwordHash: string;
}

const USER_KEY = 'libraryUser';
const USERS_KEY = 'libraryUsers';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {

    const savedUser = localStorage.getItem(USER_KEY);

    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    this.ensureDefaultAdmin();
  }

  private ensureDefaultAdmin(): void {

    const users = this.readUsers();

    if (users.length > 0) {
      return;
    }

    users.push({
      id: this.generateId(),
      name: 'Administrator',
      email: 'admin@library.local',
      role: 'Admin',
      passwordHash: this.hash('admin123')
    });

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private readUsers(): StoredUser[] {

    const raw = localStorage.getItem(USERS_KEY);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as StoredUser[];
    } catch {
      return [];
    }
  }

  private writeUsers(users: StoredUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private hash(input: string): string {

    let h = 0;

    for (let i = 0; i < input.length; i++) {
      h = (h * 31 + input.charCodeAt(i)) | 0;
    }

    return 'h_' + (h >>> 0).toString(16);
  }

  private generateId(): string {
    return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  private toPublic(user: StoredUser): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  login(email: string, password: string): Observable<User> {

    const normalized = email.trim().toLowerCase();

    const user = this.readUsers().find(u => u.email.toLowerCase() === normalized);

    if (!user || user.passwordHash !== this.hash(password)) {
      return throwError(() => new Error('Invalid email or password.'));
    }

    const publicUser = this.toPublic(user);

    localStorage.setItem(USER_KEY, JSON.stringify(publicUser));

    this.currentUserSubject.next(publicUser);

    return of(publicUser);
  }

  register(input: {
    name: string;
    email: string;
    password: string;
    role?: User['role'];
  }): Observable<User> {

    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (!name || !email || !input.password) {
      return throwError(() => new Error('All fields are required.'));
    }

    if (input.password.length < 6) {
      return throwError(() => new Error('Password must be at least 6 characters.'));
    }

    const users = this.readUsers();

    if (users.some(u => u.email.toLowerCase() === email)) {
      return throwError(() => new Error('An account with this email already exists.'));
    }

    const newUser: StoredUser = {
      id: this.generateId(),
      name,
      email,
      role: input.role ?? 'Librarian',
      passwordHash: this.hash(input.password)
    };

    users.push(newUser);

    this.writeUsers(users);

    const publicUser = this.toPublic(newUser);

    localStorage.setItem(USER_KEY, JSON.stringify(publicUser));

    this.currentUserSubject.next(publicUser);

    return of(publicUser);
  }

  logout(): void {
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
