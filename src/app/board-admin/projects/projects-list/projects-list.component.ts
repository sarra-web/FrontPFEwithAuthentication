import { Component, OnInit } from '@angular/core';
import { Observable, of,BehaviorSubject } from 'rxjs';
import { ApiResponse } from '../model/api-response';
import { Page } from '../model/page';
import { HttpErrorResponse } from '@angular/common/http';
import { map, startWith, catchError } from 'rxjs/operators';
import { ProjectServiceService } from '../project.service';
import { Project } from '../model/Project';
import { Router } from '@angular/router';
import * as alertify from 'alertifyjs'
@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit{


projectsState$: Observable<{ appState: string; appData?: ApiResponse<Page>; error?: HttpErrorResponse; }>;
  responseSubject = new BehaviorSubject<ApiResponse<Page>>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
 //loadingService: any;
  projects: Project[];
  submitted=false;
  project: Project={};
  currentproject: Project={};
  currentIndex = -1;
  name:string = "";
  input:any;
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];
  title = 'angular-mateiral';
  selectedValue: string = '';
  constructor(private router: Router,private projectService:ProjectServiceService ) { }

  ngOnInit(): void {
    this.retrieveprojects();

        this.projectsState$ = this.projectService.projects$().pipe(
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
    )
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
          window.location.reload();
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });

  }

  getRequestParams(name: string, page: number, pageSize: number): any {
    let params: any = {};

    if (name) {
      params[`name`] = name;
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

     this.projectsState$ = this.projectService.projects$(pageNumber).pipe(
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
   retrieveprojects(): void {
    const params = this.getRequestParams(this.name, this.page, this.pageSize);
    this.projectService.findByNameContaining(params)
      .subscribe({
        next: (data) => {
          const {projects, totalItems } = data;
          this.projects = projects;
          this.count = totalItems;
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  fCSV( id:any):void{
     this.router.navigate(['/projects/csv/'+id]);
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveprojects();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveprojects();
  }
  /*retrieveprojects(): void {
    this.projectService.getAll()
      .subscribe({
        next: (data) => {
          this.projects = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }*/

  refreshList(): void {
    this.retrieveprojects();
    this.currentproject = {};
    this.currentIndex = -1;
  }

  setActiveproject(project: Project, index: number): void {
    this.currentproject = project;
    this.currentIndex = index;
  }

removeAllprojects(): void {
    alertify.confirm("Remove projects","do you want remove all these projects?",()=>{this.projectService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });},function(){})


    /**this.projectService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      }); */

    }
  f(){
    const modelDiv = document.getElementById('myModal2');
    if(modelDiv!= null) {
      modelDiv.style.display = 'block';
    }
  }

  deletethisproject(id:any,i:any): void {
    this.setActiveproject(this.currentproject,i);
    alertify.confirm("Remove project","do you want remove this project?",()=>{this.projectService.delete(id)
    .subscribe({
      next: (res) => {
        console.log(res);
        window.location.reload();
        this.router.navigate(['/projects']);
      },
      error: (e) => console.error(e)
    });},function(){})

}
  searchByNameIgnoreCase(): void {
    const params = this.getRequestParams(this.name, this.page, this.pageSize);
    console.log("name",this.name)
    this.currentproject = {};
    this.currentIndex = -1;

    this.projectService.findByNameContaining(params)
    .subscribe({
      next: (data) => {
        const {projects, totalItems } = data;
        this.projects = projects;
        this.count = totalItems;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  searchName(): void {
    this.currentIndex = -1;

    this.projectService.findByNameIgnoreCase(this.name)
      .subscribe({
        next: (data) => {
          this.projects = data;
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

  CloseModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'none';
    }
  }

   changementDePageWithCondition():void{
    if (this.selectedValue==='CSV')

   {pass:true
    this.CloseModel()
    this.router.navigateByUrl('/upload');}


   else if (this.selectedValue==='XML')
    {pass:true
      this.CloseModel()
      this.router.navigateByUrl('/addxml');}



   else if (this.selectedValue==='JDBC')
    {this.router.navigateByUrl('/addjdbc');
    pass:true
    this.CloseModel()
   }


   }


   cancel():void{
    //this.router.navigateByUrl('/projects');
    this.CloseModel()
   }
  myFunction() {
  //document.getElementById("myDropdown").classList.toggle("show");
}

 filterFunction() {
  /*var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = this.input.toUpperCase();
  const div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
  const  txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }*/
}
}






