import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EmbedourcalculatorComponent } from './embedourcalculator/embedourcalculator.component';
import { FaqsComponent } from './faqs/faqs.component';
import { AboutccsComponent } from './aboutccs/aboutccs.component';
import { ContactUsComponent } from './contact-us/contact-us.component'
import { ContactService } from './contact.service'
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { TypeaheadModule } from  'ngx-type-ahead';
import { Util } from './util';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CentreQuoteComponent } from './centre-quote/centre-quote.component';
import { AngularFireModule } from '@angular/fire';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ManageCentresComponent } from './manage-centres/manage-centres.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CentreDetailComponent } from './centre-detail/centre-detail.component';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { ManageSessionsComponent } from './manage-sessions/manage-sessions.component';
import { QuotePortalComponent } from './quote-portal/quote-portal.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

var config = environment.firebaseConfig;

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ContactUsComponent,
    EmbedourcalculatorComponent,
    FaqsComponent,
    AboutccsComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    

  ],
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    TypeaheadModule,
    
    AngularFireModule.initializeApp(config),
    RouterModule.forRoot([
      { path: '', data: { isLoginPage: true }, canActivate: [AuthGuard], component: HomeComponent, pathMatch: 'full' },
      { path: 'about-ccs', component: AboutccsComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'faqs', component: FaqsComponent },
      { path: 'embed-our-calculator', component: EmbedourcalculatorComponent },
      { path: 'home', data: { isLoginPage: true }, canActivate: [AuthGuard], component: HomeComponent },
      // { path: 'login',  data: { isLoginPage: true }, canActivate: [AuthGuard], component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'quote-portal',canActivate: [AuthGuard],  component: QuotePortalComponent,  loadChildren: () => import('./quote-portal/quote-portal.module').then(m => m.QuotePortalModule) }
    ]),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgbModule
  ],
  providers: [ 
     ContactService,
     Util,
     
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
