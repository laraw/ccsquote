import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { TypeaheadModule } from  'ngx-type-ahead';
import { Util } from '../util';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AngularFireModule } from '@angular/fire';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { CentreDetailComponent } from '../centre-detail/centre-detail.component';
import { CentreQuoteComponent } from '../centre-quote/centre-quote.component';
import { ManageCentresComponent } from '../manage-centres/manage-centres.component';
import { RoomDetailComponent } from '../room-detail/room-detail.component';
import { QuotePortalComponent } from './quote-portal.component';
import { ContactService } from '../contact.service';
import { QuotePortalNavMenuComponent } from './quote-portal-nav-menu/quote-component-nav-menu.component';


@NgModule({
  declarations: [
    ManageCentresComponent,
    CentreDetailComponent,
    RoomDetailComponent,
    CentreQuoteComponent,
     QuotePortalNavMenuComponent,
    QuotePortalComponent
  ],
  imports: [
   
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule.forChild([
      { path: '', component: CentreQuoteComponent },
      { path: 'manage-centres', component: ManageCentresComponent },
      { path: 'centre-detail/:id', component: CentreDetailComponent },
      { path: 'room-detail/:id', component: RoomDetailComponent },
      { path: 'centre-quote', component: CentreQuoteComponent },
    ]),
  ],
  providers: [ 
    ContactService,
    Util,
    
 ],
 bootstrap: [QuotePortalComponent]
})


export class QuotePortalModule { }
