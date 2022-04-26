import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { first, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  user: any;

  constructor(
    public authService: AuthService,
    public router: Router,

  ){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    console.log(this.authService.isSignedIn)

    

    if(next.data.isLoginPage) {
        if(this.authService.isLoggedIn) {
            this.router.navigate(['quote-portal/centre-quote']);
            return false;
        }
        else {
            return true;
        }
    }

    
   
    else if(this.authService.isLoggedIn !== true) {     
        console.log("Not logged in")
      
        this.router.navigate(['login']);
        return false;
    }



    return true;
  }
  
}
