import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/services/client.service';
import { CommandeService } from 'src/app/services/commande.service';
import { UserService } from 'src/app/services/user.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { LigneReglementService } from 'src/app/services/ligne-reglement.service';
import { DevisService } from 'src/app/services/devis.service';
import { BonService } from 'src/app/services/bon.service';
import { CompteService } from 'src/app/services/compte.service';
import Swal from 'sweetalert2';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
declare var $: any;

@Component({
  selector: 'app-detail-client',
  templateUrl: './detail-client.component.html',
  styleUrls: ['./detail-client.component.scss']
})
export class DetailClientComponent implements OnInit {

  page: number = 1;
  nbrComm: number = 0;
  nbrDvs: number = 0;
  nbrBon: number = 0;
  defaultItem: number = 5;
  nbrPageComm: number = 0;
  nbrPageDvs: number = 0;
  nbrPageBon: number = 0;
  listCommClt!: any[];
  listDevisClt!: any[];
  listBonClt!: any[];

  listCommClts!: any[];
  listDevisClts!: any[];
  listBonClts!: any[];

  inputFiltreFacture: string = '';
  inputFiltreBon: string = '';
  inputFiltreDevis: string = '';

  client!: any;
  msgError!: any;
  formUpdate!: FormGroup;
  cltFile!: any;
  imgURL!: any;
  totalVente: number = 0;
  totalAvance: number = 0;
  totalRestant: number = 0;
  montantOnMonth: number = 0;

  // Réglement
  formReglement!: FormGroup;
  id_ligneReg!: number;
  verser!: number;
  monnaie: number = 0;
  disableBtn: boolean = false;
  month: any;

  versement!: number;
  retrait!: number;
  description: any;

  totalVersements: number = 0;
  totalRetraits: number = 0;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public clientService: ClientService, public userService: UserService,
    public router: Router, public toastrService: ToastrService,
    public commandeService: CommandeService, public fb: FormBuilder,
    public reglementService: LigneReglementService, private datePipe: DatePipe,
    public parametreService: ParametreService, public devisService: DevisService,
    public bonService: BonService, public compteService: CompteService) { }
  get fUpdate() { return this.formUpdate.controls }

  ngOnInit(): void {
    this.getClient();
    this.initFormUp();
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

  getClient() {
    if (localStorage.getItem("client") != null) {
      const data: any = localStorage.getItem('client');
      this.client = JSON.parse(data);
      this.clientService.getData(this.client.id).subscribe(
        response => {
          let data: any = response;
          this.client = data.client;
          this.listCommClt = data.cmd;
          this.listCommClts = data.cmd;
          this.listDevisClt = data.dvs;
          this.listDevisClts = data.dvs;
          this.listBonClt = data.bons;
          this.listBonClts = data.bons;
          this.reglementService.listLigneReglement = data.reg;
          this.totalVente = data.cmd_mt;
          this.totalAvance = data.cmd_verse;
          this.totalRestant = this.totalVente - this.totalAvance;
          this.montantOnMonth = data.verse_month;

          this.nbrComm = this.listCommClt.length;
          this.nbrDvs = this.listDevisClt.length;
          this.nbrBon = this.listBonClt.length;
          this.nbrPageComm = Math.ceil(this.nbrComm / this.defaultItem);
          this.nbrPageDvs = Math.ceil(this.nbrDvs / this.defaultItem);
          this.nbrPageBon = Math.ceil(this.nbrBon / this.defaultItem);

        });
    }
  }

  // Cette fonction calcule la somme des versements
  calculateTotalVersements(versements: any) {
    let total = 0;
    for (var i = 0; i < versements.length; i++) {
      if (versements[i].montant) {
        total += versements[i].montant;
      }
    }
    return total;
  }

  // Cette fonction calcule la somme des retraits
  calculateTotalRetraits(retraits: any) {
    let total = 0;
    for (var i = 0; i < retraits.length; i++) {
      if (retraits[i].montant) {
        total += retraits[i].montant;
      }
    }
    return total;
  }


  initFormUp() {
    this.formUpdate = new FormGroup({
      id: new FormControl(this.client.id),
      name: new FormControl(this.client.name, [Validators.required]),
      address: new FormControl(this.client.address),
      surnom: new FormControl(this.client.surnom),
      code: new FormControl(this.client.code),
      phone: new FormControl(this.client.phone),
      email: new FormControl(this.client.email),
      auteur: new FormControl(this.userService.name)
    });
  }

  InfoFormReglement() {
    this.formReglement = this.fb.group({
      client: this.client.code,
      net: this.totalVente,
      verser: this.verser,
      restant: this.totalVente - this.totalAvance,
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
        this.getClient();
        this.verser = 0;
        this.disableBtn = false;
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  onSelectFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.cltFile = file;

      var mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        alert('Only images are supported.');
        return;
      }

      var reader = new FileReader();
      reader.readAsDataURL(this.cltFile);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }

      const formData = new FormData();

      formData.append('id', JSON.stringify(this.client.id));
      formData.append('image', this.cltFile);
      this.clientService.updateImage(formData).subscribe(
        data => {
          localStorage.removeItem('client');
          localStorage.setItem('client', JSON.stringify(data));
          this.getClient();
          this.toastrService.success('photo de profile changée !');
        });
    }
  }

  onSelect() {
    $('#file').click();
  }

  compteClient(client: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Es-tu sûr ?",
      text: "de vouloir créer un compte pour ce client ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          client_id: client.id,
          name: client.name,
          auteur: this.userService.name,
        };
        this.clientService.createCompte(data).subscribe({
          next: (response) => {
            localStorage.removeItem('client');
            localStorage.setItem('client', JSON.stringify(response));
            this.getClient();
            this.toastrService.success('Informations mises à jour !');
            Swal.fire({
              title: "Création compte !",
              text: "compte créé.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Erreur lors de la suppression de la ligne :', err);
          },
        });
      }
    });
  }


  onUpdate() {
    this.clientService.updateData(this.formUpdate.value).subscribe({
      next: data => {
        localStorage.removeItem('client');
        localStorage.setItem('client', JSON.stringify(data));
        this.getClient();
        this.toastrService.success('informations mises à jour !');
      },
      error: err => {
        this.toastrService.error(err.error.message);
      }
    });
  }

  deleteClient(id: number) {
    this.clientService.deleteData(id).subscribe(
      data => {
        localStorage.removeItem('client');
        this.toastrService.warning('Client supprimé !');
        this.router.navigate(['/client']);
      },
      error => console.log(error));
  }

  get getFiltreFacture() {
    return this.listCommClts.filter(facture =>
      facture.numero.toLowerCase().includes(this.inputFiltreFacture.toLowerCase())
    );
  }

  get getFiltreDevis() {
    return this.listDevisClts.filter(devis =>
      devis.numero.toLowerCase().includes(this.inputFiltreDevis.toLowerCase())
    );
  }

  get getFiltreBon() {
    return this.listBonClts.filter(bon =>
      bon.numero.toLowerCase().includes(this.inputFiltreBon.toLowerCase())
    );
  }

  modalDeleteLigneReg(id: number) {
    this.id_ligneReg = id;
  }

  deleteLigneReglement() {
    this.reglementService.delete(this.id_ligneReg).subscribe((data) => {
      let response: any = data;
      this.reglementService.listLigneReglement = response.ligneReglementsClient;
      this.toastrService.warning('Ligne supprimée !');
      this.getClient();
    });
  }

  onVerser() {
    if (this.verser < (this.totalVente - this.totalAvance)) {
      this.monnaie = 0;
    } else {
      this.monnaie = this.verser - (this.totalVente - this.totalAvance);
    }
  }

  onChangeMonth(ctrl: any) {
    if (ctrl.value) {
      this.montantOnMonth = 0;
      this.month = ctrl.value;
      this.reglementService.getReglementsClientByMonth(this.client.code, this.month).subscribe(
        response => {
          let data: any = response;
          this.reglementService.listLigneReglement = data.reglements;
          this.montantOnMonth = data.verse_month;
        });
    }
  }

  submitVersement() {
    const payLoad = {
      compt_id: this.client.compte.id,
      montant: this.versement,
      desc: this.description,
      auteur: this.userService.name
    }
    this.compteService.createIn(payLoad).subscribe(
      response => {
        let compte: any = response;
        this.client.compte.versements = compte.versements;
        this.client.compte.sold = compte.sold;
        this.versement = 0;
        this.description = '';
        this.toastrService.success('Versement effectué !');
      });
  }

  submitRetrait() {
    const payLoad = {
      compt_id: this.client.compte.id,
      montant: this.retrait,
      desc: this.description,
      auteur: this.userService.name
    }
    this.compteService.createOut(payLoad).subscribe(
      response => {
        let compte: any = response;
        this.client.compte.retraits = compte.retraits;
        this.client.compte.sold = compte.sold;
        this.retrait = 0;
        this.description = '';
        this.toastrService.success('Retrait effectué !');
      });
  }

  deteteVersement(id: number) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Es-tu sûr ?",
      text: "Cette action est irréversible, tu ne pourras pas récupérer cette ligne une fois supprimée.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprime-le !",
      cancelButtonText: "Non j'annule"
    }).then((result) => {
      if (result.isConfirmed) {
        this.compteService.deleteIn(id).subscribe({
          next: (response) => {
            let compte: any = response;
            this.client.compte.versements = compte.versements;
            this.client.compte.sold = compte.sold;
            Swal.fire({
              title: "Supprimer!",
              text: "ligne supprimée.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Erreur lors de la suppression de la ligne :', err);
          },
        });
      }
    });
  }

  deteteRetrait(id: number) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Es-tu sûr ?",
      text: "Cette action est irréversible, tu ne pourras pas récupérer cette ligne une fois supprimée.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprime-le !",
      cancelButtonText: "Non j'annule"
    }).then((result) => {
      if (result.isConfirmed) {
        this.compteService.deleteOut(id).subscribe({
          next: (response) => {
            let compte: any = response;
            this.client.compte.retraits = compte.retraits;
            this.client.compte.sold = compte.sold;
            Swal.fire({
              title: "Supprimer!",
              text: "ligne supprimée.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Erreur lors de la suppression de la ligne :', err);
          },
        });
      }
    });
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

  detailCommande(commande: any) {
    this.commandeService.detail(commande);
  }

  detailDevis(devis: any) {
    this.devisService.getDevi(devis.id).subscribe((data) => {
      let response: any = data;
      this.devisService.devis = response.devis;
      localStorage.removeItem('devis');
      localStorage.removeItem('dossier');
      localStorage.removeItem('client');
      localStorage.removeItem('listLigneDevisDetail');
      localStorage.setItem('devis', JSON.stringify(this.devisService.devis));
      localStorage.setItem('listLigneDevisDetail', JSON.stringify(response.listLigneDevis));
      localStorage.setItem('client', JSON.stringify(response.client));
      localStorage.setItem('dossier', JSON.stringify(response.dossier));
      this.router.navigate(['/devis-detail']);
    });
  }

  detailBon(bon: any) {
    this.bonService.getBon(bon.id).subscribe((data) => {
      let response: any = data;
      this.bonService.bon = response.bon;
      localStorage.removeItem('bon');
      localStorage.removeItem('dossier');
      localStorage.removeItem('client');
      localStorage.removeItem('listLigneBonDetail');
      localStorage.setItem('bon', JSON.stringify(this.bonService.bon));
      localStorage.setItem('listLigneBonDetail', JSON.stringify(response.ligneBons));
      localStorage.setItem('client', JSON.stringify(response.client));
      localStorage.setItem('dossier', JSON.stringify(response.dossier));
      this.router.navigate(['/bon-detail']);
    });
  }

}
