import { Injectable } from "@angular/core";
import { SettingService } from "./core";

@Injectable({ providedIn: 'root' })



export class Util {
 
   
  //  lowIncomeThreshold: any;
  //  secondIncomeThreshold: any;
  //  thirdIncomeThreshold: any;
  //  fourthIncomeThreshold: any;
  //  upperIncomeThreshold: any;

    constructor(private settingService: SettingService) {

    }

    getCCSHours(activityhours: string) {
        

        if (activityhours == "more than 48 hours") {
           return 100;
        }
        else if (activityhours == "17 to 48 hours") {
          return 72;
        }
        else if (activityhours == "8 to 16 hours") {
          return 36;
        }

        return 0;
    
    }

    getCCSPercentage(income: number, year: string, settings: any, secondchildsubsidy: boolean = false) {

  
      console.log(settings);

      //  this.settingService.getSetting(year).snapshotChanges().subscribe(res => {
      //    console.log(res.payload.get("id"))
      //    this.lowIncomeThreshold = res.payload.get("lowIncomeThreshhold");
      //    this.secondIncomeThreshold = res.payload.get("secondIncomeThreshold");
      //    this.thirdIncomeThreshold = res.payload.get("thirdIncomeThreshold");
      //    this.fourthIncomeThreshold = res.payload.get("fourthIncomeThreshold");
      //    this.upperIncomeThreshold = res.payload.get("upperIncomeThreshold");

      //  }) 

      //  console.log(this.settings

        // var lowIncomeThreshold = 69390.00;
        // var secondIncomeThreshold = lowIncomeThreshold + 105000;
        // var thirdIncomeThreshold = lowIncomeThreshold + 184290;
        // var fourthIncomeThreshold = lowIncomeThreshold + 274290;
        // var upperIncomeThreshold = lowIncomeThreshold + 284290;






        /* Calculate CCS %  */
        var group = 6;
    
        if (income <= settings.lowIncomeThreshold) {
          group = 1;

        }
        else if (income <=  settings.secondIncomeThreshold) {
          group = 2;
        }
    
        else if (income <=  settings.thirdIncomeThreshold) {
          group = 3;
        }
    
        else if (income <=  settings.fourthIncomeThreshold) {
          group = 4;
        }
    
        else if (income <=  settings.upperIncomeThreshold) {
          group = 5;
        }
    
        console.log(group);
    
        var ccspercentage = 0.00;
    
        if (group == 1) {
          ccspercentage = 85.00
        }
    
        else if (group == 2) {
       
          ccspercentage = 85 - ((income - settings.lowIncomeThreshold) / 3000);
        }
    
        else if (group == 3) {
          ccspercentage = 50.00
        }
    
        else if (group == 4) {
          ccspercentage = 50 - ((income - settings.thirdIncomeThreshold) / 3000);
        }
    
        else if (group == 5) {
          ccspercentage = 20.00
        }

        if(secondchildsubsidy) {
          if((95.00 - ccspercentage) > 30) {
            console.log(ccspercentage)
            return (ccspercentage + 30).toFixed(2);
          }
          else {
            return (95).toFixed(2);
          }
        } else {
          return ccspercentage.toFixed(2);
        }

        

    
    }
}