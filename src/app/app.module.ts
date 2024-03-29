import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { OtpComponent } from './components/otp/otp.component';
import { AuthguardService } from './guards/authguard.service';
import { RegisterComponent } from './components/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MessageComponent } from './components/message/message.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { ChatboxContainerComponent } from './components/chatbox-container/chatbox-container.component';
import { PrivateMessageComponent } from './components/private-message/private-message.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DatePipe } from '@angular/common';
import { LinkedinLoginComponent } from './components/linkedin-login/linkedin-login.component';
import { FeedComponent } from './components/feed/feed.component';
import { PostComponent } from './components/post/post.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { CarouselFeedComponent } from './components/carousel-feed/carousel-feed.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { ProfileSetupComponent } from './components/profile-setup/profile-setup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { NotificationComponent } from './components/notification/notification.component';
import { BackComponent } from './components/back/back.component';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { CommentFeedComponent } from './components/comment-feed/comment-feed.component';
import { CommentComponent } from './components/comment/comment.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TextInputComponent } from './components/text-input/text-input.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    OtpComponent,
    RegisterComponent,
    WelcomeComponent,
    ChatboxComponent,
    MessageComponent,
    PrivateMessageComponent,
    UserListComponent,
    ChatboxContainerComponent,
    LinkedinLoginComponent,
    FeedComponent,
    PostComponent,
    PostDetailsComponent,
    NotificationComponent,
    CarouselFeedComponent,
    CreatePostComponent,
    ProfileSetupComponent,
    UserProfileComponent,
    BackComponent,
    CommentFormComponent,
    CommentFeedComponent,
    CommentComponent,
    SidebarComponent,
    TextInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    PickerModule, 
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [LoginService, AuthguardService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
