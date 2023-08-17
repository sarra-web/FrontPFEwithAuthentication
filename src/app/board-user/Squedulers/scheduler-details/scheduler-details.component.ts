import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { BoardAdminService } from 'src/app/board-admin/board-admin.service';
import * as alertify from 'alertifyjs'
import { Scheduler } from 'src/app/model/Scheduler';
import { SchedulerService } from '../scheduler.service';
import { ConnectorServiceService } from 'src/app/_services/connector-service.service';
import { Connector } from 'src/app/model/Connector';
import { ProjectServiceService } from 'src/app/_services/project.service';
@Component({
  selector: 'app-scheduler-details',
  templateUrl: './scheduler-details.component.html',
  styleUrls: ['./scheduler-details.component.css']
})
export class SchedulerDetailsComponent {
  constructor(private projectService:ProjectServiceService,
    private service: SchedulerService,
    private route: ActivatedRoute,private connectorService: ConnectorServiceService,
    private router: Router) { }
  @Input() viewMode = false;

  @Input() currentConnector: Connector = {
    id:'',
    name:'',
    fields: [],
    published: false
    };
  @Input() currentScheduler: Scheduler = {

  name:'',
  scanMode:'',
  startsTime:'',
  cronExpression:'',
  endTime:''
  };
  roledata: any;

  message = '';
  ngOnInit(){

    if (!this.viewMode) {
      this.getConnector(this.route.snapshot.params["id"]);
      this.getScheduler(this.route.snapshot.params["id"]);

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
  getScheduler(id: any): void {
    this.service.getById(id)
      .subscribe({
        next: (data) => {
          this.currentScheduler = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });

  }

  myFunction():void {
    var x = document.getElementById("b") as HTMLInputElement;
    if (x.type === "password") {
       console.log("pass")
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  updateScheduler(data:any,id:any): void {
    this.message = '';
    this.service.update(id,data).subscribe({
        next: (res) => {
          console.log(res);
         // this.message = res.message ? res.message : 'This Connector was updated successfully!';
          alertify.success("This Connector was updated successfully!")

        },
        error: (e) => {//console.error(e);this.message='bad request'
        console.log(e)
      }
      });
      const data2 = {
        timeZone:"Europe/Paris",
       dateTime:data.startsTime,
       name: data.name,
       scanMode:data.scanMode,
       startsTime:data.startsTime,
       endTime:data.endTime,
       cronExpression:data.cronExpression,
       connectorDAO:this.currentConnector,
       published: false
     };
      this.planifier(data2);
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
    const now = new Date();
    if((data.startsTime<=now)||((data.endTime<=now)&&(data.endTime!=''))){
     alertify.confirm("date must be after current date")
    }

    console.log("avant",this.currentConnector.typeConnector)
    if(this.currentConnector.typeConnector==='connectorCSV')
    {console.log("aprés",this.currentConnector.typeConnector)
    console.log("data",data)
      this.service.planifierCSV(data)
    .subscribe({
      next: (res) => {
       alertify.success("your connector was Scheduled successfelly")
       console.log("resJob",res);
      },
   error: (e) => console.error("erreur",e)

    });}
    if(this.currentConnector.typeConnector==='connectorJDBC')
    {this.service.planifierJDBC(data)
    .subscribe({
      next: (res) => {
        console.log(res);
       // this.submitted = true;
      },
      error: (e) => console.error(e)
    });}



  }

}
