import { Component, OnInit } from '@angular/core';
import { Observable, of,BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { map, startWith, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/model/api-response';
import { Page } from 'src/app/model/page';
import { ConnectorServiceService } from 'src/app/_services/connector-service.service';
import * as alertify from 'alertifyjs'
import { Connector } from 'src/app/model/Connector';
import { ConnectorJDBCService } from 'src/app/_services/connector-jdbc.service';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import {  ActivatedRoute, Params, NavigationEnd, UrlSegment } from '@angular/router';
import { merge,  Subscribable, Subject } from 'rxjs';
import {filter,  switchMap, tap,takeUntil, debounceTime
} from 'rxjs/operators';
import { Project } from 'src/app/model/Project';
import { ProjectServiceService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';
@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.css']
})
export class ConnectorsComponent implements OnInit{
  form = this.fb.group({ name: [], type: [], completed: [], });


  connectorsState$: Observable<{ appState: string; appData?: ApiResponse<Page>; error?: HttpErrorResponse; }>;
  responseSubject = new BehaviorSubject<ApiResponse<Page>>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  connectors?: Connector[];
  connector?: Connector;
  checkPoint:string;
  currentConnector: Connector = {
    projectName:'',
    fields: []
  };
  afficherTexte=false;
  currentIndex = -1;
  name = '';
  projectName='';
  input:any;
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];
  currentUser:any;
  //geek=false
  title = 'angular-mateiral';
  selectedValue: string = '';
  projects:Project[];
  constructor(private projectService:ProjectServiceService,private router: Router,private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private connectorService:ConnectorServiceService,
    private connectorJDBCService:ConnectorJDBCService ,private storageService:StorageService,) { }

  ngOnInit(): void {
    this.currentUser=this.storageService.getUser()

    this.projectService.getAll().subscribe({
      next:(data) =>{
        this.projects = data;

          console.log(data);
      },
      error: (e) => console.error(e)
    });
    this.retrieveConnectors();

        this.connectorsState$ = this.connectorService.connectors$().pipe(
        map((response: ApiResponse<Page>) => {
        this.responseSubject.next(response);
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
  getRequestParams2(userName:string,name: string, page: number, pageSize: number): any {
    let params: any = {};

    if (userName) {
      params[`userName`] = userName;
    }
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

     this.connectorsState$ = this.connectorService.connectors$( pageNumber).pipe(
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
   retrieveConnectors(): void {
    const params = this.getRequestParams(this.currentUser.username, this.page, this.pageSize);

    this.connectorService.findByUserName(params)
      .subscribe({
        next: (data) => {
          const {connectors, totalItems } = data;
          this.connectors = connectors;
          this.count = totalItems;
          for (let i = 0; i < totalItems; i = i + 1){
            connectors[i].projectName=connectors[i].project.name
            console.log(connectors[i].projectName)
          }

          console.log(data);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
  clearFromProxem(){}
  fCSV( id:any):void{
     this.router.navigate(['/connectors/csv/'+id]);
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveConnectors();
  }
  scan(): void {
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
    if(this.currentConnector.typeConnector==="connectorCSV"){

    this.connectorService.updateProx(this.currentConnector).subscribe({
      next: (res) => {
        const now = new Date();
        let j=0;
        for (let i = 0; i < res.length; i = i + 1){
          if(res[i].UpsertSuccessful===true){
                j=j+1;
          }}
        if(res[0].UpsertSuccessful===true){
          alertify.success (j+' documents are pushed to proxem successfully! \n start time: '+now);
        }
        if(!res[0].Errors ===false){
          alertify.success ('You data was pushed to proxem successfully! but not accepted');
        }
        if(res.lenght===0){
          alertify.success ('You data does not pushed to proxem successfully!');
        }

      },
      error: (e) => {console.error(e)
        alertify.confirm("Based on the information provided, it is likely that the project you are referring to does not yet exist in Proxem. To confirm or select an existing project, please verify the details")
      }
    });}
    if(this.currentConnector.typeConnector==="connectorJDBC"){
      console.log(this.currentConnector)

      this.connectorJDBCService.updateProx(this.currentConnector).subscribe({
        next: (res) => {
          console.log("res",res);
          const now = new Date();
          let j=0;
          for (let i = 0; i < res.length; i = i + 1){
            if(res[i].UpsertSuccessful===true){
                  j=j+1;
            }}
          if(res[0].UpsertSuccessful===true){
            alertify.success (j+' documents are pushed to proxem successfully! \n start time: '+now);
          }
          if(!res[0].Errors ===false){
            alertify.success ('You data was pushed to proxem successfully! but not accepted');
          }
          if(res.lenght===0){
            alertify.success ('You data does not pushed to proxem successfully!');
          }

        },
        error: (e) => {console.error(e)
        //  alertify.confirm("Based on the information provided, it is likely that the project you are referring to does not yet exist in Proxem. To confirm or select an existing project, please verify the details")

        }
      });}


  }
  openModelCheck() {
    const modelDiv = document.getElementById('myModalChek');
    if(modelDiv!= null) {
      modelDiv.style.display = 'block';
    }
  }
  scanFromCheckPoint(): void {
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

const data2={
  check:this.checkPoint,
  connectorJDBCDTO:this.currentConnector
}
console.log(data2)
    this.connectorJDBCService.updateProxPlusCheck(data2).subscribe({
      next: (res) => {
        console.log("res",res,"lenght",res.length);
        const now = new Date();
        let j=0;
        for (let i = 0; i < res.length; i = i + 1){
          if(res[i].UpsertSuccessful===true){
                j=j+1;
          }}
        if(res[0].UpsertSuccessful===true){
          alertify.success (j+' documents are pushed to proxem successfully! \n start time: '+now);
        }
        if(!res[0].Errors ===null){
          alertify.success ('You data was pushed to proxem successfully! but not accepted');
        }
        if(res.lenght===0){
          alertify.success ('You data does not pushed to proxem successfully!');
        }

      },
      error: (e) => {console.error(e)
        alertify.confirm("Based on the information provided, it is likely that the project you are referring to does not yet exist in Proxem. To confirm or select an existing project, please verify the details")

      }
    });
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveConnectors();
  }
  /*retrieveConnectors(): void {
    this.connectorService.getAll()
      .subscribe({
        next: (data) => {
          this.connectors = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }*/

  refreshList(): void {
    this.retrieveConnectors();
    this.currentConnector = {fields:[]};
    this.currentIndex = -1;
  }

  setActiveConnector(connector: Connector, index: number): void {
    this.currentConnector = connector;
    this.currentIndex = index;
  }

removeAllConnectors(): void {
    alertify.confirm("Remove connectors","do you want remove all these connectors?",()=>{this.connectorService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });},function(){})


    /**this.connectorService.deleteAll()
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

  deletethisConnector(id:any): void {
    if(this.currentConnector.typeConnector==="connectorCSV"){
      alertify.confirm("Remove Connector","do you want remove this connector?",()=>{this.connectorService.delete(id)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.router.navigate(['/connectors']);
            alertify.success ('connector removed successfully! ');
            this.refreshList();
          },
          error: (e) => console.error(e)
        });},function(){})
    }
    if(this.currentConnector.typeConnector==="connectorJDBC"){
      alertify.confirm("Remove Connector","do you want remove this connector?",()=>{this.connectorJDBCService.delete(id)
        .subscribe({
          next: (res) => {
            console.log(res);
            alertify.success ('connector removed successfully! ');
            this.refreshList();
            this.router.navigate(['/connectors']);
          },
          error: (e) => console.error(e)
        });},function(){})
    }

}



  searchByNameIgnoreCase(): void {
    this.currentConnector = {fields:[]};
    this.currentIndex = -1;
    this.connectorService.findByNameIgnoreCase(this.projectName)
      .subscribe({
        next: (data) => {
          this.connectors = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
  searchByNameIgnoreCase2(): void {
    const params = this.getRequestParams(this.name.toLowerCase(), this.page, this.pageSize);

    this.currentConnector = {fields:[]};
    this.currentIndex = -1;

    this.connectorService.findByNameContaining(params)
    .subscribe({
      next: (data) => {
        const {connectors, totalItems } = data;
        this.connectors =connectors
       //this.connectors =this.connectors.filter(element => this.connectors.includes(element));
        this.count = totalItems;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  searchByUserName(): void {
    const params = this.getRequestParams(this.currentUser.username, this.page, this.pageSize);

    this.currentConnector = {fields:[]};
    this.currentIndex = -1;

    this.connectorService.findByUserName(params)
    .subscribe({
      next: (data) => {
        const {connectors, totalItems } = data;
        this.connectors = connectors;
        this.count = totalItems;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  searchByProjectName(event:any): void {
    const params = this.getRequestParams(this.projectName, this.page, this.pageSize);

    this.currentConnector = {fields:[]};
    this.currentIndex = -1;

    this.connectorService.findByProjectName(params)
    .subscribe({
      next: (data) => {
        const {connectors, totalItems } = data;
        this.connectors = connectors;
        //this.connectors =this.connectors.filter(element => this.connectors.includes(element));;

        this.count = totalItems;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  searchByProjectNameAndUser(event:any): void {
    const params = this.getRequestParams2(this.currentUser.username,this.projectName, this.page, this.pageSize);

    this.currentConnector = {fields:[]};
    this.currentIndex = -1;

    this.connectorService.findByProjectNameAndUserName(params)
    .subscribe({
      next: (data) => {
        const {connectors, totalItems } = data;
        this.connectors = connectors;
        this.count = totalItems;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  searchName(): void {
    this.currentConnector = {fields:[]};
    this.currentIndex = -1;

    this.connectorService.findByName(this.name)
      .subscribe({
        next: (data) => {
          this.connector = data;
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
  CloseModel2() {
    const modelDiv = document.getElementById('myModalChek');
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
    this.router.navigateByUrl('/connectors');
    this.CloseModel()
   }
   cancel2():void{
    this.router.navigateByUrl('/connectors');
    this.CloseModel2()
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


