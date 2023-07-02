import { Component,Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms'

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit{
  selectedValue: string = '';
  firstName;
  dialogRef: any;
  constructor(private router: Router,@Inject(MAT_DIALOG_DATA) public data:any) {
    this.firstName = data.name
  }
  ngOnInit(): void {
  }
  changementDePage =  () => {

    this.router.navigateByUrl('/addcsv');

   };
   changementDePageWithCondition():void{
    if (this.selectedValue==='CSV')

   {this.router.navigateByUrl('/upload');}


   else if (this.selectedValue==='XML')
    {this.router.navigateByUrl('/addxml');}



   else if (this.selectedValue==='JDBC')
    {this.router.navigateByUrl('/addjdbc');

   }
   this.dialogRef.close();

   }


   cancel():void{
    this.router.navigateByUrl('/home');
   }
   openModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'block';
    }
  }

  CloseModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'none';
    }
  }
}
