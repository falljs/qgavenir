import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-menu-achat',
  templateUrl: './menu-achat.component.html',
  styleUrls: ['./menu-achat.component.scss']
})
export class MenuAchatComponent {

  routeActive: any;
  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public router: Router, public localStorageService: LocalStorageService,
    public parametreService: ParametreService, public userService: UserService) { }

  ngOnInit() {
    this.getMaintenance();
    const currentRoute = this.router.url;
    this.routeActive = currentRoute;
    this.refreshRoleAndPermissonsUser();
    // Vérifier si les rôles existent dans l'utilisateur
    if (this.userService.user.roles && this.userService.user.roles.length > 0) {
      // Extraire le nom du premier rôle
      this.firstRoleName = this.userService.user.roles[0].name;
    }
  }

  refreshRoleAndPermissonsUser(): void {
    this.userService.refreshRoleAndPermissonsUser(this.userService.user.id).subscribe(data => {
      let resp: any = data;
      this.userService.user.permissions = resp.user.permissions;
      this.userService.setRoles(resp.user.roles);
    });
  }

  getMaintenance() {
    this.parametreService.getSetting().subscribe((data) => {
      let response: any = data;
      localStorage.removeItem('setting');
      localStorage.setItem('setting', this.userService.encrypt(JSON.stringify(response.setting)));
    });
  }
}
