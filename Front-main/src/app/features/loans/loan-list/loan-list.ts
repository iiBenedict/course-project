import { Component, OnInit } from '@angular/core';

import { LoanService } from '../../../core/services/loan';

import { Loan } from '../../../models/loan';

@Component({
  selector: 'app-loan-list',
  imports: [],
  templateUrl: './loan-list.html',
  styleUrl: './loan-list.css'
})
export class LoanList implements OnInit {

  loans: Loan[] = [];

  constructor(
    private loanService: LoanService
  ) {}

  ngOnInit(): void {

    this.loanService
      .getLoans()
      .subscribe(data => {

        this.loans = data;

      });

  }

}
