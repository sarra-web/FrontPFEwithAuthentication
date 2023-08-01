import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { BoardAdminService } from 'src/app/board-admin/board-admin.service';
import { User } from 'src/app/model/User';
import * as alertify from 'alertifyjs'
@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent {
  constructor(private service: BoardAdminService,
    private userService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }
  @Input() viewMode = false;

  @Input() currentUser: User = {
    username:'',
    email:'',
    password:'',
    roles:[]
  };
  roledata: any;

  message = '';
  ngOnInit(){
    this.GetAllRole();
    if (!this.viewMode) {

      this.getUser(this.route.snapshot.params["id"]);

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
  GetAllRole() {
    this.service.GetAllRoles().subscribe(item => {
      this.roledata = item;
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
  update(){
    this.message = '';
    const s=[];
    s.push(this.currentUser.roles[0].name);
    const data = {
    id:this.currentUser.id,
    username: this.currentUser.username,
    password: this.currentUser.password,
    email:this.currentUser.email,
 //   roles:s
  };
  console.log(data)
  this.userService.update(data)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.message = res.message ? res.message : 'This User was updated successfully!';
        alertify.success("updated Successfully");

      },
      error: (e) => console.error(e)
    });

}
}
