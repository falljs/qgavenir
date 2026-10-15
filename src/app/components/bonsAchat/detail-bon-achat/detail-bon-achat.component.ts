import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParametreService } from 'src/app/services/parametre.service';
import { LigneAchatService } from 'src/app/services/ligne-achat.service';
import { CommandeService } from 'src/app/services/commande.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { BonAchatService } from 'src/app/services/bon-achat.service';
import { AchatService } from 'src/app/services/achat.service';

@Component({
  selector: 'app-detail-bon-achat',
  templateUrl: './detail-bon-achat.component.html',
  styleUrls: ['./detail-bon-achat.component.scss']
})
export class DetailBonAchatComponent implements OnInit {

  formBonAchat!: FormGroup;
  // Disabled btn
  disableBtn: boolean = false;

  // Id Ligne achat
  id_ligneAchat!: number;
  id_bonAchat!: number;
  // Var Form achat
  id!: number;
  numero!: number;
  date_achat!: string;
  heure_achat!: string;
  totht!: number;
  reduction!: number;
  restant!: number;
  versement: any;
  net!: number;
  tottva!: number;
  auteur!: any;
  id_fn: any;
  nom_fn: any;
  code_fn: any;
  numero_fn: any;
  email_fn: any;
  totttc!: number;
  numCheck!: any;

  editeLigne!: boolean;
  achat: any;
  fournisseur: any;

  userName: string = '';
  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public router: Router, public ligneAchatService: LigneAchatService,
    public fb: FormBuilder, public toastrService: ToastrService, public achatService: AchatService,
    public userService: UserService, public commandeService: CommandeService,
    public parametreService: ParametreService, public bonAchatService: BonAchatService) { }

  ngOnInit() {
    if (localStorage.getItem('bonAchat') != null) {
      this.achat = JSON.parse(localStorage.getItem('bonAchat')!);
      this.ligneAchatService.listLigneBonAchat = JSON.parse(localStorage.getItem('listLigneBonAchatDetail')!);
      this.fournisseur = JSON.parse(localStorage.getItem('fournisseur')!);
      this.id = this.achat.id;
      this.numero = this.achat.numero;
      this.date_achat = this.achat.date_achat;
      this.heure_achat = this.achat.heure_achat;
      this.totht = this.achat.totht;
      this.reduction = this.achat.reduction;
      this.restant = this.achat.restant;
      this.versement = this.achat.versement;
      this.net = this.achat.net;
      this.tottva = this.achat.tottva;
      this.auteur = this.userService.name;
      this.id_fn = this.fournisseur.id;
      this.totttc = this.achat.totttc;
      this.numCheck = this.achat.numCheck;
      this.getSetting();
      this.refreshRoleAndPermissonsUser();
      // Vérifier si les rôles existent dans l'utilisateur
      if (this.userService.user.roles && this.userService.user.roles.length > 0) {
        // Extraire le nom du premier rôle
        this.firstRoleName = this.userService.user.roles[0].name;
      }
    }
  }

  refreshRoleAndPermissonsUser(): void {
    this.userService.refreshRoleAndPermissonsUser(this.userService.user.id).subscribe(data => {
      let resp: any = data;
      this.userService.user.permissions = resp.user.permissions;
      this.userService.setRoles(resp.user.roles);
    });
  }

  printAchat(achat: any) {
    this.commandeService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.qg-avenir.iconestock.com/server/public/print/bon/achat/numero/' + achat.numero, "_blank");
    });
  }

  modalDeleteLigneAchat(id: number) {
    this.id_ligneAchat = id;
  }

  openModalDeleteAchat(id: number) {
    this.id_bonAchat = id;
  }

  openModalCancelAchat(id: number) {
    this.id_bonAchat = id;
  }

  editAchat(achat: any) {
    this.bonAchatService.edit(achat);
  }

  convertBonAchat(id: number) {
    this.id_bonAchat = id;
  }

  InfoFormBonAchat() {
    this.formBonAchat = this.fb.group({
      id: this.id_bonAchat,
      auteur: this.userService.name,
    });
  }

  setBonAchatToAchat() {
    this.InfoFormBonAchat();
    this.bonAchatService.setBonAchatToAchat(this.formBonAchat.value).subscribe(
      data => {
        let resp: any = data;
        this.toastrService.success('Achat numero ' + resp.achat.numero + ' crée !');
        this.achatService.detail(resp.achat);
      });

  }

  deleteAchat() {
    this.bonAchatService.delete(this.id_bonAchat).subscribe((data: any) => {
      localStorage.removeItem('dossier');
      localStorage.removeItem('fournisseur');
      localStorage.removeItem('bonAchat');
      localStorage.removeItem('utilisateur');
      localStorage.removeItem('listLigneBonAchatDetail');
      this.router.navigate(['/bon-achat']);
    });
  }

  getSetting() {
    this.parametreService.getSetting().subscribe((data: any) => {
      localStorage.setItem('setting', JSON.stringify(data));
    });
  }
}
