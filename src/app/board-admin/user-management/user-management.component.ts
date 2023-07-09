import { Component, OnInit, ViewChild } from '@angular/core';
import { BoardAdminService } from '../board-admin.service';
import { User } from 'src/app/model/User';


import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as alertify from 'alertifyjs'
import { MatDialog } from '@angular/material/dialog';
import { ModalpopupComponent } from '../modalpopup/modalpopup.component';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/_services/storage.service';
import { AuthService } from 'src/app/_services/auth.service';
import { elementAt } from 'rxjs';



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-user',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class  UserManagementComponent implements OnInit {

  constructor(private router:Router,private service: BoardAdminService,private dialog :MatDialog,private userService:AuthService) { }
user:User={}
submitted=false;
  ngOnInit(): void {
    this.GetAllUser();
  }
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  pageSizes = [3, 6, 9];
  UserDetail: any;
  dataSource: any;
  page = 1;
  count = 0;
  pageSize = 3;
  handlePageChange(event: number): void {
    this.page = event;
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;

  }

  removeAllprojects(): void {
    alertify.confirm("Remove projects","do you want remove all these users?",()=>{
     this.userService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          //this.refreshList();
        },
        error: (e) => console.error(e)
      });},function(){})

  }
  cancel():void{
    this.CloseModel()
   }
   saveUser(): void {
     this.userService.register(this.user.username,this.user.email,this.user.password).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
      },
      error: (e) => console.error(e)
    });
}


  GetAllUser() {
    this.service.GetAllUser().subscribe(item => {
      this.UserDetail = item;
      this.dataSource = new MatTableDataSource<User>(this.UserDetail);
      this.dataSource.paginator = this.paginator;
    });
  }

  displayedColumns: string[] = ['userid', 'name', 'email', 'isActive', 'role', 'Action'];
  //dataSource = ELEMENT_DATA;
  CloseModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'none';
    }
  }

openModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'block';
    }
  }
  FunctionUpdate(userid: any) {
   console.log(userid)
   let popup= this.dialog.open(ModalpopupComponent,{
      width:'400px',
      // height:'400px',
      exitAnimationDuration:'1000ms',
      enterAnimationDuration:'1000ms',
      data:{
        id:userid
      }
    })
    popup.afterClosed().subscribe((item)=>{
this.GetAllUser();
    });

  }
  FunctionDelete(userid: any) {

    alertify.confirm("Remove User","do you want remove this user?",()=>{
      this.service.RemoveUser(userid).subscribe(item => {
        this.GetAllUser();
        alertify.success("Removed Successfully");
      });

    },function(){})

  }

}
