import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ToastrService } from 'ngx-toastr';
import { LigneDevisService } from 'src/app/services/ligne-devis.service';
import { DevisService } from 'src/app/services/devis.service';
import { LigneDevis } from 'src/app/models/ligne-devis';
import { DatePipe } from '@angular/common';
import { CommandeService } from 'src/app/services/commande.service';
import { ProduitService } from 'src/app/services/produit.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { BonService } from 'src/app/services/bon.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-devis-detail',
  templateUrl: './devis-detail.component.html',
  styleUrls: ['./devis-detail.component.scss']
})
export class DevisDetailComponent implements OnInit {

  // Disabled btn
  disableBtn: boolean = false;
  formCommande!: FormGroup;
  formDevis!: FormGroup;

  // Id Ligne devis
  id_ligneDevis!: number;
  id_devis!: number;
  // Var Form devis
  id!: number;
  numero!: number;
  date_devis!: string;
  heure_devis!: string;
  type!: string;
  valid!: boolean;
  etat!: boolean;
  totht!: number;
  net!: number;
  tottva!: number;
  auteur!: number;
  id_client!: any;
  nom_client!: any;
  code_client!: any;
  numero_client!: any;
  email_client!: any;
  totttc!: number;

  editeLigne!: boolean;
  isConvert: boolean = false;
  devis!: any;
  client!: any;

  updateInfo = {
    phone: '',
    id: 0
  }

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public router: Router, public fb: FormBuilder, public devisService: DevisService,
    public ligneDevisService: LigneDevisService, public userService: UserService,
    public toastrService: ToastrService, private datePipe: DatePipe,
    public commandeService: CommandeService, public produitService: ProduitService,
    public parametreService: ParametreService, public bonService: BonService) { }
  get fCommande() { return this.formCommande.controls }
  get fDevis() { return this.formDevis.controls }

  ngOnInit() {
    if (localStorage.getItem('devis') != null) {
      this.devis = JSON.parse(localStorage.getItem('devis')!);
      this.ligneDevisService.listLigneDevis = JSON.parse(localStorage.getItem('listLigneDevisDetail')!);
      this.ligneDevisService.listLigneDevis.forEach((ligne, index) => {
        let codeProduit = ligne.codeProduit;
        this.produitService.getProduitByCode(codeProduit).subscribe(data => {
          let produit: any = data;
          this.ligneDevisService.listLigneDevis[index].qtyReste = produit.qty;
        });
      });
      this.client = JSON.parse(localStorage.getItem('client')!);
      this.id = this.devis.id;
      this.numero = this.devis.numero;
      this.date_devis = this.devis.date_devis;
      this.heure_devis = this.devis.heure_devis;
      this.type = this.devis.type;
      this.totht = this.devis.totht;
      this.net = this.devis.net;
      this.tottva = this.devis.tottva;
      this.auteur = this.userService.name;
      this.totttc = this.devis.totttc;
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

  InfoFormDevis() {
    this.formDevis = this.fb.group({
      id: this.id_devis,
      auteur: this.userService.name,
    });
  }

  getDate(date: any) {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  getHeure(date: any) {
    return this.datePipe.transform(date, 'HH:mm:ss');
  }

  dateNow(dateNow: any) {
    return this.datePipe.transform(dateNow, 'dd-MM-yyyy HH:mm:ss');
  }

  setDevisToCommande() {
    this.InfoFormDevis();
    this.devisService.setDevisToCommande(this.formDevis.value).subscribe(
      data => {
        let resp: any = data;
        this.toastrService.success('Commande numero ' + resp.commande.numero + ' crée !');
        this.commandeService.detail(resp.commande);
      });

  }

  setDevisToBon() {
    this.InfoFormDevis();
    this.devisService.setDevisToBon(this.formDevis.value).subscribe(
      data => {
        let resp: any = data;
        this.toastrService.success('Bon numero ' + resp.bon.numero + ' crée !');
        this.bonService.detail(resp.bon);
      });

  }

  modalDeleteLigneDevis(id: number) {
    this.id_ligneDevis = id;
  }

  openModalConvert(id: number) {
    this.id_devis = id;
  }

  deleteLigneDevis() {
    this.ligneDevisService.delete(this.id_ligneDevis).subscribe((data) => {
      let response: any = data;

      localStorage.removeItem('devis')
      localStorage.removeItem('listLigneDevisDetail')
      localStorage.setItem('devis', JSON.stringify(response.devis));
      localStorage.setItem('listLigneDevisDetail', JSON.stringify(response.listLigneDevis));
      this.toastrService.warning('Ligne supprimée !');
      this.devis = JSON.parse(localStorage.getItem('devis')!);
      this.ligneDevisService.listLigneDevis = JSON.parse(localStorage.getItem('listLigneDevisDetail')!);
      this.client = JSON.parse(localStorage.getItem('client')!);
      this.id = this.devis.id;
      this.date_devis = this.devis.date_devis;
      this.heure_devis = this.devis.heure_devis;
      this.totht = this.devis.totht;
      this.net = this.devis.net;
      this.tottva = this.devis.tottva;
      this.auteur = this.userService.name;
      this.id_client = this.client.id;
      this.totttc = this.devis.totttc;
    });
  }

  deleteDevis() {
    this.devisService.delete(this.devis.id).subscribe((data) => {
      localStorage.removeItem('client');
      localStorage.removeItem('devis');
      localStorage.removeItem('utilisateur');
      localStorage.removeItem('listLignedevisDetail');
      this.toastrService.warning('Devis supprimé !');
      this.router.navigate(['/devis']);
    });
  }

  getSetting() {
    this.parametreService.getSetting().subscribe((data) => {
      localStorage.setItem('setting', JSON.stringify(data));
    });
  }

  editDevis(devis: any) {
    this.devisService.edit(devis);
  }

  sendFactureWhatsApp(devis: any) {
    this.devisService.sendFactureWhatsApp(devis.numero).subscribe((response: any) => {
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
    if (this.devis.code_client == "0") {
      this.toastrService.warning("Impossible de faire la mise à jour car ce client n'existe pas");
    } else {
      this.updateInfo.id = this.devis.id;
      this.devisService.updateInfo(this.updateInfo).subscribe({
        next: (data: any) => {
          let resp: any = data;
          this.updateInfo.phone = '';
          this.updateInfo.id = 0;
          this.toastrService.success('Numéro client mis à jour !');
          if (resp.devis.numero_client) {
            this.sendFactureWhatsApp(resp.devis);
          }
        },
        error: (err: { error: { message: any; }; }) => {
          console.log(err.error.message);
        }
      });
    }
  }

  printDevis(devis: any) {
    this.commandeService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.qg-avenir.iconestock.com/server/public/print/devis/numero/' + devis.numero, "_blank");
    });
  }

}



