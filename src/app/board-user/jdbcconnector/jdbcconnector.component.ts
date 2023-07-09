import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConnectorJDBC } from 'src/app/model/ConnectorJDBC';
import { Field } from 'src/app/model/FieldDAO';
import * as alertify from 'alertifyjs'
import { ConnectorJDBCService } from 'src/app/_services/connector-jdbc.service';
@Component({
  selector: 'app-jdbcconnector',
  templateUrl: './jdbcconnector.component.html',
  styleUrls: ['./jdbcconnector.component.css']
})
export class JDBCconnectorComponent {


  @Input() viewMode = false;

  @Input() currentConnector: ConnectorJDBC = {
  id:'',
  name:'',
  jdbcUrl: '',
  username: '',
  password:'',
  className: '',
  tableName:'',
  initialQuery:'',
  checkpointColumn:'',
  incrementalVariable:'',
  incrementalQuery:'',
  mode:"Full",
  fields: [],
  published: false
  };
  currentFile?: File;
  progress = 0;
  message = '';
  messageQuery='';
  fileName = '';
  incrementalVariable='';
  fileInfos?: Observable<any>;
  data: string[][] = [];
  result: Field[] = [];
  constructor(
    private connectorService: ConnectorJDBCService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getConnector(this.route.snapshot.params["id"]);

    } }
//adds

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
    const data = {
      id:this.currentConnector.id,
      name:this.currentConnector.name,
      className:this.currentConnector.className,
      jdbcUrl:this.currentConnector.jdbcUrl,
      password:this.currentConnector.password,
      tableName:this.currentConnector.tableName,
      username:this.currentConnector.username,
      initialQuery:this.currentConnector.initialQuery,
      checkpointColumn:this.currentConnector.checkpointColumn,
        incrementalVariable:this.currentConnector.incrementalVariable,
       incrementalQuery:this.currentConnector.initialQuery,
       mode: this.currentConnector.mode,
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
        if(res[1].UpsertSuccessful===true){
          alertify.success (j+' documents are pushed to proxem successfully! \n start time: '+now);
        }
        if(!res[1].Errors ===false){
          alertify.success ('You data was pushed to proxem successfully! but not accepted');
        }
        else{
          alertify.success ('You data does not pushed to proxem successfully!');
        }

      },
      error: (e) => console.error(e)
    });
  }
  scanFromCheckPoint(): void {
    const data = {
      id:this.currentConnector.id,
      name:this.currentConnector.name,
      className:this.currentConnector.className,
      jdbcUrl:this.currentConnector.jdbcUrl,
      password:this.currentConnector.password,
      tableName:this.currentConnector.tableName,
      username:this.currentConnector.username,
      initialQuery:this.currentConnector.initialQuery,
      checkpointColumn:this.currentConnector.checkpointColumn,
        incrementalVariable:this.incrementalVariable,
       incrementalQuery:this.currentConnector.incrementalQuery,
       mode: this.currentConnector.mode,
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
        if(res[1].UpsertSuccessful===true){
          alertify.success (j+' documents are pushed to proxem successfully! \n start time: '+now);
        }
        if(!res[1].Errors ===false){
          alertify.success ('You data was pushed to proxem successfully! but not accepted');
        }
        else{
          alertify.success ('You data does not pushed to proxem successfully!');
        }

      },
      error: (e) => console.error(e)
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
