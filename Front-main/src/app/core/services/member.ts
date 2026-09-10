import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Member } from '../../models/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private members: Member[] = [

    {
      id: 1,
      name: 'Ahmed Osama',
      email: 'ahmed@example.com',
      phone: '01000000000',
      membershipDate: '2026-01-10',
      active: true
    },

    {
      id: 2,
      name: 'Mohamed Ali',
      email: 'mohamed@example.com',
      phone: '01111111111',
      membershipDate: '2026-02-15',
      active: true
    },

    {
      id: 3,
      name: 'Sara Hassan',
      email: 'sara@example.com',
      phone: '01222222222',
      membershipDate: '2026-03-20',
      active: false
    }

  ];


  getMembers(): Observable<Member[]> {

    return of(this.members);

  }

}
