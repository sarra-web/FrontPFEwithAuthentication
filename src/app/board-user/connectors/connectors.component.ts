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


@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.css']
})
export class ConnectorsComponent implements OnInit{
  connectorsState$: Observable<{ appState: string; appData?: ApiResponse<Page>; error?: HttpErrorResponse; }>;
  responseSubject = new BehaviorSubject<ApiResponse<Page>>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  connectors?: Connector[];
  connector?: Connector;
  currentConnector: Connector = {
    fields: []
  };
  currentIndex = -1;
  name = '';
  input:any;
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];
  title = 'angular-mateiral';
  selectedValue: string = '';
  constructor(private router: Router,
    private connectorService:ConnectorServiceService,
    private connectorJDBCService:ConnectorJDBCService ) { }

  ngOnInit(): void {
    this.retrieveConnectors();

        this.connectorsState$ = this.connectorService.connectors$().pipe(
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
    const params = this.getRequestParams(this.name, this.page, this.pageSize);

    this.connectorService.findByNameContaining(params)
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
  clearFromProxem(){}
  fCSV( id:any):void{
     this.router.navigate(['/connectors/csv/'+id]);
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveConnectors();
  }
  pushActiveConnector(): void {

    if(this.currentConnector.typeConnector==="connecteurCSV"){
    console.log(this.currentConnector)
    this.connectorService.updateProx(this.currentConnector).subscribe({
      next: (res) => {
        const now = new Date();
        let j=0;
        for (let i = 0; i < res.length; i = i + 1){
          if(res[i].UpsertSuccessful===true){
                j=j+1;
          }}
        if(res[1].UpsertSuccessful===true){
          alertify.success (j+' documents are pushed to proxem successfully! \n start time: '+now);
        }
        if(!res[1].Errors ===false){
          alertify.success ('You data was pushed to proxem successfully! but not accepted');
        }
        else{
          alertify.success ('You data does not pushed to proxem successfully!');
        }

      },
      error: (e) => console.error(e)
    });}
    if(this.currentConnector.typeConnector==="connecteurJDBC"){
      console.log(this.currentConnector)
      this.connectorJDBCService.updateProx(this.currentConnector).subscribe({
        next: (res) => {
          const now = new Date();
          let j=0;
          for (let i = 0; i < res.length; i = i + 1){
            if(res[i].UpsertSuccessful===true){
                  j=j+1;
            }}
          if(res[1].UpsertSuccessful===true){
            alertify.success (j+' documents are pushed to proxem successfully! \n start time: '+now);
          }
          if(!res[1].Errors ===false){
            alertify.success ('You data was pushed to proxem successfully! but not accepted');
          }
          else{
            alertify.success ('You data does not pushed to proxem successfully!');
          }

        },
        error: (e) => console.error(e)
      });}


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
    if(this.currentConnector.typeConnector==="connecteurCSV"){
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
    if(this.currentConnector.typeConnector==="connecteurJDBC"){
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
    this.connectorService.findByNameIgnoreCase(this.name)
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


