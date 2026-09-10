import { Component, OnInit } from '@angular/core';
import { combineLatest, map } from 'rxjs';

import { LoanService } from '../../../core/services/loan';
import { BookService } from '../../../core/services/book';
import { MemberService } from '../../../core/services/member';

import { Loan } from '../../../models/loan';

interface LoanRow extends Loan {
  bookTitle: string;
  memberName: string;
}

@Component({
  selector: 'app-loan-list',
  imports: [],
  templateUrl: './loan-list.html',
  styleUrl: './loan-list.css'
})
export class LoanList implements OnInit {

  rows: LoanRow[] = [];

  constructor(
    private loanService: LoanService,
    private bookService: BookService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {

    this.bookService.getBooks().subscribe();

    combineLatest([
      this.loanService.getLoans(),
      this.bookService.books$,
      this.memberService.getMembers()
    ])
      .pipe(
        map(([loans, books, members]) =>
          loans.map(loan => ({
            ...loan,
            bookTitle:
              books.find(b => String(b.id) === String(loan.bookId))?.title ??
              `Book #${loan.bookId}`,
            memberName:
              members.find(m => m.id === loan.memberId)?.name ??
              `Member #${loan.memberId}`
          }))
        )
      )
      .subscribe(rows => (this.rows = rows));
  }

  markReturned(id: number): void {
    this.loanService.markReturned(id).subscribe();
  }
}
