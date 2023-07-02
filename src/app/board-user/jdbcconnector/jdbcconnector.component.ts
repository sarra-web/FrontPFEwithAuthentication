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
  fields: [],
  published: false
  };
  currentFile?: File;
  progress = 0;
  message = '';
  fileName = '';
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

    }


  }
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

onClick(sep:any): void {

 /* this.uploadService.ExtactData(this.fileName).subscribe(
    (response) => {
      this.data = response.map((row: any) => row.split(sep));
      const columns = this.data[0].length; // Nombre de colonnes dans le tableau (supposant que toutes les lignes ont la même longueur)
        this.result = Array.from({ length: columns }, (_, columnIndex) =>
       new Field(this.data.map(row => row[columnIndex]))
      );
      console.log(this.data);
      console.log(this.result);
      for (let i = 0; i < this.result.length; i = i + 1) {
        this.result[i].name=this.result[i].content?.at(0);
        this.result[i].fieldType="Meta"
          this.result[i].position=i+1;
         this.result[i].included=false;
          this.result[i].meta=this.result[i].content?.at(0);
          this.result[i].partOfDocumentIdentity=true;
       }
    },
    (error) => {
      console.log('Erreur lors de la récupération des données CSV :', error);
    }
  );*/
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
  pushActiveConnector(): void {
    const data = {
      id:this.currentConnector.id,
      name:this.currentConnector.name,
      className:this.currentConnector.className,
      jdbcUrl:this.currentConnector.jdbcUrl,
      password:this.currentConnector.password,
      tableName:this.currentConnector.tableName,
      username:this.currentConnector.username,
      fields: this.currentConnector.fields
};
console.log(data)
    this.connectorService.updateProx(data).subscribe({
      next: (res) => {
        console.log(res);
        if(res[1].UpsertSuccessful===true){
          alertify.success ('You data was pushed to proxem successfully! ');
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
