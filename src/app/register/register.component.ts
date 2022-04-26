import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  

  registerForm= new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.pattern('(?=.*[0-9a-zA-Z]).{6,}') ])
  })
  constructor(public authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  register(): void {
    this.authService.SignUp(this.registerForm.value.email, this.registerForm.value.password);
    
  }

}
