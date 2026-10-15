import { Component } from '@angular/core';
import { RolePermissonService } from '../../../services/role-permisson.service';
import { DateService } from '../../../services/date.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.css']

})
export class RolePermissionComponent {

  listeRolePermisson: any[] = [];  // Tableau pour stocker les role et permissons
  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public rolePermissonService: RolePermissonService, public router: Router,
    public dateService: DateService, public userService: UserService) { }

  ngOnInit(): void {
    this.loadRoleAndPermissons();
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

  // Méthode pour récupérer les role et permissons
  loadRoleAndPermissons(): void {
    this.rolePermissonService.index().subscribe(
      response => {
        let data: any = response;  // Correction de la syntaxe
        //console.log(data);
        this.listeRolePermisson = data;  // Stocker les role et permissons dans le tableau
      },
      (error) => {
        console.error('Erreur lors de la récupération des role et permissons:', error);
      }
    );
  }

  edit(role: any) {
    localStorage.removeItem('roleUpdate');
    localStorage.setItem('roleUpdate', this.userService.encrypt(JSON.stringify(role)));
    this.router.navigate(['/edit-role-permission']);
  }
}
