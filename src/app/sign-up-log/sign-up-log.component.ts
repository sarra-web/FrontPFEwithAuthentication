import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from './menu-items/menu-items';


@Component({
  selector: 'app-sign-up-log',
  templateUrl: './sign-up-log.component.html',
  styleUrls: ['./sign-up-log.component.css',"../css/styles.css"]
})

export class SignUpLogComponent implements OnInit, OnDestroy{
  mobileQuery: MediaQueryList;
 private _mobileQueryListener: () => void;
  data : Date = new Date();
  focus:any;
  focus1:any;
  form: any = {

    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
//

isLoggedIn = false;
showAdminBoard = false;
showModeratorBoard = false;
username?: string;
formLog: any = {
  username: null,
  password: null
};

isLoginFailed = false;
errorMessageLog = '';
roles: string[] = [];
  constructor(changeDetectorRef: ChangeDetectorRef,media: MediaMatcher, public menuItems: MenuItems,private storageService: StorageService,private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }

    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }


}


ngAfterViewInit() {}
ngOnDestroy(){
  this.mobileQuery.removeListener(this._mobileQueryListener);

    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
}

  onSubmit(): void {
    const { username, email, password } = this.form;

    this.authService.register(username, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
  //

  onSubmitLog(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.reloadPage();
      },
      error: err => {
        this.errorMessageLog = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }








}
