import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/services/client.service';
import { DossierService } from 'src/app/services/dossier.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-dossier',
  templateUrl: './dossier.component.html',
  styleUrls: ['./dossier.component.scss']
})
export class DossierComponent implements OnInit {

  pageClt: number = 1;
  pageFn: number = 1;
  defaultItemClt: number = 12;
  defaultItemFn: number = 12;
  nbrDossierClt: number = 0;
  nbrDossierFn: number = 0;
  nbrPageClt: number = 0;
  nbrPageFn: number = 0;

  listDossierClient!: any[];
  listDossierFournisseur!: any[];

  totalNetFn: number = 0;
  totalVerserFn: number = 0;
  totalRestantFn: number = 0;

  totalNetClt: number = 0;
  totalVerserClt: number = 0;
  totalRestantClt: number = 0;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle
  isPane: boolean = false;

  constructor(public userService: UserService, public clientService: ClientService,
    public router: Router, public dossierService: DossierService,
    public toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getAllDossier();
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

  changePaneClt() {
    this.isPane = false;
    this.pageClt = 1;
    this.dossierService.getAll().subscribe((data) => {
      let resp: any = data;
      this.listDossierClient = resp.dossierClients;
      this.totalNetClt = resp.cmd_net;
      this.totalVerserClt = resp.cmd_verse;
      this.totalRestantClt = resp.cmd_reste;
      this.nbrDossierClt = this.listDossierClient.length;
      this.nbrPageClt = Math.ceil(this.nbrDossierClt / this.defaultItemClt);
    });
  }

  changePaneFn() {
    this.isPane = true;
    this.pageFn = 1;
    this.dossierService.getAll().subscribe((data) => {
      let resp: any = data;
      this.listDossierFournisseur = resp.dossierFournisseurs;
      this.totalNetFn = resp.achat_net;
      this.totalVerserFn = resp.achat_verse;
      this.totalRestantFn = resp.achat_reste;
      this.nbrDossierFn = this.listDossierFournisseur.length;
      this.nbrPageFn = Math.ceil(this.nbrDossierFn / this.defaultItemFn);
    });
  }

  getAllDossier() {
    this.dossierService.getAll().subscribe((data) => {
      let resp: any = data;
      this.listDossierClient = resp.dossierClients;
      this.totalNetClt = resp.cmd_net;
      this.totalVerserClt = resp.cmd_verse;
      this.totalRestantClt = resp.cmd_reste;
      this.nbrDossierClt = this.listDossierClient.length;
      this.nbrPageClt = Math.ceil(this.nbrDossierClt / this.defaultItemClt);
    });
  }

  searchClient() {
    this.pageClt = 1;
    let search: any = $("#inputSearchClt").val();
    if (search) {
      this.dossierService.searchDossier(search).subscribe(
        data => {
          let resp: any = data;
          this.listDossierClient = resp.dossierClients;
          //this.nbrDossierClt = this.listDossierClient.length;
        });
    } else {
      this.dossierService.getAll().subscribe((data) => {
        let resp: any = data;
        this.listDossierClient = resp.dossierClients;
        this.totalNetClt = resp.cmd_net;
        this.totalVerserClt = resp.cmd_verse;
        this.totalRestantClt = resp.cmd_reste;
        this.nbrDossierClt = this.listDossierClient.length;
        this.nbrPageClt = Math.ceil(this.nbrDossierClt / this.defaultItemClt);
      });
    }
  }

  searchFournisseur() {
    this.pageFn = 1;
    let search: any = $("#inputSearchFn").val();
    if (search) {
      this.dossierService.searchDossier(search).subscribe(
        data => {
          let resp: any = data;
          this.listDossierFournisseur = resp.dossierFournisseurs;
          //this.nbrDossierFn = this.listDossierFournisseur.length;
        });
    } else {
      this.dossierService.getAll().subscribe((data) => {
        let resp: any = data;
        this.listDossierFournisseur = resp.dossierFournisseurs;
        this.totalNetFn = resp.achat_net;
        this.totalVerserFn = resp.achat_verse;
        this.totalRestantFn = resp.achat_reste;
        this.nbrDossierFn = this.listDossierFournisseur.length;
        this.nbrPageFn = Math.ceil(this.nbrDossierFn / this.defaultItemFn);
      });
    }
  }

  getDossier(dossier: any) {
    localStorage.removeItem('dossier');
    localStorage.setItem('dossier', JSON.stringify(dossier));
    this.router.navigate(['/dossier-detail']);
  }

}
