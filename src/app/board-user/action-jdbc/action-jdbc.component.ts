import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConnectorJDBCService } from 'src/app/_services/connector-jdbc.service';
import { ProjectServiceService } from 'src/app/_services/project.service';
import { ConnectorJDBC } from 'src/app/model/ConnectorJDBC';
import { Field } from 'src/app/model/FieldDAO';
import { Project } from 'src/app/model/Project';
import * as alertify from 'alertifyjs'

@Component({
  selector: 'app-action-jdbc',
  templateUrl: './action-jdbc.component.html',
  styleUrls: ['./action-jdbc.component.css']
})
export class ActionJDBCComponent {
  @Input() viewMode = false;

  @Input() currentConnector: ConnectorJDBC = {
  id:'',
  name:'',
  projectName:'',
  userName:'',
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
    private connectorService: ConnectorJDBCService,
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
    scanFromCheckPoint(): void {

      const data = {
        id:this.currentConnector.id,
        name:this.currentConnector.name,
        projectName:this.currentConnector.projectName,
        userName:this.currentConnector.userName,
        className:this.currentConnector.className,
        jdbcUrl:this.currentConnector.jdbcUrl,
        password:this.currentConnector.password,
        tableName:this.currentConnector.tableName,
        username:this.currentConnector.username,
        initialQuery:this.currentConnector.initialQuery,
        checkpointColumn:this.currentConnector.checkpointColumn,
          incrementalVariable:this.currentConnector.incrementalVariable,
         incrementalQuery:this.currentConnector.incrementalQuery,
         mode: this.currentConnector.mode,
        fields: this.currentConnector.fields,

  };
  const data2={
    check:this.checkPoint,
    connectorJDBCDTO:data
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

}
