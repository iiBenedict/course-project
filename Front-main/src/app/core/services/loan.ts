import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Loan } from '../../models/loan';

const STORAGE_KEY = 'libraryLoans';

const SEED: Loan[] = [
  {
    id: 1,
    bookId: 2,
    memberId: 1,
    borrowDate: '2026-09-01',
    dueDate: '2026-09-15',
    status: 'Active'
  },
  {
    id: 2,
    bookId: 1,
    memberId: 2,
    borrowDate: '2026-08-01',
    dueDate: '2026-08-15',
    returnDate: '2026-08-14',
    status: 'Returned'
  }
];

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private loansSubject = new BehaviorSubject<Loan[]>([]);

  loans$ = this.loansSubject.asObservable();

  constructor() {

    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        this.loansSubject.next(this.reevaluate(JSON.parse(raw)));
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    this.loansSubject.next(this.reevaluate(SEED));
    this.persist();
  }

  private reevaluate(loans: Loan[]): Loan[] {

    const today = new Date().toISOString().slice(0, 10);

    return loans.map(loan => {

      if (loan.status === 'Returned') {
        return loan;
      }

      const isLate = loan.dueDate < today;

      return { ...loan, status: isLate ? 'Late' : 'Active' };
    });
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.loansSubject.value));
  }

  getLoans(): Observable<Loan[]> {
    return this.loans$;
  }

  markReturned(id: number): Observable<Loan | undefined> {

    const list = this.loansSubject.value.slice();

    const idx = list.findIndex(l => l.id === id);

    if (idx === -1) {
      return of(undefined);
    }

    list[idx] = {
      ...list[idx],
      status: 'Returned',
      returnDate: new Date().toISOString().slice(0, 10)
    };

    this.loansSubject.next(list);
    this.persist();

    return of(list[idx]);
  }
}
