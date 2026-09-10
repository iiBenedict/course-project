import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { BookService } from '../../core/services/book';
import { MemberService } from '../../core/services/member';
import { LoanService } from '../../core/services/loan';
import { Auth } from '../../core/services/auth';
import { Book } from '../../models/book';
import { bookCoverDataUri } from '../../shared/book-cover.util';

interface Stats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalMembers: number;
  activeMembers: number;
  activeLoans: number;
  overdueLoans: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  stats: Stats = {
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalMembers: 0,
    activeMembers: 0,
    activeLoans: 0,
    overdueLoans: 0
  };

  recentBooks: Book[] = [];

  userName = '';

  constructor(
    private bookService: BookService,
    private memberService: MemberService,
    private loanService: LoanService,
    private auth: Auth
  ) {}

  ngOnInit(): void {

    this.userName = this.auth.getCurrentUser()?.name ?? '';

    this.bookService.getBooks().subscribe();

    combineLatest([
      this.bookService.books$,
      this.memberService.members$,
      this.loanService.loans$
    ])
      .pipe(
        map(([books, members, loans]) => ({
          totalBooks: books.length,
          availableBooks: books.filter(b => b.status === 'Available').length,
          borrowedBooks: books.filter(b => b.status === 'Borrowed').length,
          totalMembers: members.length,
          activeMembers: members.filter(m => m.active).length,
          activeLoans: loans.filter(l => l.status === 'Active' || l.status === 'Late').length,
          overdueLoans: loans.filter(l => l.status === 'Late').length,
          recentBooks: books.slice(0, 6)
        }))
      )
      .subscribe(v => {
        this.stats = v;
        this.recentBooks = v.recentBooks;
      });
  }

  cover(book: Book): string {

    if (book.imageLink && /^https?:\/\//.test(book.imageLink)) {
      return book.imageLink;
    }

    return bookCoverDataUri(book.title, book.author);
  }

  handleImageError(event: Event, book: Book): void {

    const img = event.target as HTMLImageElement;

    const placeholder = bookCoverDataUri(book.title, book.author);

    if (img.src !== placeholder) {
      img.src = placeholder;
    }
  }
}
