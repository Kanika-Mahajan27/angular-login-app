import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OtpComponent } from './components/otp/otp.component';
import { AuthguardService } from './guards/authguard.service';
import { RegisterComponent } from './components/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { ChatboxContainerComponent } from './components/chatbox-container/chatbox-container.component';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent,
    pathMatch:'full'
  },
  {
    path:"login",
    component:LoginComponent,
    pathMatch:'full'
  },
  {
    path:"otp",
    component:OtpComponent,
    canActivate:[AuthguardService]
  },
  {
    path:"home",
    component:HomeComponent,
    // canActivate:[AuthguardService]
  },
  {
    path:"register",
    component:RegisterComponent
  },
  {
    path:"welcome",
    component:WelcomeComponent
  },
  {
    path:'chatbox',
    component:ChatboxContainerComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
