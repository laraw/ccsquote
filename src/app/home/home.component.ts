import { Component, OnInit, OnDestroy, Input, Output } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Util } from "../util";
import { SettingService } from "../core";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  subscriptions: Subscription[] = [];
  loggedIn = false;
  isIframe = false;
  //public centres: Centre[];
  activityhrs!: string;
  income!: number;
  ccs!: string;
  ccshrs!: number;
  formData!: FormData;
  discount!: number;
  week1fee!: string;
  week1ccs!: string;
  week1gap!: string;
  week2fee!: string;
  week2ccs!: string;
  week2gap!: string;
  showfinalquote!: boolean;
  selectedSessions: Array<{ dayId: number, session: number, fee: number }> = Array();
  selectedFees: Array<{ dayId: number, fee: number }> = Array();
  ccsEntered!: boolean;
  sessionsEntered!: boolean;
  schoolAged!: boolean;
  showWeek2!: boolean;
  selectedYear: string = "2020/2021";
  settings: any;
  secondchildsubsidy: boolean = false;

  quoteForm = this.formBuilder.group({
    Fee1: '',
    Fee2: '',
    Fee3: '',
    Fee4: '',
    Fee5: '',
    Fee6: '',
    Fee7: '',
    Fee8: '',
    Fee9: '',
    Fee10: '',
    Session1: '',
    Session2: '',
    Session3: '',
    Session4: '',
    Session5: '',
    Session6: '',
    Session7: '',
    Session8: '',
    Session9: '',
    Session10: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    private util: Util,
    private settingService: SettingService
  
  ) { }
  ngOnInit(): void { 
    
    this.ccsEntered = false; 
    
    this.sessionsEntered = false; 
    
    showWeek2: false; 

    let today = new Date();
    console.log(today.getMonth());
    this.selectedYear = "2021/2022"
    // if(today.getFullYear() == 2021) {
    //   if(today.getMonth() >= 6) {
    //     this.selectedYear = "2021/2022"
        
    //   }
    //   else {

    //     this.selectedYear = "2020/2021"
    //   }
      
    // }

    this.getSettings();
  
  }

  getSettings() {
  
   
    this.reset();
    this.settingService.getSetting(this.selectedYear).subscribe(res => {
       
      this.settings = res;


    })
  }

  onSubmit(): void {
    

  }

  print() {
    window.print();
    }

  reset(): void {
    this.ccs = "";
    this.ccshrs = null;
    this.income = null;
    this.activityhrs = "";
    this.quoteForm.reset();
    this.week1fee = "";
    this.week1ccs = "";
    this.week1gap = "";
    this.week2fee = "";
    this.week2ccs = "";
    this.week2gap = "";
    this.secondchildsubsidy = false;
  }



  numberweeks(option:any) {
    if (option == 'fortnight') {
      this.showWeek2 = true;
    }
    else {
      this. showWeek2 = false;
    }
  }

  ccsValid(event:any) {
    let value = parseFloat(event.target.value);
    if (value > 0) {
      this.ccsEntered = true;
    }
    console.log(this.ccsEntered);
    
  }

  setActivityHours(event:any) {

    this.activityhrs = event.target.value;
    this.ccshrs = this.util.getCCSHours(this.activityhrs);
    this.ccsEntered = true;
    
  }

  setCCSPercentage(event:any) {


    this.ccs = this.util.getCCSPercentage(this.income, this.selectedYear, this.settings, this.secondchildsubsidy);
    
  }
  calculateEntitlement() {

    this.ccsEntered = true;
    /* Declare variables */
    var lowIncomeThreshold = 69390.00;
    var secondIncomeThreshold = lowIncomeThreshold + 105000;
    var thirdIncomeThreshold = lowIncomeThreshold + 184290;
    var fourthIncomeThreshold = lowIncomeThreshold + 274290;
    var upperIncomeThreshold = lowIncomeThreshold + 284290;
    var income = this.income;
    var activityhrs = this.activityhrs;

    /* Calculate CCS %  */
    var group = 6;

    if (income <= lowIncomeThreshold) {
      group = 1;
    }
    else if (income <= secondIncomeThreshold) {
      group = 2;
    }

    else if (income <= thirdIncomeThreshold) {
      group = 3;
    }

    else if (income <= fourthIncomeThreshold) {
      group = 4;
    }

    else if (income <= upperIncomeThreshold) {
      group = 5;
    }



    var ccspercentage = 0.00;

    if (group == 1) {
      ccspercentage = 85.00
    }

    else if (group == 2) {
      ccspercentage = 85 - ((income - lowIncomeThreshold) / 3000);
    }

    else if (group == 3) {
      ccspercentage = 50.00
    }

    else if (group == 4) {
      ccspercentage = 50 - ((income - thirdIncomeThreshold) / 3000);
    }

    else if (group == 5) {
      ccspercentage = 20.00
    }


    /* Calculate CCS Hrs */

    var hrs = 0;

    if (activityhrs == "more than 48 hours") {
      hrs = 100;
    }
    else if (activityhrs == "17 to 48 hours") {
      hrs = 72;
    }
    else if (activityhrs == "8 to 16 hours") {
      hrs = 36;
    }

    this.ccshrs = hrs;
    this.ccs = ccspercentage.toFixed(2);
  }



  calculateCCS() {
    var isSchoolAged = this.schoolAged;
    this.selectedSessions = this.selectedSessions.sort((a, b) => (a.dayId > b.dayId) ? 1 : -1);
    let ccshourlyRateCap = this.settings.hourlyRateCapNonSchool;

    if (isSchoolAged) {
    
      ccshourlyRateCap = this.settings.hourlyRateCapSchool;
    }
    //this.week1fee = 1000;
    let remaininghrs = this.ccshrs;
    let ccspercentage = parseFloat(this.ccs) / 100;

    let week1fee = 0.00;
    let week2fee = 0.00;

    let week1ccseligiblefee = 0.00;
    let week2ccseligiblefee = 0.00;



    //var eligiblehrs = this.ccshrs;
    //var ccspercentage = this.ccs;

    //var discount = this.discount / 100;
    let week1sessions = this.selectedSessions.filter(function (el) { return el.dayId <= 5; });
    let week2sessions = this.selectedSessions.filter(function (el) { return el.dayId > 5; });

    if (!this.showWeek2) {
      week2sessions = week1sessions;
    }


    

    week1sessions.forEach(function (item) {

      var hourlyfee = 0.00;
      var fee = 0.00;
      var sessionhrs = 0.00;

      if (item.session && item.fee) {
        fee = item.fee;

        sessionhrs = item.session;

        week1fee += fee;
       

        if (remaininghrs > 0 && remaininghrs >= sessionhrs) {
          hourlyfee = (fee / sessionhrs);

          if (hourlyfee < ccshourlyRateCap) {
            week1ccseligiblefee += (hourlyfee * sessionhrs);

          }
          else {
            week1ccseligiblefee += (ccshourlyRateCap * sessionhrs);

          }

          remaininghrs = remaininghrs - item.session;
        }

        else if (remaininghrs > 0 && remaininghrs < sessionhrs) {
          hourlyfee = (fee / sessionhrs);
          if (hourlyfee < ccshourlyRateCap) {
            week1ccseligiblefee += (hourlyfee * remaininghrs);

          }
          else {
            week1ccseligiblefee += (ccshourlyRateCap * remaininghrs);
  
          }

          
          remaininghrs = remaininghrs - sessionhrs;
        }

      }
    })

    week2sessions.forEach(function (item) {

      var hourlyfee = 0.00;
      var fee = 0.00;
      var sessionhrs = 0.00;

      if (item.session && item.fee) {
        fee = item.fee;

        sessionhrs = item.session;

        week2fee += fee;


        if (remaininghrs > 0 && remaininghrs >= sessionhrs) {
          hourlyfee = (fee / sessionhrs);

          if (hourlyfee < ccshourlyRateCap) {
            week2ccseligiblefee += (hourlyfee * sessionhrs);
          }
          else {
            week2ccseligiblefee += (ccshourlyRateCap * sessionhrs);
          }

          remaininghrs = remaininghrs - item.session;
        }

        else if (remaininghrs > 0 && remaininghrs < sessionhrs) {
          hourlyfee = (fee / sessionhrs);
          if (hourlyfee < ccshourlyRateCap) {
            week2ccseligiblefee += (hourlyfee * remaininghrs);
          }
          else {
            week2ccseligiblefee += (ccshourlyRateCap * remaininghrs);
          }


          remaininghrs = remaininghrs - sessionhrs;
        }

      }
    })


    if (!isNaN(this.discount) && this.discount > 0) {
      week1ccseligiblefee = week1ccseligiblefee - (week1ccseligiblefee * (this.discount / 100));
      week2ccseligiblefee = week2ccseligiblefee - (week2ccseligiblefee * (this.discount / 100));
      week1fee = week1fee - (week1fee * (this.discount / 100));
      week2fee = week2fee - (week2fee * (this.discount / 100));
    }

 
    var week1CCS = (week1ccseligiblefee * ccspercentage);

    var week1CCS = week1CCS - (week1CCS * 0.05);

    var totalGap = (week1fee - week1CCS);
    this.week1fee = "$" + week1fee.toFixed(2);
    this.week1ccs = "$" + week1CCS.toFixed(2);
    this.week1gap = "$" + totalGap.toFixed(2);


    var week2CCS = (week2ccseligiblefee * ccspercentage);
    var week2CCS = week2CCS - (week2CCS * 0.05);
    totalGap = (week2fee - week2CCS);
    this.week2fee = "$" + week2fee.toFixed(2);
    this.week2ccs = "$" + week2CCS.toFixed(2);
    this.week2gap = "$" + totalGap.toFixed(2);

  }


  addSessions(event:any) {

    
    let day = parseInt(event.target.attributes.dayid.value);
    let session = parseFloat(event.target.value);

    let existing = this.selectedSessions.find(o => o.dayId === day);

    if (existing) {
      let index = this.selectedSessions.indexOf(existing);
      this.selectedSessions[index].session = session;
    }
    else {
      var item = { dayId: day, session: session, fee: 0 };
      this.selectedSessions.push(item);
      this.sessionsEntered = true;
    }

  }

  addFee(event:any) {
    let day = parseInt(event.target.attributes.dayid.value);
    let fee = parseFloat(event.target.value);

    let existing = this.selectedSessions.find(o => o.dayId === day);

    if (existing) {
      let index = this.selectedSessions.indexOf(existing);
      this.selectedSessions[index].fee = fee;
    }
    else {
      var item = { dayId: day, session: 0, fee: fee };
      this.selectedSessions.push(item);
      this.sessionsEntered = true;
    }


  }


}
