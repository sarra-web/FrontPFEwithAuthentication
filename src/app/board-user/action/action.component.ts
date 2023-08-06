import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConnectorServiceService } from 'src/app/_services/connector-service.service';
import { ProjectServiceService } from 'src/app/_services/project.service';
import { ConnectorCSV } from 'src/app/model/ConnectorCSV copy';
import { Field } from 'src/app/model/FieldDAO';
import { Project } from 'src/app/model/Project';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent {
  @Input() viewMode = false;

  @Input() currentConnector: ConnectorCSV = {
  id:'',
  name:'',
  userName:'',
  projectName:'',
  encoding:'',
  separator:'',
  quotingCaracter:'"',
  path:'',
  containsHeaders:true,
  escapingCaracter:'/',
  fields: [],
  published: false
  };
  currentFile?: File;
  progress = 0;
  message = '';
  fileName = '';
  fileInfos?: Observable<any>;
  submitted = false;
  form: any;
  data: string[][] = [];
  result: Field[] = [];
  projects:Project[];
  constructor(
    private connectorService: ConnectorServiceService,
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

    }


  }
  getConnector(id: string): void {
    this.connectorService.get(id)
      .subscribe({
        next: (data) => {
          this.currentConnector = data;
          console.log(data);
          console.log(this.currentConnector.path)
      this.fileName=this.currentConnector.path;
        },
        error: (e) => console.error(e)
      });

  }
}
