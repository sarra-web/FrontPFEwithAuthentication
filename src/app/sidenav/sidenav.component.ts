import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/User';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
interface SidenavToggle{
  screenWidth:number;
  collapsed:boolean;
}
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{
  showAdminBoard = false;
  isLoggedIn = false;
  private roles: string[] = [];
  showModeratorBoard = false;
  username?: string;
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  router: any;
  constructor(private storageService: StorageService, private authService: AuthService) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();

   }
  @HostListener('window:resize',['$event'])
  onResize(event:any){
    this.screenWidth=window.innerWidth;
    if(this.screenWidth<=768){
      this.collapsed=false;
      this.onToggleSideNav.emit({collapsed:this.collapsed,screenWidth:this.screenWidth});

    }
  }
  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();
        this.router.navigate(['/ex']);

        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
  ngOnInit(): void {
    this.screenWidth=window.innerWidth

  this.isLoggedIn = this.storageService.isLoggedIn();

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

  @Output() onToggleSideNav: EventEmitter<SidenavToggle> =new EventEmitter();

  collapsed=false;
  screenWidth=0;
  navData=navbarData
  toggleCollapse():void{
    this.collapsed=!this.collapsed;
    this.onToggleSideNav.emit({collapsed:this.collapsed,screenWidth:this.screenWidth});

  }
  closeSidenav():void{

    this.collapsed=false
    this.onToggleSideNav.emit({collapsed:this.collapsed,screenWidth:this.screenWidth});


  }

}
function ngOnDestroy() {
  throw new Error('Function not implemented.');
}

