import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Centre, Room } from '../core/models';
import { CentreService, RoomService } from '../core/services';

import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-centre-detail',
  templateUrl: './centre-detail.component.html',
  styleUrls:[ './centre-detail.component.css']

})
export class CentreDetailComponent implements OnInit {
  public localUser = JSON.parse(localStorage.getItem("user"));
  closeResult = '';
  rooms: Room[];
  showCentre: boolean = false;
  roomName: string;
  cid: string;



  constructor(private toastrService: ToastrService, private route: ActivatedRoute, private roomService: RoomService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getRooms();
  }

  save() {

    if(this.roomName == "" || this.roomName == undefined) {
      this.toastrService.error("You didn't entered a room name");
      return false;
    }
    else {
      let room =  {
        name: this.roomName,
        cid: this.cid
  
      }
      this.roomService.addRoom(room).then(() => {
        this.toastrService.success("Room added successfully.");
        this.modalService.dismissAll();
      }).catch(err => {
        this.toastrService.error("Something went wrong.");
      })
    }
    
    


  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
 

  getRooms(): void {
    this.cid = this.route.snapshot.paramMap.get('id');
    console.log(this.cid);
    this.roomService.listRooms(this.cid).subscribe(rooms =>  {
      this.rooms = rooms
      this.showCentre = this.rooms.length > 0;
    
    });
  }

  removeRoom(room: Room) {
    this.roomService.removeRoom(room);
  }



}


