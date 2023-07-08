import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConnectorJDBCService } from 'src/app/_services/connector-jdbc.service';
import { ConnectorJDBC } from 'src/app/model/ConnectorJDBC';
import { Field } from 'src/app/model/FieldDAO';
import * as alertify from 'alertifyjs'

@Component({
  selector: 'app-add-jdbcconnector',
  templateUrl: './add-jdbcconnector.component.html',
  styleUrls: ['./add-jdbcconnector.component.css']
})
export class AddJDBCconnectorComponent implements OnInit{

  public disabled = true;
  a:string="";
  sep:any=",";
  currentFile?: File;
  progress = 0;
  message = '';
  messageQuery='';
  fileName = 'Select File';
  fileInfos?: Observable<any>;
  data: string[][] = [];
  result: Field[] = [];
  headers: string[] = [];
  http: any;
  buttonText = 'Egnored x';
  buttonColor = 'grey';
  bb:any;
  submitted = false;
   fields: any[] = [];
  positions:number[]=[];
  connector:ConnectorJDBC={
    name:'',
    jdbcUrl:'',
    username:'',
    password:'',
    className:'',
    tableName:'',
    initialQuery:'',
    checkpointColumn:'',
    incrementalVariable:'',
    incrementalQuery:'',
    mode:"Full",
    fields: []
}
isChecked:boolean;
  form: any;
v:any;

  constructor(private fb: FormBuilder, private router: Router,
   private connectorService:ConnectorJDBCService) { }

ngOnInit(): void {}

onReset(connector: NgForm): void {
  connector.reset();
    }
newConnector(): void {
      this.submitted = false;
      this.connector = {
        name: '',
        jdbcUrl: '',
        username: '',
        password:'',
        className:'',
        tableName:'',
           initialQuery:'',
    checkpointColumn:'',
    incrementalVariable:'',
    incrementalQuery:'',
    mode:"Full",
        fields:[]
      };
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
    onClick(): void {
      this.connectorService.extract(this.connector).subscribe(
        (response) => {

          console.log("response",response);
          this.data =response
          const columns = this.data[0].length;
          if (columns===0){
            console.log("vide")
            this.messageQuery="Invalid query"}
            else{this.messageQuery=""}
          // Nombre de colonnes dans le tableau (supposant que toutes les lignes ont la même longueur)
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

onSubmit(){

 console.log(JSON.stringify(this.connector, null, 2));
// this.fields= this.result;
for (let i = 0; i < this.result.length; i++) {

  this.fields.push({ name:this.result[i].name,
  fieldType:this.result[i].fieldType,position:this.result[i].position,
  included:this.result[i].included,meta:this.result[i].meta,
  partOfDocumentIdentity:this.result[i].partOfDocumentIdentity });
}
console.log(this.fields)
    console.log(this.result)
    const data = {
      id:this.connector.name,
      name:this.connector.name,
      jdbcUrl:this.connector.jdbcUrl,
      username:this.connector.username,
      password:this.connector.password,
      className:this.connector.className,
      tableName:this.connector.tableName,
      fields:this.fields,
      initialQuery:this.connector.initialQuery,
      checkpointColumn:this.connector.checkpointColumn,
        incrementalVariable:this.connector.incrementalVariable,
       incrementalQuery:this.connector.incrementalQuery,
       mode: this.connector.mode
};

this.connectorService.create(data)
     .subscribe({
       next: (res) => {
         console.log(res);
         this.submitted = true;
         alertify.success("Connector registred successfelly")
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

