import { Component, Inject, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/_services/file-upload.service';
import { Router } from '@angular/router';
import { ConnectorServiceService } from 'src/app/_services/connector-service.service';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { ConnectorCSV } from 'src/app/model/ConnectorCSV copy';
import { Field } from 'src/app/model/FieldDAO';
import * as alertify from 'alertifyjs'
import { Project } from 'src/app/model/Project';
import { ProjectServiceService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  selectFormControl = new FormControl('', Validators.required);
  public disabled = true;
  currentUser:any;

  a:string="";
  sep:any=",";
  currentFile?: File;
  progress = 0;
  message = '';
  fileName = 'Select File';
  type:string[];
  fileInfos?: Observable<any>;
  data: string[][] = [];
  result: Field[] = [];
  headers: string[] = [];
  fil:any;
  http: any;
  buttonText = 'Egnored x';
  buttonColor = 'grey';
  bb:any;
  submitted = false;
   fields: any[] = [];
  positions:number[]=[];
  projects:Project[];
  connector:ConnectorCSV={
    name:'',
    projectName:'',
    separator:'',
    encoding:'',
    path:'',
    quotingCaracter:'"',
    escapingCaracter:'\\',
    containsHeaders:true,
    fields: []
}
isChecked:boolean;
  form: any;
v:any;

  constructor(private fb: FormBuilder,private uploadService: FileUploadService,
    private router: Router,private storageService:StorageService,
    connectorService:ConnectorServiceService,private projectService:ProjectServiceService) { }

ngOnInit(): void {
  this.currentUser=this.storageService.getUser()
  this.projectService.getAll().subscribe({
    next:(data) =>{
      this.projects = data;
      console.log(data);
    },
    error: (e) => console.error(e)
  });

    this.fileInfos = this.uploadService.getFiles();
    /*console.log("select")
    console.log(this.form.get('select').value);
    this.form.get('select').value.includes('Text')*/

  }
  //connector
changementDePage =  () => {
this.router.navigateByUrl('user/connectors');

    };

onReset(connector: NgForm): void {

  connector.reset();
    }
newConnector(): void {
      this.submitted = false;
      this.connector = {
        name: '',
       encoding: '',
        containsHeaders: true,
        fields:[]
      };
    }
    //
PagePrecedente=() => {

    this.router.navigateByUrl('/addcsv');

   };
onSubmit(){
this.type=[];
console.log(JSON.stringify(this.connector, null, 2));
// this.fields= this.result;
for (let i = 0; i < this.result.length; i++) {
  this.type.push(this.result[i].fieldType)
  }


  if((this.type.includes("Text")) &&(this.type.includes("Title")) ){
for (let i = 0; i < this.result.length; i++) {

      this.fields.push({ name:this.result[i].name,
      fieldType:this.result[i].fieldType,position:this.result[i].position,
      included:this.result[i].included,meta:this.result[i].meta,
      partOfDocumentIdentity:this.result[i].partOfDocumentIdentity });
}
console.log(this.fields)
    console.log(this.result)
    const data = {
      userName:this.currentUser.username,
      id:this.connector.name,
      name:this.connector.name,
      projectName:this.connector.projectName,
      separator:this.connector.separator,
      encoding:this.connector.encoding,
      path:this.currentFile.name,
      quotingCaracter:this.connector.quotingCaracter,
      escapingCaracter:this.connector.escapingCaracter,
      containsHeaders:this.connector.containsHeaders,
      fields:this.fields
};
console.log("userName")
console.log(data.userName);
    this.uploadService.create(data)
     .subscribe({
       next: (res) => {
         console.log(res);
         this.submitted = true;
         alertify.success("Connector registred successfelly")
       },
       error: (e) => console.error(e)
     });}
     else{
      alertify.confirm("The fields must include at least one of type 'Text' and one of type 'Title'.")

    }

   }

  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    } else {
      this.fileName = 'Select File';
    }
  }

  upload(): void {
    this.progress = 0;
    this.message = "";

    if (this.currentFile) {
      this.uploadService.upload(this.currentFile).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }

          this.currentFile = undefined;
        });
    }

  }

  /*upload(): void {
    this.progress = 0;
    this.message = "";

    if (this.currentFile) {
      this.uploadService.upload(this.currentFile);
      this.progress = Math.round(100);
    }

  }*/


  onClick(sep:any): void {
    this.uploadService.ExtactData(this.fileName).subscribe(
      (response) => {
        this.data = response.map((row: any) => row.split(sep));
        const columns = this.data[0].length; // Nombre de colonnes dans le tableau (supposant que toutes les lignes ont la même longueur)
          this.result = Array.from({ length: columns }, (_, columnIndex) =>
         new Field(this.data.map(row => row[columnIndex]))
        );
        console.log(this.data);
        console.log(this.result);
        for (let i = 0; i < this.result.length; i = i + 1) {//initialisation
          this.result[i].name=this.result[i].content?.at(0);
          this.result[i].fieldType="Meta"
            this.result[i].position=i+1;
           this.result[i].included=false;
            this.result[i].meta=this.result[i].content?.at(0);
            this.result[i].partOfDocumentIdentity=true;
         }




        //this.headers = this.data.shift() || [];
      },
      (error) => {
        console.log('Erreur lors de la récupération des données CSV :', error);
      }

    );
}

removeFiles():void{
  this.uploadService.removeAll();
}

changeButton() {

if (this.buttonText=== 'Egnored x') {
this.buttonText = 'Included';
this.buttonColor = 'green';
}

else {
this.buttonText = 'Egnored x';
this.buttonColor = 'grey';
}
}
}
