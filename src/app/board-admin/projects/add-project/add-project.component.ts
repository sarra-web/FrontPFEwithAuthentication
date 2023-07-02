import { Component,OnInit } from '@angular/core';
import { ProjectServiceService } from '../project.service';
import { Project } from '../model/Project';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit{

  project:Project = {
    name: '',
    proxemToken: '',

  };
  submitted = false;

  constructor(private fb: FormBuilder,private projectService: ProjectServiceService) { }
  ngOnInit(): void {

  }

  saveProject(): void {
    const data = {
      id:this.project.name,
      name: this.project.name,
      proxemToken: this.project.proxemToken
    };

    this.projectService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }

  newproject(): void {
    this.submitted = false;
    this.project = {
      name: '',
      proxemToken: '',
      published: false
    };
  }
}
