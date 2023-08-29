import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConnectorNoSQL } from 'src/app/model/ConnectorNoSQL';
import { Field } from 'src/app/model/FieldDAO';
import * as alertify from 'alertifyjs'
import { ConnectorNoSQLService } from 'src/app/_services/connector-no-sql.service';
import { ProjectServiceService } from 'src/app/_services/project.service';
import { Project } from 'src/app/model/Project';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-no-sqlconnector',
  templateUrl: './no-sqlconnector.component.html',
  styleUrls: ['./no-sqlconnector.component.css']
})
export class NoSQLconnectorComponent {
  selectFormControl = new FormControl('', Validators.required);
  @Input() viewMode = false;
  msg='';
  color='';
  @Input() currentConnector: ConnectorNoSQL = {
  id:'',
  name:'',
  userName:'',
  projectName:'',
  connectionString:'',
  dbName:'',
  collectionName:'',
  fields: [],
  published: false
  };
  currentFile?: File;
  checkPoint:string;
  progress = 0;
  message = '';
  messageQuery='';
  fileName = '';
  incrementalVariable='';
  fileInfos?: Observable<any>;
  data: string[][] = [];
  submitted = false;
  form: any;
  result: Field[] = [];
  projects:Project[];
  constructor(
    private connectorService: ConnectorNoSQLService,
    private route: ActivatedRoute,
    private router: Router,private projectService:ProjectServiceService) { }

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

    } }
//adds
testConnection(){
  this.connectorService.testConnection(this.currentConnector.connectionString)
   .subscribe({
    next: (res) => {
      console.log("yeeeeee");
      console.log(res);
      if(res[0]==='Connected to MongoDB successfully!'){
       this.msg="Connection is ok"
       this.color="green";
      }
      else{
        this.msg= "Connection is failed";
        this.color="red"
      }

      //alertify.success("")
    },
    error: (e) => console.error(e)
  });

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

onClick(): void {
  this.connectorService.extract(this.currentConnector).subscribe(
    (response) => {
      console.log(response);
      this.data =response
      const columns = this.data[0].length; // Nombre de colonnes dans le tableau (supposant que toutes les lignes ont la même longueur)
      if (columns===0){
        console.log("vide")
        this.messageQuery="Invalid query"}
        else{this.messageQuery=""}
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
        this.messageQuery="Invalid query"
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
          this.message = res.message ? res.message : 'The status was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }
  scan(): void {
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
      connectionString:this.currentConnector.connectionString,
      dbName:this.currentConnector.dbName,
      collectionName:this.currentConnector.collectionName,
      fields: this.currentConnector.fields,

};
console.log(data)
    this.connectorService.updateProx(data).subscribe({
      next: (res) => {
        console.log("res",res,"lenght",res.length);
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
  scanFromCheckPoint(): void {
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
      connectionString:this.currentConnector.connectionString,
      dbName:this.currentConnector.dbName,
      collectionName:this.currentConnector.collectionName,
      fields: this.currentConnector.fields,

};
const data2={
  check:this.checkPoint,
  connectorNoSQLDTO:data
}
console.log(data2)
    this.connectorService.updateProxPlusCheck(data2).subscribe({
      next: (res) => {
        console.log("res",res,"lenght",res.length);
        const now = new Date();
        let j=0;
        for (let i = 0; i < res.length; i = i + 1){
          if(res[i].UpsertSuccessful===true){
                j=j+1;
          }}
        if(res[0].UpsertSuccessful===true){
          alertify.success (j+' documents are pushed to proxem successfully! \n start time: '+now);
        }
        if(!res[0].Errors ===null){
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

   clear(){
   }
   myFunction():void {
    var x = document.getElementById("myInput") as HTMLInputElement;
    if (x.type === "password") {
       console.log("pass")
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  handleKeyDown(event:any): void {
    // Check if the key pressed is not allowed
    if (!this.isAllowedKey(event.key)) {
      event.preventDefault();
    }
  }

  isAllowedKey(key: string): boolean {
    // Define the allowed characters and special keys
    const allowedCharacters = /^[a-zA-Z0-9\s.,();'"$]+$/;
    const allowedSpecialKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];

    // Check if the key is allowed
    return allowedCharacters.test(key) || allowedSpecialKeys.includes(key);
  }
   goToSqueduler(){

    this.router.navigateByUrl('/squeduler/{{currentConnector.id}}');
   }

  updateConnector(): void {
    this.message = '';
    this.connectorService.update(this.currentConnector).subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'This Connector was updated successfully!';
          alertify.success("This Connector was updated successfully!")

        },
        error: (e) => {console.error(e);this.message='bad request'
        console.log(e)
      }
      });
  }

  openModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'block';
    }
  }
  cancel():void{

    this.CloseModel()
   }
  CloseModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'none';
    }
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
