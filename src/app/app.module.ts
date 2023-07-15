import { Component, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';

import { httpInterceptorProviders } from './_helpers/auth.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfigComponent } from './config/config.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpLogComponent } from './sign-up-log/sign-up-log.component';
import { UserManagementComponent } from './board-admin/user-management/user-management.component';
import { AddProjectComponent } from './board-admin/projects/add-project/add-project.component';
import { ProjectComponent } from './board-admin/projects/project/project.component';
import { ProjectDetailsComponent } from './board-admin/projects/project-details/project-details.component';
import { ProjectsListComponent } from './board-admin/projects/projects-list/projects-list.component';
import { ModalpopupComponent } from './board-admin/modalpopup/modalpopup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { BoardAdminModule } from './board-admin/board-admin.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ConnectorDetailsComponent } from './board-user/connector-details/connector-details.component';
import { ConnectorsComponent } from './board-user/connectors/connectors.component';
import { FileUploadComponent } from './board-user/file-upload/file-upload/file-upload.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
//import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddSchedulerComponent } from './board-user/Squedulers/add-scheduler/add-scheduler.component';
import { SchedulerDetailsComponent } from './board-user/Squedulers/scheduler-details/scheduler-details.component';
import { SchedulerListComponent } from './board-user/Squedulers/scheduler-list/scheduler-list.component';
import { SquedulerComponent } from './board-user/Squedulers/squeduler/squeduler.component';
import { PopapComponent } from './board-user/popap/popap/popap.component';
import { CommonModule } from '@angular/common';
import { JDBCconnectorComponent } from './board-user/jdbcconnector/jdbcconnector.component';
import { AddJDBCconnectorComponent } from './board-user/add-jdbcconnector/add-jdbcconnector.component';
import { LogComponent } from './board-admin/log/log.component';
import { MatIconModule } from '@angular/material/icon';
import { FilterPipe } from './board-admin/log/filter.pipe';

const materialModules = [
  MatCardModule,
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatListModule
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    ConfigComponent,
    SignUpLogComponent,
    UserManagementComponent,
   AddProjectComponent,
    ProjectComponent
    ,ProjectDetailsComponent,
    ProjectsListComponent
    ,ModalpopupComponent
    ,ConnectorDetailsComponent
    ,ConnectorsComponent
    ,FileUploadComponent,
    AddSchedulerComponent
    ,SchedulerDetailsComponent
    ,SchedulerListComponent
    ,SquedulerComponent,
    PopapComponent,
     JDBCconnectorComponent,
    AddJDBCconnectorComponent,
    LogComponent
    ,HomeComponent,FilterPipe

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule
    ,BrowserModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxPaginationModule,
    BoardAdminModule,
    MatFormFieldModule
    , MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatInputModule,
    ...materialModules,
    MatSelectModule,
    MatFormFieldModule,MatIconModule
    //,NgModule
    //,CommonModule

  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
