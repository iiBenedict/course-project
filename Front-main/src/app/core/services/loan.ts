import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Loan } from '../../models/loan';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private loans: Loan[] = [

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


  getLoans(): Observable<Loan[]> {

    return of(this.loans);

  }

}
