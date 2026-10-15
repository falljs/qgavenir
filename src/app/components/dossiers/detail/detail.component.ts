import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AchatService } from 'src/app/services/achat.service';
import { BonAchatService } from 'src/app/services/bon-achat.service';
import { BonService } from 'src/app/services/bon.service';
import { CommandeService } from 'src/app/services/commande.service';
import { DevisService } from 'src/app/services/devis.service';
import { DossierService } from 'src/app/services/dossier.service';
import { LigneReglementAchatService } from 'src/app/services/ligne-reglement-achat.service';
import { LigneReglementService } from 'src/app/services/ligne-reglement.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  formUpdate!: FormGroup;
  dossier!: any;
  client!: any;
  fournisseur!: any;
  msgError!: any;

  listComm!: any[];
  listBons!: any[];
  listDevis!: any[];

  listAchats!: any[];
  listBonAchats!: any[];

  nbrComm: number = 0;
  totalVente: number = 0;
  totalPayer: number = 0;
  totalRestant: number = 0;

  nbrDevis: number = 0;
  totalDevis: number = 0;

  nbrBon: number = 0;
  totalBon: number = 0;

  nbrAchat: number = 0;
  totalAchat: number = 0;
  totalPayerAchat: number = 0;
  totalRestantAchat: number = 0;

  nbrBonAchat: number = 0;
  totalBonAchat: number = 0;

  beneficeCom: number = 0;
  beneficeBon: number = 0;

  // Réglement
  formReglement!: FormGroup;
  formReglementAchat!: FormGroup;

  id_ligneReg!: number;
  verser!: number;
  monnaie: number = 0;
  disableBtn: boolean = false;
  isDossier: any = 'none';

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  phone: string = '';

  hasPhone = false;
  hasImpayes = false;

  constructor(public dossierService: DossierService, public userService: UserService,
    public router: Router, public localStorageService: LocalStorageService,
    public toastrService: ToastrService, public commandeService: CommandeService,
    public fb: FormBuilder, public reglementService: LigneReglementService,
    public bonService: BonService, public devisService: DevisService, public reglementAchatService: LigneReglementAchatService,
    public achatService: AchatService, public bonAchatService: BonAchatService) { }
  get fUpdate() { return this.formUpdate.controls }

  ngOnInit() {
    this.getDossier();
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

  getDossier() {
    if (localStorage.getItem('dossier') != null) {
      this.dossier = JSON.parse(localStorage.getItem('dossier')!);
      this.dossierService.getDossier(this.dossier.id).subscribe(
        data => {
          let response: any = data;
          if (response.client) {
            this.isDossier = 'client';
            this.listComm = response.cmd;
            this.listDevis = response.devis;
            this.listBons = response.bons;
            this.client = response.client;
            this.nbrComm = this.listComm?.length;
            this.nbrDevis = this.listDevis?.length;
            this.nbrBon = this.listBons?.length;
            this.totalVente = response.cmd_mt;
            this.totalDevis = response.devis_mt;
            this.totalBon = response.bon_mt;
            this.totalPayer = response.cmd_verse;
            this.totalRestant = response.cmd_reste;
            this.beneficeCom = response.cmd_bnf;
            this.beneficeBon = response.bon_bnf;
            this.phone = this.client.phone || '';
            this.hasPhone = this.phone.trim() != '';
            this.hasImpayes = this.listComm.some((c: any) => c.restant > 0);

          } else {
            this.isDossier = 'fournisseur';
            this.listAchats = response.achat;
            this.listBonAchats = response.bonAchat;

            this.fournisseur = response.fournisseur;

            this.nbrAchat = this.listAchats?.length;
            this.nbrBonAchat = this.listBonAchats?.length;

            this.totalAchat = response.achat_mt;
            this.totalBonAchat = response.bonAchat_mt;
            this.totalPayerAchat = response.achat_verse;
            this.totalRestantAchat = response.achat_reste;

            this.phone = this.fournisseur.phone || '';
            this.hasPhone = this.phone.trim() != '';
            this.hasImpayes = this.listAchats.some((a: any) => a.restant > 0);

          }
        });
    }
  }

  editCommande(commande: any) {
    this.commandeService.edit(commande);
  }

  editDevis(devis: any) {
    this.devisService.edit(devis);
  }

  editBon(bon: any) {
    this.bonService.edit(bon);
  }

  editAchat(achat: any) {
    this.achatService.edit(achat);
  }

  editBonAchat(achat: any) {
    this.bonAchatService.edit(achat);
  }

  detailCommande(commande: any) {
    this.commandeService.detail(commande);
  }

  detailDevis(devis: any) {
    this.devisService.detail(devis);
  }

  detailBon(bon: any) {
    this.bonService.detail(bon);
  }

  detailAchat(achat: any) {
    this.achatService.detail(achat);
  }

  detailBonAchat(achat: any) {
    this.bonAchatService.detail(achat);
  }

  routeDossier() {
    this.localStorageService.rootDossier();
    this.router.navigate(['/dossier']);
  }


  InfoFormReglement() {
    this.formReglement = this.fb.group({
      client: this.client.code,
      net: this.totalVente,
      verser: this.verser,
      restant: this.totalVente - this.totalPayer,
      auteur: this.userService.name,
    });
  }

  onSubmitReglement() {
    this.disableBtn = true;
    this.InfoFormReglement();
    this.reglementService.setCreatedClientReglement(this.formReglement.value).subscribe({
      next: data => {
        let response: any = data;
        this.toastrService.success('versement de ' + response.ligneReglement.avance + ' F CFA');
        this.verser = 0;
        this.disableBtn = false;
        this.getDossier();
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  InfoFormReglementAchat() {
    this.formReglementAchat = this.fb.group({
      fournisseur: this.fournisseur.code,
      net: this.totalAchat,
      verser: this.verser,
      restant: this.totalAchat - this.totalPayerAchat,
      auteur: this.userService.name,
    });
  }

  onSubmitReglementAchat() {
    this.disableBtn = true;
    this.InfoFormReglementAchat();
    this.reglementAchatService.setcreatedFournisseurReglement(this.formReglementAchat.value).subscribe({
      next: data => {
        let response: any = data;
        this.toastrService.success('versement de ' + response.ligneReglement.avance + ' F CFA');
        this.verser = 0;
        this.disableBtn = false;
        this.getDossier();
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  onVerser() {
    if (this.verser < (this.totalVente - this.totalPayer)) {
      this.monnaie = 0;
    } else {
      this.monnaie = this.verser - (this.totalVente - this.totalPayer);
    }
  }

  onVerserAchat() {
    if (this.verser < (this.totalAchat - this.totalPayerAchat)) {
      this.monnaie = 0;
    } else {
      this.monnaie = this.verser - (this.totalAchat - this.totalPayerAchat);
    }
  }

  sendWhatsapp() {

    this.dossierService.whatsappRappel(this.dossier.id)
      .subscribe({

        next: (response: any) => {

          if (!response.success) {

            this.toastrService.warning(response.message);
            return;

          }

          window.open(response.url, '_blank');

        },

        error: (err) => {

          console.error(err);

          this.toastrService.error("Impossible d'ouvrir WhatsApp.");

        }

      });

  }

  updatePhone() {

    if (!this.phone || this.phone.trim() === '') {

      this.toastrService.warning(
        'Veuillez saisir un numéro de téléphone.'
      );

      return;
    }

    const id = this.isDossier === 'client'
      ? this.client.id
      : this.fournisseur.id;

    this.dossierService
      .updatePhone(id, this.phone, this.isDossier)
      .subscribe({

        next: (response: any) => {

          if (!response.success) {

            this.toastrService.warning(
              response.message
            );

            return;
          }

          this.hasPhone = true;

          this.phone = response.phone;

          if (this.isDossier === 'client') {

            this.client.phone = response.phone;

          } else {

            this.fournisseur.phone = response.phone;

          }

          this.toastrService.success(
            response.message
          );

        },

        error: (err) => {

          console.error(err);

          if (err.status === 422) {

            this.toastrService.warning(
              err.error.message
            );

          } else if (err.status === 404) {

            this.toastrService.error(
              "Le client ou le fournisseur est introuvable."
            );

          } else if (err.status === 500) {

            this.toastrService.error(
              "Une erreur interne est survenue sur le serveur."
            );

          } else {

            this.toastrService.error(
              "Impossible d'enregistrer le numéro. Vérifiez votre connexion puis réessayez."
            );

          }

        }

      });

  }

}
