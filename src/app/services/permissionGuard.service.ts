import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
    firstRoleName: string | null = null;
    constructor(public userService: UserService, private router: Router) {
        this.userService.getUserLoggin();
        // Vérifier si les rôles existent dans l'utilisateur
        if (this.userService.user.roles && this.userService.user.roles.length > 0) {
            // Extraire le nom du premier rôle
            this.firstRoleName = this.userService.user.roles[0].name;
        }
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const requiredPermission = route.data['permission']; // On récupère la permission spécifiée dans la route
        //console.log(this.firstRoleName + requiredPermission)
        const hasPermission = this.userService.checkPermissionExistence(this.firstRoleName + requiredPermission);
        if (!hasPermission) {
            return false;
        }
        return true;
    }
}
