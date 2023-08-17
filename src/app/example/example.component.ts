import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { AdminInfo, adminlogin } from '../model/administrateur.model';
import { first } from 'rxjs/operators';
import { AlertService } from '../_services/alert.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models';
//import { JwtHelperService } from '../model/jwthelper.service';


@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  form!: FormGroup;
  isLoggedIn = false;
    loading = false;
    submitted = false;
  errorMessage = '';
  ville: any[] = [
    { name: 'Ariena' },
    { name: 'Béja' },
    { name: 'Ben Arous' },
    { name: 'Gabes' },
    { name: ' Gafsa' },
    { name: 'Jendouba' },
    { name: 'kairouan' },

    { name: 'Kasserine' },
    { name: 'Kebili' },
    { name: 'La Manouba' },
    { name: 'Le Kef' },
    { name: ' Mahdia' },
    { name: 'Médnine' },
    { name: 'Monastir' },

    { name: 'Nabeul' },
    { name: 'Sfax' },
    { name: 'Sidi Bouzid' },
    { name: 'Siliana' },
    { name: ' Sousse' },
    { name: 'Tataouine' },
    { name: 'Tozer' },
    { name: 'Tunis' },
    { name: 'Zaghouan' }


  ]
  showAdminBoard= false;
  showModeratorBoard = false;
  username:any;
  password:any;
  private roles: string[] = [];
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  constructor( private storageService: StorageService, private authService: AuthService,private accountService: AuthService,private formBuilder: FormBuilder,
    private route: ActivatedRoute, private alertService: AlertService

   , private router : Router,private serviceAuth: AuthService,serviceStor:StorageService) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
   }
    get f() { return this.form.controls; }
    ngOnInit(): void {


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

    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });

    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
        password: ['', Validators.required]
    });  }
  hide = true;
  admininfo: AdminInfo;
  active:boolean;
  messages:string;
  loginUserData: adminlogin;
  loginForm: FormGroup;
  isLoginFailed = false;
  //helper = new JwtHelperService();
  typeuser:string;
  token:string;

  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit


    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.accountService.login(this.username,this.password)
        .pipe(first())
        .subscribe({
            next: () => {
                // get return url from query parameters or default to home page
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                this.router.navigateByUrl(returnUrl);
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
}

  TestLogin() {/*
    this.loginUserData = new adminlogin(
this.loginForm.get('email').value,
this.loginForm.get('password').value
    );

    this.service.signIn(this.loginUserData).subscribe(
      data => {
      this.admininfo=data.adminInfo;
      this.active=this.admininfo.active;
      if(this.active === true){
        const decodeToken = this.helper.decodeToken(data.token);
        this.typeuser = decodeToken.role;

        console.log(this.typeuser);
        if(this.typeuser === 'superadmin'){
          this.router.navigate(['/admin'])
        }else if(this.typeuser === 'admin'){
          this.router.navigate(['/admin'])
        }else if(this.typeuser === 'Responsable'){
          this.router.navigate(['/responsable'])
        }else if (this.typeuser === 'Chauffeur'){
           this.router.navigate(['/chauffeur'])
        }
      }else{
        this.messages="Votre Compte est Désactivé";
      }

      },
      error => {
        if(error.status === 401){
          this.messages= "L'adresse e-mail ou le mot de passe que vous avez entré n'est pas valide.";
        console.error('Error !!',error),
       // this.messages = error,
        console.log(this.messages)
        }
      }
    );*/

  }

}
