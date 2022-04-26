import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {


  resetForm= new FormGroup({
    email: new FormControl('', Validators.required)
  })
  constructor(public authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  reset(): void {
    this.authService.ForgotPassword(this.resetForm.value.email);
    
  }

}
