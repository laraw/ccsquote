import { Component, OnInit, OnDestroy, Input, Output } from "@angular/core";

@Component({
  selector: 'quote-portal-nav-menu',
  templateUrl: './quote-portal-nav-menu.component.html',
  styleUrls: ['./quote-portal-nav-menu.component.css']
})
export class QuotePortalNavMenuComponent implements OnInit {
  isExpanded = false;
  // availableCentres = [];
  // canChangeCentre: boolean = false;
  // toggleDropdownBox: boolean = false;
  // selectedCentre: Centre = {
  //   name: 'Test Centre',
  //   state: 'Qld',
  // };

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
