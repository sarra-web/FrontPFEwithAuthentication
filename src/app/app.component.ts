import { Component,OnInit } from '@angular/core';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './model/User';
import { Router } from '@angular/router';
type Tabs = 'Sidebar' | 'Header' | 'Toolbar';
interface SidenavToggle{
  screenWidth:number;
  collapsed:boolean;

}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  isSideNavCollapsed=false;
  screenWidth=0;
  activeTab: Tabs = 'Sidebar';

  isExpanded = false;
  currentUser: any;

  navsideVisible:true;
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  hiden=false
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  selectedCity:any;
  cities:string[]=["sarra","rim","ahlem"];
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  constructor( private router: Router,private storageService: StorageService, private authService: AuthService) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();

   }

  ngOnInit(): void {

  this.isLoggedIn = this.storageService.isLoggedIn();
  if(!this.isLoggedIn){
this.hiden===true
  }

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
}
ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
}
setActiveTab(tab: Tabs) {
  this.activeTab = tab;
}
onToggleSideNav(data:SidenavToggle):void{
this.screenWidth=data.screenWidth;
this.isSideNavCollapsed=data.collapsed;

}

  logout2() {
    // Removes the jwt token from the local storage, so the user gets logged out & then navigate back to the "public" routes
   // localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
   // this.router.navigate(['../../']);
   localStorage.removeItem('user');
   this.userSubject.next(null);
   this.router.navigate(['/login']);
  }
  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();

        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
