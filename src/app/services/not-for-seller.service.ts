
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { UserService } from './user.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class NotForSellerService implements CanActivate {

  constructor(private router: Router, private userService: UserService, private tokenService: TokenService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {

    //alert("Il faut d'abord se conncter !");
    this.router.navigate(["acceuil"], { queryParams: { retUrl: route.url } });
    return false;
  }

}