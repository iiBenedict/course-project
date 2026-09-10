import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MemberService } from '../../../core/services/member';
import { Member } from '../../../models/member';

@Component({
  selector: 'app-member-list',
  imports: [FormsModule],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {

  members: Member[] = [];

  filtered: Member[] = [];

  searchTerm = '';

  showAddForm = false;

  draft: Omit<Member, 'id'> = this.emptyDraft();

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.memberService.getMembers().subscribe(list => {
      this.members = list;
      this.applyFilter();
    });
  }

  private emptyDraft(): Omit<Member, 'id'> {
    return {
      name: '',
      email: '',
      phone: '',
      membershipDate: new Date().toISOString().slice(0, 10),
      active: true
    };
  }

  applyFilter(): void {

    const q = this.searchTerm.trim().toLowerCase();

    if (!q) {
      this.filtered = this.members;
      return;
    }

    this.filtered = this.members.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.includes(q)
    );
  }

  initials(name: string): string {

    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0]!.toUpperCase())
      .join('');
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.draft = this.emptyDraft();
    }
  }

  addMember(): void {

    if (!this.draft.name.trim() || !this.draft.email.trim()) {
      return;
    }

    this.memberService.addMember({ ...this.draft }).subscribe(() => {
      this.showAddForm = false;
      this.draft = this.emptyDraft();
    });
  }

  toggleActive(id: number): void {
    this.memberService.toggleActive(id).subscribe();
  }

  deleteMember(id: number, name: string): void {
    if (!confirm(`Remove member "${name}"?`)) {
      return;
    }
    this.memberService.deleteMember(id).subscribe();
  }
}
