
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { UserService } from './user.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(private router: Router, private userService: UserService, private tokenService: TokenService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {

    if (!this.userService.isUserLoggedIn() && localStorage.getItem("token") != "Bearer " + this.tokenService.getToken()) {
      //alert("Il faut d'abord se conncter !");
      this.router.navigate(["login"], { queryParams: { retUrl: route.url } });
      return false;
    }

    // Vérifie le mode maintenance
    const settingData = localStorage.getItem('setting');
    if (settingData) {
      try {
        const setting = JSON.parse(this.userService.decrypt(settingData));
        const maintenance = setting.maintenance;

        if (maintenance === 'active' && state.url !== '/parametre') {
          this.router.navigate(['/maintenance']);
          return false;
        }

      } catch (e) {
        console.error("Erreur lors du parsing des paramètres", e);
      }
    }

    return true;
  }

}