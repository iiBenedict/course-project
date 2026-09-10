import { Routes } from '@angular/router';

import { Login } from './features/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { BookList } from './features/books/book-list/book-list';
import { BookDetails } from './features/books/book-details/book-details';
import { BookForm } from './features/books/book-form/book-form';
import { MemberList } from './features/members/member-list/member-list';
import { LoanList } from './features/loans/loan-list/loan-list';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'books',
    component: BookList,
    canActivate: [authGuard]
  },

  {
    path: 'books/new',
    component: BookForm,
    canActivate: [authGuard]
  },

  {
    path: 'books/:id',
    component: BookDetails,
    canActivate: [authGuard]
  },

  {
    path: 'books/:id/edit',
    component: BookForm,
    canActivate: [authGuard]
  },

  {
    path: 'members',
    component: MemberList,
    canActivate: [authGuard]
  },

  {
    path: 'loans',
    component: LoanList,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];

