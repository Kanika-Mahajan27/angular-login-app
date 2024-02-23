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
import { LinkedinLoginComponent } from './components/linkedin-login/linkedin-login.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { ProfileSetupComponent } from './components/profile-setup/profile-setup.component';
import { incompleteProfileGuard } from './guards/incomplete-profile.guard';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { backGuard } from './guards/back.guard';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent,
    pathMatch:'full',
    canActivate : [backGuard]
  },
  {
    path:"login",
    component:LoginComponent,
    pathMatch:'full',
    canActivate : [backGuard]

  },
  {
    path:"otp",
    component:OtpComponent,
    canActivate:[AuthguardService]
  },
  {
    path:"home",
    component:HomeComponent,
    canActivate:[AuthguardService]
  },
  {
    path:"register",
    component:RegisterComponent,
    canActivate : [backGuard]

  },
  {
    path:"welcome",
    component:WelcomeComponent
  },
  {
    path:'chatbox',
    component:ChatboxContainerComponent
  },
  {
    path: 'linkedInLogin',
    component : LinkedinLoginComponent
  },
  {
    path:'post-details/:id',
    component : PostDetailsComponent
  },
  {
    path : 'setup',
    component : ProfileSetupComponent,
    canActivate : [incompleteProfileGuard]
  },
  {
    path : "user/:id",
    component : UserProfileComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
