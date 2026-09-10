import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard
  implements OnInit, AfterViewInit, OnDestroy {

  totalBooks = 120;
  totalMembers = 75;
  activeLoans = 24;
  overdueLoans = 5;

  ngOnInit(): void {
    console.log('Dashboard initialized');
  }

  ngAfterViewInit(): void {
    console.log('Dashboard view initialized');
  }

  ngOnDestroy(): void {
    console.log('Dashboard destroyed');
  }
}
