import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/model/User';
import { BoardAdminService } from '../../board-admin.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  @Input() viewMode = false;

  @Input() currentUser: User = {
    username:'',
    email:'',
    password:'',
    roles:[]
  };
  roledata: any;

  message = '';
  constructor(private service: BoardAdminService,
    private userService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }


ngOnInit(){
  this.GetAllRole();
  if (!this.viewMode) {

    this.getUser(this.route.snapshot.params["id"]);

  }
}
GetAllRole() {
  this.service.GetAllRoles().subscribe(item => {
    this.roledata = item;
  });
}
saveUser(): void {
  this.userService.register(this.currentUser.username,this.currentUser.email,this.currentUser.password).subscribe({
   next: (res) => {
     console.log(res);
     //this.submitted = true;
   },
   error: (e) => console.error(e)
 });}
 update(){
  this.message = '';
  this.userService.register


  (this.currentUser.username,this.currentUser.email,this.currentUser.password).subscribe({
   next: (res) => {
     console.log(res);
     //this.submitted = true;
   },
   error: (e) => console.error(e)
 });
  /*this.userService.update(this.currentUser)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.message = res.message ? res.message : 'This Project was updated successfully!';
      },
      error: (e) => console.error(e)
    });*/

 }
getUser(id: any): void {
  this.service.GetUserbyId(id)
    .subscribe({
      next: (data) => {
        this.currentUser = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });

}










}