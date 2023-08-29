import { Component, Input, OnInit } from '@angular/core';
import { Scheduler } from 'src/app/model/Scheduler';
import { SchedulerService } from '../scheduler.service';
import { ActivatedRoute } from '@angular/router';
import { ConnectorServiceService } from 'src/app/_services/connector-service.service';
import { Connector } from 'src/app/model/Connector';
import { ConnectorJDBCService } from 'src/app/_services/connector-jdbc.service';
import { ProjectServiceService } from 'src/app/_services/project.service';
import * as alertify from 'alertifyjs'
@Component({
  selector: 'app-add-scheduler',
  templateUrl: './add-scheduler.component.html',
  styleUrls: ['./add-scheduler.component.css']
})
export class AddSchedulerComponent implements OnInit{
jobId='';
  @Input() viewMode = false;
  @Input() currentConnector: Connector = {
  id:'',
  name:'',
  fields: [],
  typeConnector:'',
  published: false
  };

  scheduler: Scheduler = {
    id: '',
    name: '',
    scanMode:'',
    startsTime:'',
    cronExpression:'',
    jobId:'',
    status: true
  };
  submitted = false;
  message: string;

  constructor(private connectorService: ConnectorServiceService,private serviceJDBC:ConnectorJDBCService,
    private route: ActivatedRoute,private projectService:ProjectServiceService,private schedulerService: SchedulerService) { }
  ngOnInit(): void {
      console.log("jooooob"+this.jobId)
    if (!this.viewMode) {
      this.message = '';
      this.getConnector(this.route.snapshot.params["id"]);

    }

  }
  getConnector(id: string): void {

    this.connectorService.get2(id)
      .subscribe({
        next: (data) => {
          this.currentConnector = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });

  }
  getConnectorJDBC(id: string): void {

    this.serviceJDBC.get(id)
      .subscribe({
        next: (data) => {
          this.currentConnector = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });

  }

  savescheduler(): void {
    const jobId='';
const data2 = {
      timeZone:"Europe/Paris",
      dateTime:this.scheduler.startsTime,
      name: this.scheduler.name,
      scanMode:this.scheduler.scanMode,
      startsTime:this.scheduler.startsTime,
      cronExpression:this.scheduler.cronExpression,
      connectorDAO:this.currentConnector,
      published: false
    };
   // this.planifier(data2);

///////////////////////////////////////////////////////
   if(this.currentConnector.typeConnector==='connectorCSV')
   {console.log("aprés",this.currentConnector.typeConnector)
     this.schedulerService.planifierCSV(data2)
   .subscribe({
     next: (res) => {
       this.jobId=res[1];
       this.submitted = true;
       console.log("resss",res)
       alertify.confirm("This connector was scheduled successefully")
     },
     error: (e) =>{console.error(e)
       alertify.confirm("This connector doesn't scheduled successefully")}
   });}
   if(this.currentConnector.typeConnector==='connectorJDBC')
   {this.schedulerService.planifierJDBC(data2)
   .subscribe({
     next: (res) => {
       console.log(res);
       this.jobId=res[1];

       this.submitted = true;
       alertify.confirm("This connector was scheduled successefully")

     },
     error: (e) => {console.error(e)
       alertify.confirm("This connector doesn't scheduled successefully")

     }
   });}

///////////////////////////////////////////////////////////////////////
    console.log("jjjj",this.jobId)
    const data = {
      id:Math.floor(Math.random() * 6),
      timeZone:"Europe/Paris",
      dateTime:this.scheduler.startsTime,
      name: this.scheduler.name,
      scanMode:this.scheduler.scanMode,
      startsTime:this.scheduler.startsTime,
      cronExpression:this.scheduler.cronExpression,
      connectorDAO:this.currentConnector,
      jobId:this.jobId,
      published: false
    };

    this.schedulerService.create(data,this.currentConnector.id)
      .subscribe({
        next: (res) => {
          console.log("res",res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });


  }
  planifier(data:any){
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
    console.log("planification en cours")
    /*const data = {
      timeZone:"Europe/Paris",
      name: this.scheduler.name,
      scanMode:this.scheduler.scanMode,
      startsTime:this.scheduler.startsTime,
      cronExpression:this.scheduler.cronExpression,
      connectorCSVDTO:this.currentConnector,
      published: false
    };*/
    console.log("avant",this.currentConnector.typeConnector)
  if(this.currentConnector.typeConnector==='connectorCSV')
    {console.log("aprés",this.currentConnector.typeConnector)
      this.schedulerService.planifierCSV(data)
    .subscribe({
      next: (res) => {
        console.log("ress",res);
        console.log("ress[1]",res[1]);
        this.jobId=res[1];
        console.log("jobId",this.jobId);
        alert(this.jobId)
        this.submitted = true;
        alertify.confirm("This connector was scheduled successefully")
      },
      error: (e) =>{console.error(e)
        alertify.confirm("This connector doesn't scheduled successefully")}
    });}
    if(this.currentConnector.typeConnector==='connectorJDBC')
    {this.schedulerService.planifierJDBC(data)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.jobId=res[1];

        this.submitted = true;
        alertify.confirm("This connector was scheduled successefully")

      },
      error: (e) => {console.error(e)
        alertify.confirm("This connector doesn't scheduled successefully")

      }
    });}
  }

  newscheduler(): void {
    this.submitted = false;
    this.scheduler = {
      id: '',
      name: '',

    };
  }

}

