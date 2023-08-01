import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { User } from '../model/User';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() currentUser:User={
    username:'',
    email:'',
    password:'',
    roles:[]
      };

  constructor(private storageService: StorageService) { }
  setActiveUser(user: User): void {
    this.currentUser= user;
   // this.currentIndex = index;
  }
  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
  }
}
