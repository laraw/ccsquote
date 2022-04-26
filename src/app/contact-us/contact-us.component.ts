import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';  
import { ContactService } from '../contact.service'

@Component({
  selector: 'app-contactus',
  templateUrl: './contact-us.component.html',
})

export class ContactUsComponent implements OnInit {

  FormData = this.formBuilder.group({
    Fullname: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required]),
    Comment: new FormControl('', [Validators.required])
  });

  constructor(private formBuilder: FormBuilder, private contact: ContactService) { }
  ngOnInit(): void { }

  onSubmit(FormData:any) {
    console.log(FormData)
    this.contact.PostMessage(FormData)
      .subscribe(response => {
        location.href = 'https://mailthis.to/confirm'
        console.log(response)
      }, error => {
        console.warn(error.responseText)
        console.log({ error })
      })
  }


}
