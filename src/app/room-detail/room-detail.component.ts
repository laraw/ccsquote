import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Room, Session } from '../core/models';
import { CentreService, RoomService } from '../core/services';

import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {

  closeResult = '';
  sessions: Session[];
  showCentre: boolean = false;
  sessionName: string;
  rid: string;
  fee1: number;
  fee2: number;
  fee3: number;
  fee4: number;
  fee5: number;
  length: number;

  sessionForm = this.formBuilder.group({
    sessionName: new FormControl('', [Validators.required]),
    fee1: new FormControl('', [Validators.required,  Validators.pattern("^[0-9].*$")]),
    fee2: new FormControl('', [Validators.required,  Validators.pattern("^[0-9].*$")]),
    fee3: new FormControl('', [Validators.required,  Validators.pattern("^[0-9].*$")]),
    fee4: new FormControl('', [Validators.required,  Validators.pattern("^[0-9].*$")]),
    fee5: new FormControl('', [Validators.required,  Validators.pattern("^[0-9].*$")]),
    length: new FormControl('', [Validators.required,  Validators.pattern("^[0-9]*$")])
  });


  constructor(private toastrService: ToastrService, private formBuilder: FormBuilder, private route: ActivatedRoute, private roomService: RoomService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getSessions();
  }

  onSubmit(): void {
    let session =  {
      name: this.sessionForm.value.sessionName,  
      rid: this.rid,
      length: this.sessionForm.value.length,
      fee1: this.sessionForm.value.fee1,
      fee2: this.sessionForm.value.fee2,
      fee3: this.sessionForm.value.fee3,
      fee4: this.sessionForm.value.fee4,
      fee5: this.sessionForm.value.fee5


    }
    this.roomService.addSession(session)
    .then(() => {
      this.toastrService.success("Session added successfully.");
      this.modalService.dismissAll();
    }).catch(err => {
      this.toastrService.error("Something went wrong.");
    })
  }

  save() {

    let session =  {
      name: this.sessionName,  
      rid: this.rid,
      length: this.length,
      fee1: this.fee1,
      fee2: this.fee2,
      fee3: this.fee3,
      fee4: this.fee4,
      fee5: this.fee5


    }
    this.roomService.addSession(session)
    .then(() => {
      this.toastrService.success("Session added successfully.");
      this.modalService.dismissAll();
    }).catch(err => {
      this.toastrService.error("Something went wrong.");
    })
    


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
 

  getSessions(): void {
    this.rid = this.route.snapshot.paramMap.get('id');
    console.log(this.rid)
    this.roomService.listSessions(this.rid).subscribe(sessions =>  {
      this.sessions = sessions
      this.showCentre = this.sessions.length > 0;
    
    });
  }

  removeSession(session: Session) {
    this.roomService.removeSession(session);
  }
}
