import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Member } from '../../models/member';

const STORAGE_KEY = 'libraryMembers';

const SEED: Member[] = [
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

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private membersSubject = new BehaviorSubject<Member[]>([]);

  members$ = this.membersSubject.asObservable();

  constructor() {

    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        this.membersSubject.next(JSON.parse(raw));
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    this.membersSubject.next(SEED);
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.membersSubject.value));
  }

  private nextId(): number {

    const ids = this.membersSubject.value.map(m => m.id);

    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  getMembers(): Observable<Member[]> {
    return this.members$;
  }

  addMember(input: Omit<Member, 'id'>): Observable<Member> {

    const member: Member = { ...input, id: this.nextId() };

    this.membersSubject.next([member, ...this.membersSubject.value]);

    this.persist();

    return of(member);
  }

  toggleActive(id: number): Observable<Member | undefined> {

    const list = this.membersSubject.value.slice();

    const idx = list.findIndex(m => m.id === id);

    if (idx === -1) {
      return of(undefined);
    }

    list[idx] = { ...list[idx], active: !list[idx].active };

    this.membersSubject.next(list);

    this.persist();

    return of(list[idx]);
  }

  deleteMember(id: number): Observable<boolean> {

    this.membersSubject.next(
      this.membersSubject.value.filter(m => m.id !== id)
    );

    this.persist();

    return of(true);
  }
}
