import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ToastrService } from 'ngx-toastr';
import { ParametreService } from 'src/app/services/parametre.service';
import { BonService } from 'src/app/services/bon.service';
import { LigneBonService } from 'src/app/services/ligne-bon.service';
import { CommandeService } from 'src/app/services/commande.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-detail-bon',
  templateUrl: './detail-bon.component.html',
  styleUrls: ['./detail-bon.component.scss']
})
export class DetailBonComponent implements OnInit {

  //keyboard buttons
  keyEnter: any = 13;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === this.keyEnter) {
      if (this.reduce == 0) {

      } else {
        this.keyEnter = null;
        this.onSubmitReduction();
      }
    }
  }

  // Disabled btn
  disableBtn: boolean = false;

  // Reduction
  formReduction!: FormGroup;
  reduce!: number;
  // Id Ligne bon
  id_ligneBon!: number;
  id_Bon!: number;
  // Var Form bon
  id!: number;
  date_bon!: string;
  heure_bon!: string;
  valid!: boolean;
  etat!: boolean;
  totht!: number;
  reduction!: number;
  net!: number;
  tottva!: number;
  auteur!: number;
  id_client: any;
  nom_client: any;
  code_client: any;
  numero_client: any;
  email_client: any;
  totttc!: number;

  editeLigne!: boolean;
  bon: any;
  client: any;

  updateInfo = {
    phone: '',
    id: 0
  }

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public router: Router, public fb: FormBuilder, public ligneBonService: LigneBonService,
    public bonService: BonService, public userService: UserService,
    public toastrService: ToastrService, public parametreService: ParametreService,
    public commandeService: CommandeService) { }
  get fReduction() { return this.formReduction.controls }

  ngOnInit() {
    if (localStorage.getItem('bon') != null) {
      this.bon = JSON.parse(localStorage.getItem('bon')!);
      this.ligneBonService.listLigneBon = JSON.parse(localStorage.getItem('listLigneBonDetail')!);
      this.client = JSON.parse(localStorage.getItem('client')!);
      this.id = this.bon.id;
      this.date_bon = this.bon.date_bon;
      this.heure_bon = this.bon.heure_bon;
      this.valid = this.bon.valid;
      this.etat = this.bon.etat;
      this.totht = this.bon.totht;
      this.reduction = this.bon.reduction;
      this.net = this.bon.net;
      this.tottva = this.bon.tottva;
      this.auteur = this.userService.name;
      this.id_client = this.client.id;
      this.totttc = this.bon.totttc;
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

  modalDeleteLigneBon(id: number) {
    this.id_ligneBon = id;
  }

  openModalDeleteBon(id: number) {
    this.id_Bon = id;
  }

  openModalCancelBon(id: number) {
    this.id_Bon = id;
  }

  deleteLigneBon() {
    this.ligneBonService.delete(this.id_ligneBon).subscribe((data) => {
      let response: any = data;

      localStorage.removeItem('bon');
      localStorage.removeItem('listLigneBonDetail');
      localStorage.setItem('bon', JSON.stringify(response.bon));
      localStorage.setItem('listLigneBonDetail', JSON.stringify(response.ligneBons));
      this.bon = JSON.parse(localStorage.getItem('bon')!);
      this.ligneBonService.listLigneBon = JSON.parse(localStorage.getItem('listLigneBonDetail')!);
      this.client = JSON.parse(localStorage.getItem('client')!);
      this.id = this.bon.id;
      this.date_bon = this.bon.date_bon;
      this.heure_bon = this.bon.heure_bon;
      this.valid = this.bon.valid;
      this.etat = this.bon.etat;
      this.totht = this.bon.totht;
      this.reduction = this.bon.reduction;
      this.net = this.bon.net;
      this.tottva = this.bon.tottva;
      this.auteur = this.userService.name;
      this.id_client = this.client.id;
      this.totttc = this.bon.totttc;

    });
  }

  deleteBon() {
    this.bonService.delete(this.id_Bon).subscribe((data) => {
      localStorage.removeItem('client');
      localStorage.removeItem('bon');
      localStorage.removeItem('utilisateur');
      localStorage.removeItem('listReglement');
      localStorage.removeItem('listLigneBonDetail');
      this.toastrService.warning('bon supprimé !');
      this.router.navigate(['/bon']);
    });
  }

  cancelBon() {
    this.bonService.cancel(this.id_Bon).subscribe((data) => {
      localStorage.removeItem('client');
      localStorage.removeItem('bon');
      localStorage.removeItem('utilisateur');
      localStorage.removeItem('listReglement');
      localStorage.removeItem('listLigneBonDetail');
      this.toastrService.warning('bon annulée !');
      this.router.navigate(['/bon']);
    });
  }

  alert() {
    this.reduce = 0;
    this.toastrService.error('La reduction ne doit pas être superieure au TTC');
  }

  InfoFormReduction() {
    this.formReduction = this.fb.group({
      bon: this.bon.id,
      reduction: this.reduce,
      auteur: this.userService.name,
    });
  }

  onSubmitReduction() {
    this.disableBtn = true;
    this.InfoFormReduction();
    this.bonService.reduction(this.formReduction.value).subscribe({
      next: data => {
        let response: any = data;
        this.toastrService.success('Réduction de ' + this.reduce + ' F CFA effectué !');
        this.reduce = 0;
        this.disableBtn = false;
        localStorage.removeItem('bon');
        localStorage.removeItem('listLigneBonDetail');
        localStorage.setItem('bon', JSON.stringify(response.bon));
        localStorage.setItem('listLigneBonDetail', JSON.stringify(response.lignebons));
        this.bon = JSON.parse(localStorage.getItem('bon')!);
        this.ligneBonService.listLigneBon = JSON.parse(localStorage.getItem('listLigneBonDetail')!);
        this.client = JSON.parse(localStorage.getItem('client')!);
        this.id = this.bon.id;
        this.date_bon = this.bon.date_bon;
        this.heure_bon = this.bon.heure_bon;
        this.valid = this.bon.valid;
        this.etat = this.bon.etat;
        this.totht = this.bon.totht;
        this.reduction = this.bon.reduction;
        this.net = this.bon.net;
        this.tottva = this.bon.tottva;
        this.auteur = this.userService.name;
        this.id_client = this.client.id;
        this.totttc = this.bon.totttc;
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  getSetting() {
    this.parametreService.getSetting().subscribe((data) => {
      localStorage.setItem('setting', JSON.stringify(data));
    });
  }

  editBon(bon: any) {
    this.bonService.edit(bon);
  }

  sendFactureWhatsApp(bon: any) {
    this.bonService.sendFactureWhatsApp(bon.numero).subscribe((response: any) => {
      if (response.whatsapp_link) {
        window.open(response.whatsapp_link, "_blank");
      } else {
        this.toastrService.warning("Impossible d'envoyer la facture sur WhatsApp");
      }
    }, error => {
      console.error("Erreur lors de l'envoi de la facture :", error);
    });
  }

  onSubmitUpdatePhone() {
    if (this.bon.code_client == "0") {
      this.toastrService.warning("Impossible de faire la mise à jour car ce client n'existe pas");
    } else {
      this.updateInfo.id = this.bon.id;
      this.bonService.updateInfo(this.updateInfo).subscribe({
        next: (data: any) => {
          let resp: any = data;
          this.updateInfo.phone = '';
          this.updateInfo.id = 0;
          this.toastrService.success('Numéro client mis à jour !');
          if (resp.bon.numero_client) {
            this.sendFactureWhatsApp(resp.bon);
          }
        },
        error: (err: { error: { message: any; }; }) => {
          console.log(err.error.message);
        }
      });
    }
  }

  printBon(bon: any) {
    this.commandeService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.qg-avenir.iconestock.com/server/public/print/bon/numero/' + bon.numero, "_blank");
    });
  }

}
