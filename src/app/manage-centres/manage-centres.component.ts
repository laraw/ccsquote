import { Component, OnInit } from '@angular/core';
import { Centre, CentreService } from '../core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-manage-centres',
  templateUrl: './manage-centres.component.html',
  styleUrls: ['./manage-centres.component.scss']
})
export class ManageCentresComponent implements OnInit {
  public localUser = JSON.parse(localStorage.getItem("user"));
  closeResult = '';
  centres: Centre[];
  showCentre: boolean = false;
  centreName: string;

  constructor(private toastrService: ToastrService,private centreService: CentreService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.centreService.listCentres(this.localUser.uid).subscribe(res => {
      this.centres = res;
      this.showCentre = this.centres.length > 0;
    })

  }

  save() {

    console.log(this.centreName);
    let centre =  {
      name: this.centreName,
      uid: this.localUser.uid

    }
    this.centreService.addCentre(centre).then(() => {
      this.toastrService.success("Centre added successfully.");
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


}
