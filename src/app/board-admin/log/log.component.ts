import { Component, OnInit, ViewChild } from '@angular/core';
import { LogService } from '../../_services/log.service';
import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms'
import { StorageService } from 'src/app/_services/storage.service';
import * as alertify from 'alertifyjs'

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
 // cars: Car[] = CARS;
  searchText: string;

  files: { name: string }[] = []; // Replace this with your actual file data structure
  fileData: string[];
  elements: Observable<any>;
  result:Data[];
  result2: string[][] = [];
  data: string[][] = [];
  currentUser:any;
  displayedColumns = ['Date', 'RequestURI', 'Method', 'ResponseStatus','Info','User','Level'];
  dataSource: MatTableDataSource<Data>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private logService: LogService,private storageService:StorageService) {

    const users: Data[] = [];

    this.logService.getFile2("myLog.csv").subscribe(
      (response) => {
        this.data = response.map((row: any) => row.split(','));
      const   columns = this.data.length; // Nombre de colonnes dans le tableau (supposant que toutes les lignes ont la même longueur)
      for (let i =0; i < columns; i++) {
        users.push( new Data(this.data[i]));
        ;
      }

        console.log("users",users);
      },
      (error) => {
        console.log('Erreur lors de la récupération des données CSV :', error);
      }
       );
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }
   red=COLORS[1];
   a=COLORS[0];
  ngOnInit(): void {
    this.currentUser=this.storageService.getUser()

}
refrech(){
  window.location.reload();
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}
deleteLogs(){
  alertify.confirm("Remove logs","do you want remove all these log information?",()=>{this.logService.deleteLog("myLog.csv").subscribe(
    (response) => {
      console.log("deleted successfully")
      window.location.reload();
    },
    (error) => {
      console.log('Erreur lors de la suppression des données CSV :', error);
    });
  },function(){})

}

applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  this.dataSource.filter = filterValue;
}
  downloadFile(file: { name: string }) {
    this.logService.getFile(file.name)
      .then(blob => {
        // Perform any necessary operations with the downloaded file
        // For example, you can create a URL for the blob and open it in a new window
        const url = URL.createObjectURL(blob);
        window.open(url);
      })
      .catch(error => {
        // Handle any error that occurred during the file download
        console.error('Error downloading file:', error);
      });
  }

  getFileData() {
    this.logService.getFile2("myLog.csv").subscribe(
      (response) => {
        this.data = response.map((row: any) => row.split(','));
        const columns = this.data[0].length; // Nombre de colonnes dans le tableau (supposant que toutes les lignes ont la même longueur)
          this.result2 = Array.from({ length: columns }, (_, columnIndex) =>
         (this.data.map(row => row[columnIndex]))
        );
        console.log(this.data);
        console.log(this.result);
      },
      (error) => {
        console.log('Erreur lors de la récupération des données CSV :', error);
      }

    );
}
}
/*function createNewUser(id: number): Data {
  const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    Date: id.toString(),
    RequestURI: name,
    Method: Math.round(Math.random() * 100).toString(),
    ResponseStatus: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}*/

/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];
export class Data {
  Date: string;
  RequestURI: string;
  Method: string;
  ResponseStatus: string;
  Info:string;
  User:string;
  constructor( a:string[]) {
    this.Date =a[0] ;
    this.RequestURI =a[1] ;
    this. Method= a[2];
    this. ResponseStatus= a[3];
    this.Info=a[4];
    this.User=a[5];
  }
}
