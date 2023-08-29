import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectorCSV } from 'src/app/model/ConnectorCSV copy';
import { SchedulerService } from '../scheduler.service';
import { Scheduler } from 'src/app/model/Scheduler';
import { ConnectorServiceService } from 'src/app/_services/connector-service.service';
import { Connector } from 'src/app/model/Connector';
import { ConnectorJDBC } from 'src/app/model/ConnectorJDBC';
import { ConnectorJDBCService } from 'src/app/_services/connector-jdbc.service';
import * as alertify from 'alertifyjs'
import { ProjectServiceService } from 'src/app/_services/project.service';
@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.css']
})
export class SchedulerListComponent implements OnInit{
 constructor(private projectService:ProjectServiceService,private service:ConnectorJDBCService,private connectorService: ConnectorServiceService,
    private route: ActivatedRoute,private schedulerService:SchedulerService){
}
submitted:false
schedulers?: Scheduler[];

currentIndex = -1;
id = '';
jobId='';
@Input() viewMode = false;

@Input() currentConnector: Connector = {
id:'',
name:'',
fields: [],
published: false
};

scheduler: Scheduler = {
  id: '',
  name: '',
  scanMode:'',
  startsTime:'',
  cronExpression:'',
  endTime:'',
  jobId:'',
  status: true
};
@Input() currentScheduler: Scheduler = {
  id: '',
  name: '',
  scanMode:'',
  startsTime:'',
  cronExpression:'',
  endTime:'',
  jobId:'',
  status: true
};

message: string;

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getConnector(this.route.snapshot.params["id"]);
      this.retrieveSchedulers(this.route.snapshot.params["id"])


    }
//this.retrieveSchedulers();
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
  updateScheduler(data:any,id:any): void {
    this.message = '';
    this.schedulerService.update(id,data).subscribe({
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

     };
      this.planifier(data2);
  }

  getConnectorJDBC(id: string): void {

    this.service.get(id)
      .subscribe({
        next: (data) => {
          this.currentConnector = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
}

savescheduler(): void {
     let a:string;
     const data2 = {
      timeZone:"Europe/Paris",
      dateTime:this.scheduler.startsTime,
      name: this.scheduler.name,
      scanMode:this.scheduler.scanMode,
      startsTime:this.scheduler.startsTime,
      endTime:this.scheduler.endTime,
      cronExpression:this.scheduler.cronExpression,
      connectorDAO:this.currentConnector,
      status:true
    };
   // const res=this.planifier(data2);
    //alert("this"+res)
    this.planifier(data2).then(job => {
      a=job;
      console.log("Job ID:"+ job);

      console.log("this.jobId aprés planif",a);
      const data1 = {
        id:Math.floor(Math.random() * 6)+1,
        name: this.scheduler.name,
        scanMode:this.scheduler.scanMode,
        startsTime:this.scheduler.startsTime,
        endTime:this.scheduler.endTime,
        cronExpression:this.scheduler.cronExpression,
        jobId:a,
      };

       this.schedulerService.create(data1,this.currentConnector.id)
         .subscribe({
           next: (res) => {
             console.log("res",res);
             alertify.success("your Scheduler was saved successfelly")
             this.refreshList()
             this.CloseModel()
             //this.submitted = true;
           },
           error: (e) => {console.error(e)
          }
         });
    }).catch(error => {
      console.error("Erreur:", error.message);
    });

   }
planifier(data: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
/////verifProject
const a=this.currentConnector.projectName
    console.log("currentConnector"+a)
    this.projectService.findByName2(a).subscribe({
      next: (res) => {
        console.log("les info de"+a+res.proxemToken)
       if(res.proxemToken!="a0e04a5f-ab7c-4b0e-97be-af263a61ba49"){
        alertify.confirm("Based on the information provided, it is likely that the project you are referring to does not yet exist in Proxem. To confirm or select an existing project, please verify the details") }
      },
      error: (e) => {console.error(e)
      }
    });
      let job = '';
      const now = new Date();
      console.log("now"+now);

      const year = now.getFullYear();
      const month = ('0' + (now.getMonth() + 1)).slice(-2);
      const day = ('0' + now.getDate()).slice(-2);
      const hour = ('0' + now.getHours()).slice(-2);
      const minute = ('0' + now.getMinutes()).slice(-2);
      const second = ('0' + now.getSeconds()).slice(-2);

      // Format the transformed date string
      const trans = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

      if ((data.startsTime > data.endTime && (data.endTime !=''))) {
        alert("The end time must be later than the start time")
      }
      if ((data.startsTime <= trans) || ((data.endTime <= trans) && (data.endTime !=''))) {
        alert("Date must be after current date")
        reject(new Error("Date must be after current date"));
        return;
      }

      if (this.currentConnector.typeConnector === 'connectorCSV') {
        this.schedulerService.planifierCSV(data).subscribe({
          next: (res) => {
            job = res.jobId;
            resolve(job);
            alertify.success("your Scheduler was scheduled successfelly")
          },
          error: (e) => {
            reject(e);
            alertify.confirm("This connector doesn't scheduled successefully")
          }
        });
      } else if (this.currentConnector.typeConnector === 'connectorJDBC') {
        this.schedulerService.planifierJDBC(data).subscribe({
          next: (res) => {
            job = res.jobId;
            resolve(job);
            alertify.success("your Scheduler was scheduled successfelly")
          },
          error: (e) => {
            reject(e);
            alertify.confirm("This connector doesn't scheduled successefully")
          }
        });
      }
      else if (this.currentConnector.typeConnector === 'connectorXML') {
        this.schedulerService.planifierXML(data).subscribe({
          next: (res) => {
            job = res.jobId;
            resolve(job);
            alertify.success("your Scheduler was scheduled successfelly")
          },
          error: (e) => {
            reject(e);
            alertify.confirm("This connector doesn't scheduled successefully")
          }
        });
      }
      else if (this.currentConnector.typeConnector === 'connectorNoSQL') {
        this.schedulerService.planifierNoSQL(data).subscribe({
          next: (res) => {
            job = res.jobId;
            resolve(job);
            alertify.success("your Scheduler was scheduled successfelly")
          },
          error: (e) => {
            reject(e);
            alertify.confirm("This connector doesn't scheduled successefully")
          }
        });
      }
    });
  }


  retrieveSchedulers(i:string): void {

    this.schedulerService.getAllByConnectorDAOId(i)
      .subscribe({
        next: (data) => {
          this.schedulers = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveSchedulers(this.route.snapshot.params["id"]);
    this.currentScheduler = {};
    this.currentIndex = -1;
  }
  cancel():void{

    this.CloseModel()
   }
  openModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'block';
    }
  }

  CloseModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'none';
    }
  }

  setActiveScheduler(scheduler: Scheduler, index: number): void {
   scheduler=  this.currentScheduler;
    this.currentIndex = index;
  }
  stopScheduler(job:any):void{
    alertify.confirm("Remove Scheduler","do you want strop this scheduler?",()=>{
      this.schedulerService.stopScheduler(job)
      .subscribe({
        next: (res) => {
          console.log("stop result",res);
          alertify.success ('Scheduler stopped successfully! ');
        },
        error: (e) => console.error(e)
      });},function(){})
  }
  deletethisScheduler(id:any,jobId:any): void {
   alertify.confirm("Remove Scheduler","do you want remove this scheduler?",()=>{
        console.log("job: "+jobId);
        this.stopScheduler(jobId);
        this.delete(id);
 },function(){})


}
delete(id: any) {
    this.schedulerService.delete(id)
        .subscribe({
          next: (res) => {
            console.log(res);
            alertify.success ('Scheduler removed successfully! ');
            this.refreshList();
          },
          error: (e) => console.error(e)
        });
  }

/**
 * stopScheduler(job:any):Promise<string> {
    return new Promise<string>((resolve, reject) => {{
    alertify.confirm("Remove Scheduler","do you want strop this scheduler?",()=>{
      this.schedulerService.stopScheduler(job)
      .subscribe({
        next: (res) => {
          console.log("stop result",res);
          alertify.success ('Scheduler stopped successfully! ');
        },
        error: (e) => console.error(e)
      });},function(){})
  }})}
  deletethisScheduler(id:any,jobId:any): void {
   alertify.confirm("Remove Scheduler","do you want remove this scheduler?",()=>{
        console.log("job: "+jobId);
        this.stopScheduler(jobId).then(a=>{
          this.delete(id);
        }

        )

 },function(){})


}
 */
removeAllSchedulers(): void {
      alertify.confirm("Remove schedulers","do you want remove all these schedulers?",()=>{this.schedulerService.deleteAll(this.currentConnector.id)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.refreshList();
          },
          error: (e) => console.error(e)
        });},function(){})
    }


}
