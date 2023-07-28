import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;
@Input() collapsed=false;
@Input() screenWidth=0;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {console.log(err)
        if (err.error) {
          this.content = JSON.parse(err.error).message;
        } else {
          this.content = "Error with status: " + err.status;
        }
      }
    });
  }


  getHomeClass():string{
    let styleClass='';
    if(this.collapsed && this.screenWidth>768){
      styleClass='body-trimmed';

    }else if(this.collapsed && this.screenWidth<=768 && this.screenWidth>0)
  {styleClass='body-md-screen'

  }
return styleClass
}
}
