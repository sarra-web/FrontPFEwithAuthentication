import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';
@Component({
  selector: 'app-popap',
  templateUrl: './popap.component.html',
  styleUrls: ['./popap.component.css']
})
export class PopapComponent {
  title = 'angular-mateiral';
  selectedValue: string = '';
  pass:false


  constructor(private router: Router,private dialogRef : MatDialog) { }
  changementDePage =  () => {

    this.router.navigateByUrl('/addcsv');

   };
   openDialog(){
    this.dialogRef.open(PopupComponent,{
      data : {
        name : 'Samuel'
      }
    });
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

   changementDePageWithCondition():void{
    if (this.selectedValue==='CSV')

   {pass:true
    this.CloseModel()
    this.router.navigateByUrl('/upload');}


   else if (this.selectedValue==='XML')
    {pass:true
      this.CloseModel()
      this.router.navigateByUrl('/addxml');}



   else if (this.selectedValue==='JDBC')
    {this.router.navigateByUrl('/addjdbc');
    pass:true
    this.CloseModel()
   }


   }


   cancel():void{
    this.router.navigateByUrl('/home');
   }
}
