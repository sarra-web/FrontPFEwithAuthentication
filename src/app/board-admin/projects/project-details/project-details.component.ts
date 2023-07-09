import { Component, Input } from '@angular/core';
import { Project } from '../model/Project';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectServiceService } from '../project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent {

  @Input() viewMode = false;

  @Input() currentProject: Project = {
    name: '',
    proxemToken: '',
    published: false
  };

  message = '';

  constructor(
    private projectService: ProjectServiceService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getProject(this.route.snapshot.params["id"]);
    }
  }

  getProject(id: string): void {
    this.projectService.get(id)
      .subscribe({
        next: (data) => {
          this.currentProject = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  updatePublished(status: boolean): void {
    const data = {
      name: this.currentProject.name,
      proxemToken: this.currentProject.proxemToken,
      published: status
    };

    this.message = '';

    this.projectService.update( data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentProject.published = status;
          this.message = res.message ? res.message : 'The status was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }

  updateProject(): void {
    this.message = '';

    this.projectService.update(this.currentProject)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'This Project was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }

  deleteProject(): void {
    this.projectService.delete(this.currentProject.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/Projects']);
        },
        error: (e) => console.error(e)
      });
  }

}

