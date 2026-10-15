import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommandeService } from 'src/app/services/commande.service';
import { LigneCommandeService } from 'src/app/services/ligne-commande.service';
import { UserService } from 'src/app/services/user.service';
import { LigneCommande } from 'src/app/models/ligne-commande';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LigneReglementService } from 'src/app/services/ligne-reglement.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ToastrService } from 'ngx-toastr';
import { ParametreService } from 'src/app/services/parametre.service';
import { ClientService } from 'src/app/services/client.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-detail-commande',
  templateUrl: './detail-commande.component.html',
  styleUrls: ['./detail-commande.component.scss']
})
export class DetailCommandeComponent implements OnInit {

  //keyboard buttons
  keyEnter: any = 13;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === this.keyEnter) {
      if (this.verser == 0) {

      } else {
        this.keyEnter = null;
        this.onSubmitReglement();
      }
    }
  }

  // Disabled btn
  disableBtn: boolean = false;

  // Réglement
  formReglement!: FormGroup;
  verser!: number;
  monnaie: number = 0;
  wave: number = 0;

  // Remboursement
  formRemboursement!: FormGroup;
  mt_remboursement: number = 0;
  motif!: any;

  // Reduction
  formReduction!: FormGroup;
  reduce!: number;

  // Id Ligne Commande
  id_ligneCommande!: number;
  id_Commande!: number;

  // Id Ligne Rglement
  id_ligneReglement!: number;

  // Var Form Commande
  id!: number;
  numero!: number;
  date_comm!: string;
  heure_comm!: string;
  valid!: boolean;
  etat!: boolean;
  totht!: number;
  reduction!: number;
  restant!: number;
  versement: any;
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
  commande: any;
  client: any;

  page: number = 1;
  nbrComm: number = 0;
  defaultItem: number = 4;
  nbrPage: number = 0;
  listCommClt!: any[];

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  updateInfo = {
    phone: '221',
    id: 0
  }

  constructor(public router: Router, public fb: FormBuilder, public reglementService: LigneReglementService,
    public ligneCommandeService: LigneCommandeService, public commandeService: CommandeService,
    public userService: UserService, public ligneRegelementService: LigneReglementService,
    public toastrService: ToastrService, public parametreService: ParametreService,
    public clientService: ClientService,) { }

  get fReglement() { return this.formReglement.controls }
  get fReduction() { return this.formReduction.controls }
  get fRemboursement() { return this.formRemboursement.controls }

  ngOnInit() {
    if (localStorage.getItem('commande') != null) {
      this.commande = JSON.parse(localStorage.getItem('commande')!);
      this.ligneCommandeService.listLigneCommande = JSON.parse(localStorage.getItem('listLigneCommandeDetail')!);
      this.ligneRegelementService.listLigneReglement = JSON.parse(localStorage.getItem('listReglementDetail')!);
      this.client = JSON.parse(localStorage.getItem('client')!);
      this.id = this.commande.id;
      this.numero = this.commande.numero;
      this.date_comm = this.commande.date_comm;
      this.heure_comm = this.commande.heure_comm;
      this.valid = this.commande.valid;
      this.etat = this.commande.etat;
      this.totht = this.commande.totht;
      this.reduction = this.commande.reduction;
      this.restant = this.commande.restant;
      this.versement = this.commande.versement;
      this.net = this.commande.net;
      this.tottva = this.commande.tottva;
      this.auteur = this.userService.name;

      this.totttc = this.commande.totttc;
      this.getSetting();
      this.getCommClient();
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

  getCommClient() {
    this.clientService.getCommClient(this.client.code).subscribe(
      response => {
        this.listCommClt = response;
        this.nbrComm = this.listCommClt.length;
        this.nbrPage = Math.ceil(this.nbrComm / this.defaultItem);
      });
  }

  modalDeleteLigneReglement(id: number) {
    this.id_ligneReglement = id;
  }

  openModalDeleteCommande(id: number) {
    this.id_Commande = id;
  }

  openModalCancelCommande(id: number) {
    this.id_Commande = id;
  }

  deleteLigneReglement() {
    this.reglementService.delete(this.id_ligneReglement).subscribe((data) => {
      let response: any = data;

      localStorage.removeItem('commande')
      localStorage.removeItem('listLigneCommandeDetail')
      localStorage.removeItem('listReglementDetail')
      localStorage.setItem('commande', JSON.stringify(response.commande));
      localStorage.setItem('listLigneCommandeDetail', JSON.stringify(response.ligneCommandes));
      localStorage.setItem('listReglementDetail', JSON.stringify(response.ligneReglements));
      this.toastrService.warning('Ligne supprimée !');
      this.commande = JSON.parse(localStorage.getItem('commande')!);
      this.ligneCommandeService.listLigneCommande = JSON.parse(localStorage.getItem('listLigneCommandeDetail')!);
      this.ligneRegelementService.listLigneReglement = JSON.parse(localStorage.getItem('listReglementDetail')!);
      this.client = JSON.parse(localStorage.getItem('client')!);
      this.id = this.commande.id;
      this.date_comm = this.commande.date_comm;
      this.heure_comm = this.commande.heure_comm;
      this.valid = this.commande.valid;
      this.etat = this.commande.etat;
      this.totht = this.commande.totht;
      this.reduction = this.commande.reduction;
      this.restant = this.commande.restant;
      this.versement = this.commande.versement;
      this.net = this.commande.net;
      this.tottva = this.commande.tottva;
      this.auteur = this.userService.name;

      this.totttc = this.commande.totttc;

    });
  }

  deleteCommande() {
    this.commandeService.delete(this.id_Commande).subscribe((data) => {
      localStorage.removeItem('client');
      localStorage.removeItem('commande');
      localStorage.removeItem('utilisateur');
      localStorage.removeItem('listReglementDetail');
      localStorage.removeItem('listLigneCommandeDetail');
      this.toastrService.warning('Commande supprimée !');
      this.router.navigate(['/ticket']);
    });
  }

  cancelCommande() {
    this.commandeService.cancel(this.id_Commande).subscribe((data) => {
      localStorage.removeItem('client');
      localStorage.removeItem('commande');
      localStorage.removeItem('utilisateur');
      localStorage.removeItem('listReglementDetail');
      localStorage.removeItem('listLigneCommandeDetail');
      this.toastrService.warning('Commande annulée !');
      this.router.navigate(['/ticket']);
    });
  }

  alert() {
    this.reduce = 0;
    this.toastrService.error('La reduction ne doit pas être superieure au montant restant !');
  }


  onVerser() {
    if (this.verser < this.commande.net) { this.monnaie = 0; };
    if (this.verser > this.commande.restant) {
      this.monnaie = this.verser - this.commande.restant
    }
  }

  InfoFormReglement() {
    this.formReglement = this.fb.group({
      commande: this.commande.id,
      verser: this.verser,
      wave: Math.max(this.wave - this.monnaie, 0), // Évite les valeurs négatives
      auteur: this.userService.name,
    });
  }

  InfoRemboursement() {
    this.formRemboursement = this.fb.group({
      commande: this.commande.id,
      mt_remboursement: this.mt_remboursement,
      motif: this.motif,
      auteur: this.userService.name,
    });
  }

  onSubmitRemboursement() {
    this.disableBtn = true;
    this.InfoRemboursement();
    this.reglementService.remboursement(this.formRemboursement.value).subscribe({
      next: data => {
        let response: any = data;
        localStorage.removeItem('commande');
        localStorage.removeItem('listLigneCommandeDetail');
        localStorage.removeItem('listReglementDetail');
        localStorage.setItem('commande', JSON.stringify(response.commande));
        localStorage.setItem('listLigneCommandeDetail', JSON.stringify(response.ligneCommandes));
        localStorage.setItem('listReglementDetail', JSON.stringify(response.ligneReglements));
        this.toastrService.success(this.mt_remboursement + ' F CFA rembourser !');
        this.commande = JSON.parse(localStorage.getItem('commande')!);
        this.ligneCommandeService.listLigneCommande = JSON.parse(localStorage.getItem('listLigneCommandeDetail')!);
        this.ligneRegelementService.listLigneReglement = JSON.parse(localStorage.getItem('listReglementDetail')!);
        this.client = JSON.parse(localStorage.getItem('client')!);
        this.id = this.commande.id;
        this.date_comm = this.commande.date_comm;
        this.heure_comm = this.commande.heure_comm;
        this.valid = this.commande.valid;
        this.etat = this.commande.etat;
        this.totht = this.commande.totht;
        this.reduction = this.commande.reduction;
        this.restant = this.commande.restant;
        this.versement = this.commande.versement;
        this.net = this.commande.net;
        this.tottva = this.commande.tottva;
        this.auteur = this.userService.name;

        this.totttc = this.commande.totttc;
        this.verser = 0;
        this.disableBtn = false;
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  onSubmitReglement() {
    this.disableBtn = true;
    this.InfoFormReglement();
    this.reglementService.create(this.formReglement.value).subscribe({
      next: data => {
        let response: any = data;
        localStorage.removeItem('commande');
        localStorage.removeItem('listLigneCommandeDetail');
        localStorage.removeItem('listReglementDetail');
        localStorage.setItem('commande', JSON.stringify(response.commande));
        localStorage.setItem('listLigneCommandeDetail', JSON.stringify(response.ligneCommandes));
        localStorage.setItem('listReglementDetail', JSON.stringify(response.ligneReglements));
        this.toastrService.success(this.verser + ' F CFA versé !');
        this.commande = JSON.parse(localStorage.getItem('commande')!);
        this.ligneCommandeService.listLigneCommande = JSON.parse(localStorage.getItem('listLigneCommandeDetail')!);
        this.ligneRegelementService.listLigneReglement = JSON.parse(localStorage.getItem('listReglementDetail')!);
        this.client = JSON.parse(localStorage.getItem('client')!);
        this.id = this.commande.id;
        this.date_comm = this.commande.date_comm;
        this.heure_comm = this.commande.heure_comm;
        this.valid = this.commande.valid;
        this.etat = this.commande.etat;
        this.totht = this.commande.totht;
        this.reduction = this.commande.reduction;
        this.restant = this.commande.restant;
        this.versement = this.commande.versement;
        this.net = this.commande.net;
        this.tottva = this.commande.tottva;
        this.auteur = this.userService.name;

        this.totttc = this.commande.totttc;
        this.verser = 0;
        this.wave = 0;
        this.disableBtn = false;
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  InfoFormReduction() {
    this.formReduction = this.fb.group({
      commande: this.commande.id,
      reduction: this.reduce,
      auteur: this.userService.name,
    });
  }

  onSubmitReduction() {
    this.disableBtn = true;
    this.InfoFormReduction();
    this.commandeService.reduction(this.formReduction.value).subscribe({
      next: data => {
        let response: any = data;
        localStorage.removeItem('commande');
        localStorage.removeItem('listLigneCommandeDetail');
        localStorage.removeItem('listReglementdetail');
        localStorage.setItem('commande', JSON.stringify(response.commande));
        localStorage.setItem('listLigneCommandeDetail', JSON.stringify(response.ligneCommandes));
        localStorage.setItem('listReglementDetail', JSON.stringify(response.ligneReglements));
        this.toastrService.success('Réduction de ' + this.reduce + ' F CFA effectué !');
        this.commande = JSON.parse(localStorage.getItem('commande')!);
        this.ligneCommandeService.listLigneCommande = JSON.parse(localStorage.getItem('listLigneCommandeDetail')!);
        this.ligneRegelementService.listLigneReglement = JSON.parse(localStorage.getItem('listReglementDetail')!);
        this.client = JSON.parse(localStorage.getItem('client')!);
        this.id = this.commande.id;
        this.date_comm = this.commande.date_comm;
        this.heure_comm = this.commande.heure_comm;
        this.valid = this.commande.valid;
        this.etat = this.commande.etat;
        this.totht = this.commande.totht;
        this.reduction = this.commande.reduction;
        this.restant = this.commande.restant;
        this.versement = this.commande.versement;
        this.net = this.commande.net;
        this.tottva = this.commande.tottva;
        this.auteur = this.userService.name;

        this.totttc = this.commande.totttc;
        this.reduce = 0;
        this.disableBtn = false;
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

  editCommande(commande: any) {
    this.commandeService.edit(commande);
  }

  detail(commande: any) {
    this.commandeService.getCommande(commande.id).subscribe((data) => {
      let response: any = data;
      this.commandeService.commande = response.commande;
      localStorage.removeItem('commande')
      localStorage.removeItem('listLigneCommandeDetail')
      localStorage.removeItem('listReglementDetail')
      localStorage.setItem('commande', JSON.stringify(this.commandeService.commande));
      localStorage.setItem('listLigneCommandeDetail', JSON.stringify(response.ligneCommandes));
      localStorage.setItem('listReglementDetail', JSON.stringify(response.ligneReglements));

      this.commande = JSON.parse(localStorage.getItem('commande')!);
      this.ligneCommandeService.listLigneCommande = JSON.parse(localStorage.getItem('listLigneCommandeDetail')!);
      this.ligneRegelementService.listLigneReglement = JSON.parse(localStorage.getItem('listReglementDetail')!);
      this.id = this.commande.id;
      this.date_comm = this.commande.date_comm;
      this.heure_comm = this.commande.heure_comm;
      this.valid = this.commande.valid;
      this.etat = this.commande.etat;
      this.totht = this.commande.totht;
      this.reduction = this.commande.reduction;
      this.restant = this.commande.restant;
      this.versement = this.commande.versement;
      this.net = this.commande.net;
      this.tottva = this.commande.tottva;
      this.auteur = this.userService.name;

      this.totttc = this.commande.totttc;
    });
  }

  printFacture(commande: any) {
    this.commandeService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.qg-avenir.iconestock.com/server/public/print/facture/numero/' + commande.numero, "_blank");
    });
  }

  // Print Ticket
  printTicket(ticket: any) {
    localStorage.removeItem('ticket')
    localStorage.setItem('ticket', JSON.stringify(ticket));
    window.open('/#/print-ticket', "_blank");
  };

  printBordereau(commande: any) {
    this.commandeService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.qg-avenir.iconestock.com/server/public/print/bordereau/numero/' + commande.numero, "_blank");
    });
  }

  printReglement(commande: any) {
    this.commandeService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.qg-avenir.iconestock.com/server/public/print/facture/reglements/numero/' + commande.numero, "_blank");
    });
  }

  printOneReg(id: number) {
    this.commandeService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.qg-avenir.iconestock.com/server/public/print/facture/reglement/numero/' + id, "_blank");
    });
  }

  sendFactureWhatsApp(commande: any) {
    this.commandeService.sendFactureWhatsApp(commande.numero).subscribe((response: any) => {
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
    if (this.commande.code_client == "0") {
      this.toastrService.warning("Impossible de faire la mise à jour car ce client n'existe pas");
    } else {
      this.updateInfo.id = this.commande.id;
      this.commandeService.updateInfo(this.updateInfo).subscribe({
        next: (data: any) => {
          let resp: any = data;
          this.updateInfo.phone = '';
          this.updateInfo.id = 0;
          this.toastrService.success('Numéro client mis à jour !');
          this.detail(resp.commande);
          if (resp.commande.numero) {
            this.sendFactureWhatsApp(resp.commande);
          }
        },
        error: (err: { error: { message: any; }; }) => {
          console.log(err.error.message);
        }
      });
    }
  }


  /*printTicket() {
    window.open('/#/print-ticket', "_blank");
  };*/

}


