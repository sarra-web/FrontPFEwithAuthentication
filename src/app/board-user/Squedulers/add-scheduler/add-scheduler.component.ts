import { Component, Input, OnInit } from '@angular/core';
import { Scheduler } from 'src/app/model/Scheduler';
import { SchedulerService } from '../scheduler.service';
import { ConnectorCSV } from 'src/app/model/ConnectorCSV copy';
import { ActivatedRoute } from '@angular/router';
import { ConnectorServiceService } from 'src/app/_services/connector-service.service';

@Component({
  selector: 'app-add-scheduler',
  templateUrl: './add-scheduler.component.html',
  styleUrls: ['./add-scheduler.component.css']
})
export class AddSchedulerComponent implements OnInit{

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

  scheduler: Scheduler = {
    id: '',
    name: '',
    scanMode:'',
    scanType:'',
    startsTime:'',
    executionTime:'',
    published: false
  };
  submitted = false;
  message: string;

  constructor(private connectorService: ConnectorServiceService,
    private route: ActivatedRoute,private schedulerService: SchedulerService) { }
  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getConnector(this.route.snapshot.params["id"]);
    }

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

  savescheduler(): void {
    const data = {
      id:  111,
      timeZone:"Europe/Paris",
      name: this.scheduler.name,
      scanMode:this.scheduler.scanMode,
      dateTime:this.scheduler.startsTime,
      scanType:this.scheduler.scanType,
      startsTime:this.scheduler.startsTime,
      executionTime:this.scheduler.executionTime,
      connectorCSVDTO:this.currentConnector,
      published: false
    };

    this.schedulerService.create(data,this.currentConnector.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
      this.schedulerService.planifier(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }

  newscheduler(): void {
    this.submitted = false;
    this.scheduler = {
      id: '',
      name: '',
      published: false
    };
  }

}

