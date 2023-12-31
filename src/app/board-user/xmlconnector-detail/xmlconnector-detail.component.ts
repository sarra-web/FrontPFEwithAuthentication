import { Component,Input,OnInit } from '@angular/core';
import { ConnectorServiceService } from '../../_services/connector-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../_services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Field } from '../../model/FieldDAO';
import * as alertify from 'alertifyjs'
import { Project } from 'src/app/model/Project';
import { ProjectServiceService } from 'src/app/_services/project.service';
import { FormControl, Validators } from '@angular/forms';
import { ConnectorXML } from 'src/app/model/ConnectorXML';
import { XmlConnectorService } from 'src/app/_services/xml-connector.service';

@Component({
  selector: 'app-xmlconnector-detail',
  templateUrl: './xmlconnector-detail.component.html',
  styleUrls: ['./xmlconnector-detail.component.css']
})

export class XMLconnectorDetailComponent {
  @Input() viewMode = false;
  @Input() currentConnector: ConnectorXML = {
  id:'',
  name:'',
  userName:'',
  projectName:'',
  path:'',
  tagName:'',
  fields: [],
  published: false
  };
  selectFormControl = new FormControl('', Validators.required);
  currentFile?: File;
  progress = 0;
  message = '';
  fileName = '';
  fileInfos?: Observable<any>;
  submitted = false;
  form: any;
  data: string[][] = [];
  result: Field[] = [];
  projects:Project[];
  constructor(
    private connectorService: XmlConnectorService,
    private route: ActivatedRoute,
    private router: Router,private uploadService: FileUploadService,private projectService:ProjectServiceService) { }

  ngOnInit(): void {
    this.projectService.getAll().subscribe({
      next:(data) =>{
        this.projects = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
    if (!this.viewMode) {
      this.message = '';
      this.getConnector(this.route.snapshot.params["id"]);

    }


  }
//adds
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
selectFile(event: any): void {
  if (event.target.files && event.target.files[0]) {
    const file: File = event.target.files[0];
    this.currentFile = file;
    this.fileName = this.currentFile.name;
  } else {
    this.fileName = 'Select File';
    this.currentConnector.path=this.currentFile.name
  }
}
removeFiles():void{
  this.uploadService.removeAll();
}
onClick(): void {
  this.connectorService.extract(this.currentConnector).subscribe(
    (response) => {
      console.log(response);
      this.data =response
      const columns = this.data[0].length; // Nombre de colonnes dans le tableau (supposant que toutes les lignes ont la même longueur)
      if (columns===0){
        console.log("vide")
        }
        else{}
      this.result = Array.from({ length: columns }, (_, columnIndex) =>
       new Field(this.data.map(row => row[columnIndex]))
      );
      this.currentConnector.fields=this.result;
      console.log(this.data);
      console.log(this.result);
      for (let i = 0; i < this.result.length; i = i + 1) {//initialisation
        this.result[i].name=this.result[i].content?.at(0);
        this.result[i].fieldType="Meta"
          this.result[i].position=i+1;
         this.result[i].included=false;
          this.result[i].meta=this.result[i].content?.at(0);
          this.result[i].partOfDocumentIdentity=true;
       }},
       (error) => {
        console.log('Erreur lors de la récupération des données :', error);

      }
    );
      }

//
  getConnector(id: string): void {
    this.connectorService.get(id)
      .subscribe({
        next: (data) => {
          this.currentConnector = data;
          console.log(data);
          console.log(this.currentConnector.path)
      this.fileName=this.currentConnector.path;
        },
        error: (e) => console.error(e)
      });

  }

  updatePublished(status: boolean): void {
    const data = {
      title: this.currentConnector.name,
      published: status
    };
this.message = '';
this.connectorService.update(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentConnector.published= status;
         // this.message = res.message ? res.message : 'The status was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }
  pushActiveConnector(): void {
    const a=this.currentConnector.projectName
    console.log("currentConnector"+a)
    this.projectService.findByName2(a).subscribe({
      next: (res) => {
        console.log("les info de"+a+res.proxemToken)
       if(res.proxemToken!="a0e04a5f-ab7c-4b0e-97be-af263a61ba49"){
        alertify.confirm("Based on the information provided, it is likely that the project you are referring to does not yet exist in Proxem. To confirm or select an existing project, please verify the details")

       }
      },

      error: (e) => {console.error(e)
      }
    });
    const data = {
      id:this.currentConnector.id,
      name:this.currentConnector.name,
      projectName:this.currentConnector.projectName,
      userName:this.currentConnector.userName,
      path:this.currentConnector.path,
      tagName:this.currentConnector.tagName,
      fields: this.currentConnector.fields
};
console.log(data)
    this.connectorService.updateProx(data).subscribe({
      next: (res) => {
        console.log(res);
        const now = new Date();
        let j=0;
        for (let i = 0; i < res.length; i = i + 1){
          if(res[i].UpsertSuccessful===true){
                j=j+1;
          }}
        if(res[0].UpsertSuccessful===true){
          alertify.success (j+' documents are pushed to proxem successfully! \n start time: '+now);
        }
        if(!res[0].Errors ===false){
          alertify.success ('You data was pushed to proxem successfully! but not accepted');
        }
        if(res.lenght===0){
          alertify.success ('You data does not pushed to proxem successfully!');
        }

      },
      error: (e) => {console.error(e)
      alertify.confirm("Based on the information provided, it is likely that the project you are referring to does not yet exist in Proxem. To confirm or select an existing project, please verify the details")
      }
    });
  }
  PagePrecedente=() => {

    this.router.navigateByUrl('/addXML');

   };
   clear(){
   }
   goToSqueduler(){

    this.router.navigateByUrl('/squeduler/{{currentConnector.id}}');
   }

  updateConnector(): void {
    this.message = '';
    this.connectorService.update(this.currentConnector).subscribe({
        next: (res) => {
          console.log(res);
         // this.message = res.message ? res.message : 'This Connector was updated successfully!';
          alertify.success("This Connector was updated successfully!")

        },
        error: (e) => {//console.error(e);this.message='bad request'
        console.log(e)
      }
      });
  }

  deleteConnector(): void {
    alertify.confirm("Remove Connector","do you want remove this connector?",()=>{this.connectorService.delete(this.currentConnector.id)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/connectors']);
      },
      error: (e) => console.error(e)
    });},function(){})
    /*this.connectorService.delete(this.currentConnector.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/connectors']);
        },
        error: (e) => console.error(e)
      });*/
  }




}
