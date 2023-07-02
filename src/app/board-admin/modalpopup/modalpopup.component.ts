import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as alertify from 'alertifyjs'
import { BoardAdminService } from '../board-admin.service';
import { Role } from 'src/app/model/Role';
import { User } from 'src/app/model/User';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modalpopup',
  templateUrl: './modalpopup.component.html',
  styleUrls: ['./modalpopup.component.css']
})
export class ModalpopupComponent implements OnInit {
  @Input() viewMode = false;
  @Input() user:User={
id:0,
username:'',
email:'',
password:'',
roles:[]
  };

  constructor(private service: BoardAdminService, @Inject(MAT_DIALOG_DATA) public data: any,
  private ref:MatDialogRef<ModalpopupComponent>,private route: ActivatedRoute,) { }

  ngOnInit(): void {
    if (!this.viewMode) {

      this.getUser(this.route.snapshot.params["id"]);

    }
    this.GetAllRole();
    this.GetExistdata(this.data.id);
  }
roles:Role[]=[];
  roledata: any;
  editdata: any;
  savedata: any;


  updateform = new FormGroup({
    id: new FormControl({ value: "", disabled: true }),
    role: new FormControl("", Validators.required),
    isActive: new FormControl(true)
  })
  getUser(id: any): void {
    this.service.GetUserbyId(id)
      .subscribe({
        next: (data) => {
          this.user = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });

  }

  SaveUser() {
    console.log("user",this.user)
    if (this.updateform.valid) {
      this.service.UpdateUser(this.user).subscribe(item => {
        this.savedata = item;
        if (this.savedata.result == 'pass') {
          alertify("Updated successfully.")
          this.ref.close();
        } else {
          alertify("Failed try again");
        }
      });
    }
  }

  GetAllRole() {
    this.service.GetAllRoles().subscribe(item => {
      this.roledata = item;
    });
  }

  GetExistdata(userid: any) {
    this.service.GetUserbyId(userid).subscribe(item => {
      this.editdata = item;
      if (this.editdata != null) {
        this.updateform.setValue({id: this.editdata.id, role: this.editdata.role[0].name, isActive: this.editdata.isActive });
      }
    });

  }

}
