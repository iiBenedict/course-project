import { Component, OnInit } from '@angular/core';

import { MemberService } from '../../../core/services/member';

import { Member } from '../../../models/member';

@Component({
  selector: 'app-member-list',
  imports: [],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {

  members: Member[] = [];

  constructor(
    private memberService: MemberService
  ) {}

  ngOnInit(): void {

    this.memberService
      .getMembers()
      .subscribe(data => {

        this.members = data;

      });

  }

}
