import { Centre, Room, Session } from '../core/models'
import { CentreService, RoomService, SettingService } from "../core/services"
import { Component, OnInit, OnDestroy, Input, Output } from "@angular/core";
import { FormBuilder, FormControl } from '@angular/forms';
import { Util } from "../util";


@Component({
  selector: 'app-centre-quote',
  templateUrl: './centre-quote.component.html',
  styleUrls: ['./centre-quote.component.css']
  
})


export class CentreQuoteComponent implements OnInit {
  selectedCentre: string;
  selectedRoom: Room;
  rooms: Room[];
  sessions: Session[];
  centres: Centre[];
  income: number;
  ccs: string;
  ccshrs: number;
  formData: FormData;
  discount: number;
  week1fee: string;
  week1ccs: string;
  week1gap: string;
  week2fee: string;
  week2ccs: string;
  week2gap: string;
  showfinalquote: boolean;
  selectedSessions: Array<{ dayId: number, session: number, fee: number }> = Array();
  selectedFees: Array<{ dayId: number, fee: number }> = Array();
  ccsEntered: boolean;
  sessionsEntered: boolean;
  schoolAged: boolean;
  showWeek2: boolean;
  activityhrs!: string;
  showIncomeActivity: boolean = false;
  public localUser = JSON.parse(localStorage.getItem("user"));
  hasCentres: boolean = false;
  selectedYear: string = "2020/2021";
  settings: any;

  quoteForm = this.formBuilder.group({
   
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


    ngOnInit() {
      let today = new Date();
      if(today.getFullYear() == 2021) {
        if(today.getMonth() == 6) {
          this.selectedYear = "2021/2022"
        }
        else {
          this.selectedYear = "2020/2021"
        }
        this.getSettings();
      }
    

        this.centreService.listCentres(this.localUser.uid).subscribe(res => {
            this.centres = res;
            this.hasCentres = this.centres.length > 0;
        })
        
        // if(!sessionStorage.getItem("selectedCentreId") && !sessionStorage.getItem("selectedCentreName")) {
        //     this.centreService.listCentres(this.localUser.uid).subscribe(centres => {
        //         this.selectedCentre = centres[0];
        //         sessionStorage.setItem("selectedCentreId", this.selectedCentre.id.toString());
        //         sessionStorage.setItem("selectedCentreName", this.selectedCentre.name);
        //         this.roomService.getRoomsByCentre(this.selectedCentre.id).subscribe(rooms => {
        //           this.rooms = rooms;
                  
        //       }
              
        //       );
    
      
        //      });
        // }
        // else {
         
        //     this.selectedCentre =  <Centre>({
        //         id: sessionStorage.getItem("selectedCentreId"),
        //         name: sessionStorage.getItem("selectedCentreName")
        //      });
        //      this.roomService.getRoomsByCentre(this.selectedCentre.id).subscribe(rooms => {
        //         this.rooms = rooms;

        //      });
            
        // }
    }
    constructor( private centreService: CentreService,
        private roomService: RoomService, 
        private formBuilder: FormBuilder,
        private util: Util,
        private settingService: SettingService
        ) {

    }


    
  getSettings() {
  
    console.log('test ')
    this.settingService.getSetting(this.selectedYear).subscribe(res => {
       
      this.settings = res;


    })
  }

    parseSessionStorageToInt(item: string | null) {
        if (item == null || item == "null"){
            return 0;
          } else {
            return parseInt(item);
          }
      }

    filterChanged(item: number) {
        // console.log(item);
        // var roomId = parseInt(item.toString());
        this.selectedRoom = this.rooms.find(obj => {
            return obj.id === item.toString();
          })
        // this.sessions = this.selectedRoom.sessions;
        this.roomService.listSessions(item).subscribe(res => {
          this.sessions = res;
        })

      }

      filterChangedCentre($event) {
       
       let centreId = $event.target.value;
       this.selectedCentre = $event.target.options[$event.target.selectedIndex].label;
       this.roomService.listRooms(centreId).subscribe(rooms => {
          this.rooms = rooms;
          

       });

      }

      setActivityHours(event:any) {

        this.activityhrs = event.target.value;
        this.ccshrs = this.util.getCCSHours(this.activityhrs);
        this.ccsEntered = true;
        
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
         
          var item = { dayId: day, session: session, fee: 0.00 };
          this.selectedSessions.push(item);
          this.sessionsEntered = true;

        }

    
      }

    onSubmit() {
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

       //var discount = this.discount / 100;
        let week1sessions = this.selectedSessions.filter(function (el) { return el.dayId <= 5; });
        let week2sessions = this.selectedSessions.filter(function (el) { return el.dayId > 5; });

        if (!this.showWeek2) {
        week2sessions = week1sessions;
        }

        

        week1sessions.forEach(function (item) {

            var hourlyfee = 0.00;
            var sessionhrs = 0.00;
    
            if (item.session) {
            let fee = this.getFeeForSession(week1sessions.length, item.session);
    
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
      }, this)
  
      week2sessions.forEach(function (item) {
  
        var hourlyfee = 0.00;
        var sessionhrs = 0.00;
  
        if (item.session) {
          let fee = this.getFeeForSession(week2sessions.length, item.session);
  
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
         }, this)
  
  
        if (!isNaN(this.discount) && this.discount > 0) {
            week1ccseligiblefee = week1ccseligiblefee - (week1ccseligiblefee * (this.discount / 100));
            week2ccseligiblefee = week2ccseligiblefee - (week2ccseligiblefee * (this.discount / 100));
            week1fee = week1fee - (week1fee * (this.discount / 100));
            week2fee = week2fee - (week2fee * (this.discount / 100));
        }
    
    
        var week1CCS = (week1ccseligiblefee * ccspercentage);
    
        var week1CCS = week1CCS - (week1CCS * 0.05);
    
        var totalGap = (week1fee - week1CCS);
        console.log(this.week1fee);
        this.week1fee = "$" + week1fee.toFixed(2);
        this.week1ccs = "$" + week1CCS.toFixed(2);
        this.week1gap = "$" + totalGap.toFixed(2);
    
    
        var week2CCS = (week2ccseligiblefee * ccspercentage);
        var week2CCS = week2CCS - (week2CCS * 0.05);
        totalGap = (week2fee - week2CCS);
        this.week2fee = "$" + week2fee.toFixed(2);
        this.week2ccs = "$" + week2CCS.toFixed(2);
        this.week2gap = "$" + totalGap.toFixed(2);
 
        // week1sessions.forEach(function(item, index) {
            
        //     let session = this.selectedRoom.sessions.find(obj => {
        //         return obj.length === item.session;
        //       })
        //       let fee = 0.00;
        //     switch(week1sessions.length) {
        //         case 1:
        //             console.log(session.fees[0].fee);
        //         case 2:
        //             fee = session.fees[1].fee;
        //         case 3:
        //             fee = session.fees[2].fee;
        //         case 4:
        //             fee = session.fees[3].fee;
        //         case 5:
        //             fee = session.fees[4].fee;
        //     }
            

        // }, this)
    }

    reset() {
        this.quoteForm.reset();
        this.week1fee = "";
        this.week1ccs = "";
        this.week1gap = "";
        this.week2fee = "";
        this.week2ccs = "";
        this.week2gap = "";
    }

    print() {
       window.print();
    }

    calculateEntitlement() {
        this.ccshrs = this.util.getCCSHours(this.activityhrs);
        this.ccs = this.util.getCCSPercentage(this.income, this.selectedYear, this.settings);
        
    }

    calculateCCS() {

    }
    ccsValid(event:any) {
        let value = parseFloat(event.target.value);
        if (value > 0) {
          this.ccsEntered = true;
        }
        console.log(this.ccsEntered);
        
      }
    numberweeks(option:any) {
        if (option == 'fortnight') {
          this.showWeek2 = true;
        }
        else {
          this. showWeek2 = false;
        }
      }

    getFeeForSession(sessioncnt: number, sessionlength: number) {
        let session = this.sessions.find(obj => {
                 return parseInt(obj.length) == sessionlength;
               })
               let fee = 0.00;
             switch(sessioncnt) {
                 case 1:
                     fee = parseFloat(session.fee1.toString());
                     break;
                 case 2:
                     fee = parseFloat(session.fee2.toString());
                     break;
                 case 3:
                     fee = parseFloat(session.fee3.toString());
                     break;
                 case 4:
                     fee = parseFloat(session.fee4.toString());
                     break;
                case 5:
                     fee = parseFloat(session.fee5.toString());
                     break;
         }

         return fee;
    }
}