import { Component, OnInit, OnDestroy, Input, Output } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../core/services/auth.service";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  loggedIn: Observable<boolean>;
  // availableCentres = [];
  // canChangeCentre: boolean = false;
  // toggleDropdownBox: boolean = false;
  // selectedCentre: Centre = {
  //   name: 'Test Centre',
  //   state: 'Qld',
  // };

  constructor(public authService: AuthService) {
    this.loggedIn = this.authService.isSignedIn();
  }

  collapse() {
    this.isExpanded = false;
    

  }

  ngOnInit() {
    
  }
  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  // onCentreChange(e:any) {

  // }

  // onChangeSearch(e:any) {

  // }

  toggleDropDownBox() {

  }
}

export interface Centre {
  name: string;
  state: string;

}
