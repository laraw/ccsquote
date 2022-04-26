import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm= new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required])
  })
  constructor(public authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.SignIn (this.loginForm.value.email, this.loginForm.value.password);
    
  }
}
