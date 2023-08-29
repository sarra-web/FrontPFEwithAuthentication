import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardAdminComponent } from './board-admin/board-admin/board-admin.component';
import { ProjectsListComponent } from './board-admin/projects/projects-list/projects-list.component';
import { ProjectDetailsComponent } from './board-admin/projects/project-details/project-details.component';
import { AddProjectComponent } from './board-admin/projects/add-project/add-project.component';
import { ProjectComponent } from './board-admin/projects/project/project.component';
import { UserManagementComponent } from './board-admin/user-management/user-management.component';
import { ConnectorsComponent } from './board-user/connectors/connectors.component';
import { FileUploadComponent } from './board-user/file-upload/file-upload/file-upload.component';
import { ConnectorDetailsComponent } from './board-user/connector-details/connector-details.component';
import { SquedulerComponent } from './board-user/Squedulers/squeduler/squeduler.component';
import { SchedulerListComponent } from './board-user/Squedulers/scheduler-list/scheduler-list.component';
import { SchedulerDetailsComponent } from './board-user/Squedulers/scheduler-details/scheduler-details.component';
import { AddSchedulerComponent } from './board-user/Squedulers/add-scheduler/add-scheduler.component';
import { LogComponent } from './board-admin/log/log.component';
import { JDBCconnectorComponent } from './board-user/jdbcconnector/jdbcconnector.component';
import { AddJDBCconnectorComponent } from './board-user/add-jdbcconnector/add-jdbcconnector.component';
import { UserDetailsComponent } from './board-admin/user-management/user-details/user-details.component';
import { ExampleComponent } from './example/example.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileDetailsComponent } from './profile/profile-details/profile-details.component';
import { ActionComponent } from './board-user/action/action.component';
import { ActionJDBCComponent } from './board-user/action-jdbc/action-jdbc.component';
import { AddXMLconnectorComponent } from './board-user/add-xmlconnector/add-xmlconnector.component';
import { XMLconnectorDetailComponent } from './board-user/xmlconnector-detail/xmlconnector-detail.component';
import { AddNoSQLconnectorComponent } from './board-user/add-no-sqlconnector/add-no-sqlconnector.component';
import { NoSQLconnectorComponent } from './board-user/no-sqlconnector/no-sqlconnector.component';


const routes: Routes = [
  {path:'',redirectTo:'ex',pathMatch:'full'},
  {path:'dashbord',component:DashboardComponent},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'mod', component: BoardModeratorComponent },
  { path: 'sched/:id', component: SchedulerDetailsComponent },

  { path: 'admin', component: BoardAdminComponent },
  { path: 'log', component: LogComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin/project', component: ProjectComponent },
  { path: 'ex', component: ExampleComponent }
  ,{ path: 'admin/project/projects', component: ProjectsListComponent },
  { path: 'projects/:id', component: ProjectDetailsComponent },
  { path: 'admin/project/addP', component: AddProjectComponent }
  ,{ path: 'admin/user', component: UserManagementComponent },
  { path: 'user/connectors', component: ConnectorsComponent },
  { path: 'upload', component: FileUploadComponent },
  { path: 'addjdbc', component: AddJDBCconnectorComponent },
  { path: 'addXML', component: AddXMLconnectorComponent },
  { path: 'addNoSQL', component: AddNoSQLconnectorComponent },

  { path: 'connectors/connectorXML/:id', component: XMLconnectorDetailComponent },
  { path: 'connectors/connectorNoSQL/:id', component: NoSQLconnectorComponent },

  { path: 'connectors/connectorCSV/:id', component: ConnectorDetailsComponent },
  { path: 'connectors/connectorJDBC/:id', component: JDBCconnectorComponent },
  { path: 'connectorsAction/connectorCSV/:id', component: ActionComponent },
  { path: 'connectorsAction/connectorJDBC/:id', component: ActionJDBCComponent },
  {path: 'squeduler/:id', component:SquedulerComponent},
  {path: 'squeduler/:id/squedulers', component:SchedulerListComponent},
  {path: 'squeduler/:id/squedulers/:id', component:SchedulerDetailsComponent},
  {path: 'squeduler/:id/AddS', component:AddSchedulerComponent},
  {path: 'user/:id', component:UserDetailsComponent}
  ,{path: 'profile/:id', component:ProfileDetailsComponent}

  //{ path: 'user/squeduler/:id', component: SquedulerComponent },





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
