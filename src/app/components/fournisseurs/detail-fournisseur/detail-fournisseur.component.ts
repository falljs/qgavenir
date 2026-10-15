import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AchatService } from 'src/app/services/achat.service';
import { BonAchatService } from 'src/app/services/bon-achat.service';
import { BonService } from 'src/app/services/bon.service';
import { CommandeService } from 'src/app/services/commande.service';
import { CompteService } from 'src/app/services/compte.service';
import { DevisService } from 'src/app/services/devis.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { LigneReglementAchatService } from 'src/app/services/ligne-reglement-achat.service';
import { LigneReglementService } from 'src/app/services/ligne-reglement.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-detail-fournisseur',
  templateUrl: './detail-fournisseur.component.html',
  styleUrls: ['./detail-fournisseur.component.scss']
})
export class DetailFournisseurComponent {

  page: number = 1;
  nbrAchat: number = 0;
  nbrDvs: number = 0;
  nbrBon: number = 0;
  defaultItem: number = 5;
  nbrPageAchat: number = 0;
  nbrPageDvs: number = 0;
  nbrPageBonAchat: number = 0;
  listAchats!: any[];


  listBonAchat!: any[];

  inputFiltreFacture: string = '';
  inputFiltreFactureBon: string = '';
  inputFiltreBon: string = '';
  inputFiltreDevis: string = '';

  fournisseur!: any;
  msgError!: any;
  formUpdate!: FormGroup;
  cltFile!: any;
  imgURL!: any;
  totalAchat: number = 0;
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

  constructor(public fournisseurService: FournisseurService, public userService: UserService,
    public router: Router, public toastrService: ToastrService, public reglementAchatService: LigneReglementAchatService,
    public commandeService: CommandeService, public fb: FormBuilder, public achatService: AchatService,
    public reglementService: LigneReglementService, private datePipe: DatePipe, public bonAchatService: BonAchatService,
    public parametreService: ParametreService, public devisService: DevisService,
    public bonService: BonService, public compteService: CompteService) { }
  get fUpdate() { return this.formUpdate.controls }

  ngOnInit(): void {
    this.getFournisseur();
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

  getFournisseur() {
    if (localStorage.getItem("fournisseur") != null) {
      const data: any = localStorage.getItem('fournisseur');
      this.fournisseur = JSON.parse(data);
      this.fournisseurService.getData(this.fournisseur.id).subscribe(
        response => {
          let data: any = response;
          this.fournisseur = data.fournisseur;
          this.listAchats = data.achat;
          this.listBonAchat = data.bons;
          this.totalAchat = data.achat_mt;
          this.totalAvance = data.achat_verse;
          this.totalRestant = data.achat_reste;
          this.montantOnMonth = data.verse_month;
          this.nbrAchat = data.achat_nbr;
          this.nbrBon = data.bonAchat_nbr;
          this.nbrPageAchat = Math.ceil(this.nbrAchat / this.defaultItem);
          this.nbrPageBonAchat = Math.ceil(this.nbrBon / this.defaultItem);
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
      id: new FormControl(this.fournisseur.id),
      name: new FormControl(this.fournisseur.name, [Validators.required]),
      address: new FormControl(this.fournisseur.address),
      surnom: new FormControl(this.fournisseur.surnom),
      code: new FormControl(this.fournisseur.code),
      phone: new FormControl(this.fournisseur.phone),
      email: new FormControl(this.fournisseur.email),
      auteur: new FormControl(this.userService.name)
    });
  }

  InfoFormReglement() {
    this.formReglement = this.fb.group({
      fournisseur: this.fournisseur.code,
      net: this.totalAchat,
      verser: this.verser,
      restant: this.totalAchat - this.totalAvance,
      auteur: this.userService.name,
    });
  }

  onSubmitReglement() {
    this.disableBtn = true;
    this.InfoFormReglement();
    this.reglementAchatService.setcreatedFournisseurReglement(this.formReglement.value).subscribe({
      next: data => {
        let response: any = data;
        this.toastrService.success('versement de ' + response.ligneReglement.avance + ' F CFA');
        this.getFournisseur();
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

      formData.append('id', JSON.stringify(this.fournisseur.id));
      formData.append('image', this.cltFile);
      this.fournisseurService.updateImage(formData).subscribe(
        data => {
          localStorage.removeItem('fournisseur');
          localStorage.setItem('fournisseur', JSON.stringify(data));
          this.getFournisseur();
          this.toastrService.success('photo de profile changée !');
        });
    }
  }

  onSelect() {
    $('#file').click();
  }

  compteClient(fournisseur: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Es-tu sûr ?",
      text: "de vouloir créer un compte pour ce fournisseur ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          id_fournisseur: fournisseur.id,
          name: fournisseur.name,
          auteur: this.userService.name,
        };
        this.fournisseurService.createCompte(data).subscribe({
          next: (response) => {
            localStorage.removeItem('fournisseur');
            localStorage.setItem('fournisseur', JSON.stringify(response));
            this.getFournisseur();
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
    this.fournisseurService.updateData(this.formUpdate.value).subscribe({
      next: data => {
        localStorage.removeItem('fournisseur');
        localStorage.setItem('fournisseur', JSON.stringify(data));
        this.getFournisseur();
        this.toastrService.success('informations mises à jour !');
      },
      error: err => {
        this.toastrService.error(err.error.message);
      }
    });
  }

  deleteClient(id: number) {
    this.fournisseurService.deleteData(id).subscribe(
      data => {
        localStorage.removeItem('fournisseur');
        this.toastrService.warning('fournisseur supprimé !');
        this.router.navigate(['/fournisseur']);
      },
      error => console.log(error));
  }

  get getFiltreFacture() {
    return this.listAchats.filter(facture =>
      facture.numero.toLowerCase().includes(this.inputFiltreFacture.toLowerCase())
    );
  }

  get getFiltreFactureBon() {
    return this.listBonAchat.filter(facture =>
      facture.numero.toLowerCase().includes(this.inputFiltreFactureBon.toLowerCase())
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
      this.getFournisseur();
    });
  }

  onVerser() {
    if (this.verser < (this.totalAchat - this.totalAvance)) {
      this.monnaie = 0;
    } else {
      this.monnaie = this.verser - (this.totalAchat - this.totalAvance);
    }
  }

  onChangeMonth(ctrl: any) {
    if (ctrl.value) {
      this.montantOnMonth = 0;
      this.month = ctrl.value;
      this.reglementService.getReglementsClientByMonth(this.fournisseur.code, this.month).subscribe(
        response => {
          let data: any = response;
          this.reglementService.listLigneReglement = data.reglements;
          this.montantOnMonth = data.verse_month;
        });
    }
  }

  submitVersement() {
    const payLoad = {
      compt_id: this.fournisseur.compte.id,
      montant: this.versement,
      desc: this.description,
      auteur: this.userService.name
    }
    this.compteService.createIn(payLoad).subscribe(
      response => {
        let compte: any = response;
        this.fournisseur.compte.versements = compte.versements;
        this.fournisseur.compte.sold = compte.sold;
        this.versement = 0;
        this.description = '';
        this.getFournisseur();
        this.toastrService.success('Versement effectué !');
      });
  }

  submitRetrait() {
    const payLoad = {
      compt_id: this.fournisseur.compte.id,
      montant: this.retrait,
      desc: this.description,
      auteur: this.userService.name
    }
    this.compteService.createOut(payLoad).subscribe(
      response => {
        let compte: any = response;
        this.fournisseur.compte.retraits = compte.retraits;
        this.fournisseur.compte.sold = compte.sold;
        this.retrait = 0;
        this.description = '';
        this.getFournisseur();
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
            this.fournisseur.compte.versements = compte.versements;
            this.fournisseur.compte.sold = compte.sold;
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
            this.fournisseur.compte.retraits = compte.retraits;
            this.fournisseur.compte.sold = compte.sold;
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

  editAchat(achat: any) {
    this.achatService.edit(achat);
  }

  editBonAchat(achat: any) {
    this.bonAchatService.edit(achat);
  }

  detailAchat(achat: any) {
    this.achatService.detail(achat);
  }

  detailBonAchat(achat: any) {
    this.bonAchatService.detail(achat);
  }

}

