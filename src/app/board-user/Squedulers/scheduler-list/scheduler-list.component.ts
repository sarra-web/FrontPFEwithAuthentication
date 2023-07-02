import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectorCSV } from 'src/app/model/ConnectorCSV copy';
import { SchedulerService } from '../scheduler.service';
import { Scheduler } from 'src/app/model/Scheduler';
import { ConnectorServiceService } from 'src/app/_services/connector-service.service';

@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.css']
})
export class SchedulerListComponent implements OnInit{
 constructor(private connectorService: ConnectorServiceService,
    private route: ActivatedRoute,private schedulerService:SchedulerService){
}
submitted:false
schedulers?: Scheduler[];
currentScheduler: Scheduler= {};
currentIndex = -1;
id = '';
@Input() viewMode = false;

@Input() currentConnector: ConnectorCSV = {
id:'',
name:'',
encoding:'',
separator:'',
quotingCaracter:'"',
path:'',
containsHeaders:true,
escapingCaracter:'/',
fields: [],
published: false
};
  message: string;
  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getConnector(this.route.snapshot.params["id"]);
    }
//this.retrieveSchedulers();
}
 getConnector(id: string): void {
    this.connectorService.get(id)
      .subscribe({
        next: (data) => {
          this.currentConnector = data;
          console.log(data);
          console.log(this.currentConnector.path)

        },
        error: (e) => console.error(e)
      });

  }
  retrieveSchedulers(): void {
    this.schedulerService.getAllByConnectorDAOId(this.currentConnector.id)
      .subscribe({
        next: (data) => {
          this.schedulers = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveSchedulers();
    this.currentScheduler = {};
    this.currentIndex = -1;
  }

  setActiveScheduler(scheduler: Scheduler, index: number): void {
    this.currentScheduler = scheduler;
    this.currentIndex = index;
  }

  removeAllSchedulers(): void {
    this.schedulerService.deleteAll(this.currentConnector.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
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
