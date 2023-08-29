import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/model/User';
import { BoardAdminService } from '../../board-admin.service';
import * as alertify from 'alertifyjs'

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
    roles:[],
    userToken:''
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
 /* this.userService.register(this.currentUser.username,this.currentUser.email,this.currentUser.password).subscribe({
   next: (res) => {
     console.log(res);
     //this.submitted = true;
   },
   error: (e) => console.error(e)
 });*/
 const s=[];
 s.push(this.currentUser.roles[0].name);
 console.log("sssssss",s)
 const data = {

  id:this.currentUser.id,
  username: this.currentUser.username,
  password: this.currentUser.password,
  email:this.currentUser.email,
  userToken:this.currentUser.userToken,
  roles:s
};
console.log(data)
  this.userService.update(data)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.message = res.message ? res.message : 'This Project was updated successfully!';
        alertify.success("updated Successfully");

      },
      error: (e) => console.error(e)
    });

 }
 myFunction():void {
  var x = document.getElementById("b") as HTMLInputElement;
  if (x.type === "password") {
     console.log("pass")
    x.type = "text";
  } else {
    x.type = "password";
  }
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
