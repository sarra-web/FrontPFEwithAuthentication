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
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';

import { ApiResponse } from '../../../model/api-response';
import { Page } from '../../../model/page';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.css']
})
export class SchedulerListComponent implements OnInit{

schedulersState$: Observable<{ appState: string; appData?: ApiResponse<Page>; error?: HttpErrorResponse; }>;
  responseSubject = new BehaviorSubject<ApiResponse<Page>>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  constructor(private projectService:ProjectServiceService,private service:ConnectorJDBCService,private connectorService: ConnectorServiceService,
    private route: ActivatedRoute,private schedulerService:SchedulerService){
}
page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];
submitted:false
schedulers?: Scheduler[];

currentIndex = -1;
id = '';
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
  published: false
};
@Input() currentScheduler: Scheduler = {
  id: '',
  name: '',
  scanMode:'',
  startsTime:'',
  cronExpression:'',
  endTime:'',
  published: false
};

message: string;

  ngOnInit(): void {


     // this.message = '';
     // this.getConnector(this.route.snapshot.params["id"]);
     // this.retrieveSchedulers2()
    /*this.schedulersState$ = this.schedulerService.schedulers$(this.route.snapshot.params["id"]).pipe(
    map((response: ApiResponse<Page>) => {
    this.responseSubject.next(response);
    this.currentPageSubject.next(response.data.page.number);
    console.log(response);
    return ({ appState: 'APP_LOADED', appData: response });
  }),
  startWith({ appState: 'APP_LOADING' }),
  catchError((error: HttpErrorResponse) =>{
    return of({ appState: 'APP_ERROR', error })}
    )
)*/
    if (!this.viewMode) {
      this.message = '';
      this.getConnector(this.route.snapshot.params["id"]);
      this.retrieveSchedulers(this.route.snapshot.params["id"])


    }
//this.retrieveSchedulers();
}


retrieveSchedulers2(): void {
  const params = this.getRequestParams(this.route.snapshot.params["id"],this.page, this.pageSize);
  this.schedulerService.getAllByConnectorDAOIdWithPagination(params)
    .subscribe({
      next: (data) => {
        const {schedulers, totalItems } = data;
        this.schedulers = schedulers;
        this.count = totalItems;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
}
getRequestParams(id: string, page: number, pageSize: number): any {
  let params: any = {};

  if (id) {
    params[`id`] = id;
  }

  if (page) {
    params[`page`] = page - 1;
  }

  if (pageSize) {
    params[`size`] = pageSize;
  }

  return params;
}

gotToPage(pageNumber: number = 0): void {

   this.schedulersState$ = this.schedulerService.schedulers$(this.route.snapshot.params["id"],pageNumber).pipe(
     map((response: ApiResponse<Page>) => {
       this.responseSubject.next(response);
       this.currentPageSubject.next(pageNumber);
       console.log(response);
       return ({ appState: 'APP_LOADED', appData: response });
     }),
     startWith({ appState: 'APP_LOADED', appData: this.responseSubject.value }),
     catchError((error: HttpErrorResponse) =>{
    return of({ appState: 'APP_ERROR', error })}
       )
   )
 }
 goToNextOrPreviousPage(direction?: string): void {
   this.gotToPage( direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1);
 }
handlePageChange(event: number): void {
  this.page = event;
  this.retrieveSchedulers2();
}
handlePageSizeChange(event: any): void {
  this.pageSize = event.target.value;
  this.page = 1;
  this.retrieveSchedulers2();
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
       published: false
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
    const data1 = {

       id:Math.floor(Math.random() * 1001),
       name: this.scheduler.name,
       scanMode:this.scheduler.scanMode,
       startsTime:this.scheduler.startsTime,
       endTime:this.scheduler.endTime,
       cronExpression:this.scheduler.cronExpression,
       published: false
     };
     const data2 = {
      timeZone:"Europe/Paris",
      dateTime:this.scheduler.startsTime,
      name: this.scheduler.name,
      scanMode:this.scheduler.scanMode,
      startsTime:this.scheduler.startsTime,
      endTime:this.scheduler.endTime,
      cronExpression:this.scheduler.cronExpression,
      connectorDAO:this.currentConnector,
      published: false
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
         error: (e) => {
          console.log("error in saving scheduler ")
          console.error(e)

        }
       });

    this.planifier(data2)
    window.location.reload();
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
       this.schedulerService.planifierCSV(data)
     .subscribe({
       next: (res) => {
        alertify.success("your connector was Scheduled successfelly")
        console.log("resJob",res);
       },
    error: (e) => console.error("erreur",e)

     });}
     if(this.currentConnector.typeConnector==='connectorJDBC')
     {this.schedulerService.planifierJDBC(data)
     .subscribe({
       next: (res) => {
         console.log(res);
        // this.submitted = true;
       },
       error: (e) => console.error(e)
     });}


     this.refreshList();
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

  deletethisScheduler(id:any): void {

      alertify.confirm("Remove Scheduler","do you want remove this scheduler?",()=>{this.schedulerService.delete(id)
        .subscribe({
          next: (res) => {
            console.log(res);
            alertify.success ('Scheduler removed successfully! ');
            this.refreshList();
          },
          error: (e) => console.error(e)
        });},function(){})


}

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

 /* searchName(): void {
    this.currentScheduler = {};
    this.currentIndex = -1;

    this.schedulerService.findBy
      .subscribe({
        next: (data) => {
          this.tutorials = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }*/







}
