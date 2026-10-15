import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommandeService } from 'src/app/services/commande.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-menu-vente',
  templateUrl: './menu-vente.component.html',
  styleUrls: ['./menu-vente.component.scss']
})
export class MenuVenteComponent implements OnInit {

  constructor(public commandeService: CommandeService, public router: Router,
    public localStorageService: LocalStorageService,
    public parametreService: ParametreService,
    public userService: UserService) { }

  routeActive: any;
  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

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

  routeVente() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment', 'setting'];

    this.getMaintenance();

    // Lecture des paramètres
    const data = localStorage.getItem('setting');
    if (data) {
      try {
        const setting = JSON.parse(this.userService.decrypt(data));
        const maintenance = setting.maintenance;

        if (maintenance === 'active') {
          // Redirige vers maintenance si actif
          this.router.navigate(['/maintenance']);
          return;
        }
      } catch (error) {
        console.error('Erreur de parsing ou décryptage du setting', error);
      }
    }

    // Si pas en maintenance, on continue
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/vente']);
  }

  routeTicket() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment', 'setting'];

    this.getMaintenance();

    // Lecture des paramètres
    const data = localStorage.getItem('setting');
    if (data) {
      try {
        const setting = JSON.parse(this.userService.decrypt(data));
        const maintenance = setting.maintenance;

        if (maintenance === 'active') {
          // Redirige vers maintenance si actif
          this.router.navigate(['/maintenance']);
          return;
        }
      } catch (error) {
        console.error('Erreur de parsing ou décryptage du setting', error);
      }
    }

    // Si pas en maintenance, on continue
    this.localStorageService.clearLocalStorage(exceptions);
    this.commandeService.getCommandesDay();
    this.router.navigate(['/ticket']);
  }

  routeDevis() {
    this.localStorageService.rootDevis();
    this.router.navigate(['/devis']);
  }

  routeBon() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment', 'setting'];

    this.getMaintenance();

    // Lecture des paramètres
    const data = localStorage.getItem('setting');
    if (data) {
      try {
        const setting = JSON.parse(this.userService.decrypt(data));
        const maintenance = setting.maintenance;

        if (maintenance === 'active') {
          // Redirige vers maintenance si actif
          this.router.navigate(['/maintenance']);
          return;
        }
      } catch (error) {
        console.error('Erreur de parsing ou décryptage du setting', error);
      }
    }

    // Si pas en maintenance, on continue
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/bon']);
  }

  routeEncaissement() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment', 'setting'];

    this.getMaintenance();

    // Lecture des paramètres
    const data = localStorage.getItem('setting');
    if (data) {
      try {
        const setting = JSON.parse(this.userService.decrypt(data));
        const maintenance = setting.maintenance;

        if (maintenance === 'active') {
          // Redirige vers maintenance si actif
          this.router.navigate(['/maintenance']);
          return;
        }
      } catch (error) {
        console.error('Erreur de parsing ou décryptage du setting', error);
      }
    }

    // Si pas en maintenance, on continue
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/encaissement']);
  }

  routeNewBon() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment', 'setting'];

    this.getMaintenance();

    // Lecture des paramètres
    const data = localStorage.getItem('setting');
    if (data) {
      try {
        const setting = JSON.parse(this.userService.decrypt(data));
        const maintenance = setting.maintenance;

        if (maintenance === 'active') {
          // Redirige vers maintenance si actif
          this.router.navigate(['/maintenance']);
          return;
        }
      } catch (error) {
        console.error('Erreur de parsing ou décryptage du setting', error);
      }
    }

    // Si pas en maintenance, on continue
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/bon-nouveau']);
  }

}
