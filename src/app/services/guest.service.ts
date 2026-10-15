import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { UserService } from './user.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class GuestService implements CanActivate {

  constructor(private router: Router, private userService: UserService, private tokenService: TokenService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean|UrlTree {

        if (localStorage.getItem("token") == "Bearer " + this.tokenService.getToken()) {
            //alert("Déconnectez-vous !");
            this.router.navigate(["accueil"]);
            return false;
        }
        return true;
    }

}