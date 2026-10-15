import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommandeService } from 'src/app/services/commande.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-menu-dette',
  templateUrl: './menu-dette.component.html',
  styleUrls: ['./menu-dette.component.scss']
})
export class MenuDetteComponent implements OnInit {

  constructor(public commandeService: CommandeService, public router: Router,
    public localStorageService: LocalStorageService,
    public parametreService: ParametreService,
    public userService: UserService) { }

  routeActive: any;

  ngOnInit() {
    this.getMaintenance();
    const currentRoute = this.router.url;
    this.routeActive = currentRoute;
  }

  getMaintenance() {
    this.parametreService.getSetting().subscribe((data) => {
      let response: any = data;
      localStorage.removeItem('setting');
      localStorage.setItem('setting', this.userService.encrypt(JSON.stringify(response.setting)));
    });
  }

  routeNotification() {
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
    this.router.navigate(['/notifications']);
  }

  routeDette() {
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
    this.router.navigate(['/dette']);
  }

}

