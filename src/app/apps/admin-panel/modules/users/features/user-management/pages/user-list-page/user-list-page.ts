import { Component, inject, Inject, OnInit } from '@angular/core';
import { UserToken } from '../../services/user';

@Component({
  selector: 'app-user-list-page',
  imports: [],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.scss'
})
export class UserListPage implements OnInit {

 private userService = inject(UserToken);

  constructor() {
   }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users) => {
      console.log(users);
    });
  }

}
