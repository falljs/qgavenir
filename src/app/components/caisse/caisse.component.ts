import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { CommandeService } from 'src/app/services/commande.service';
import { StatistiqueService } from 'src/app/services/statistique.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.scss']
})
export class CaisseComponent implements OnInit {

  listCommande!: any[];
  listCommClt!: any[];
  listVersement!: any[];
  listEncaissements!: any[];
  listeRemboursements!: any[];
  listeDettePaie!: any[];
  listCommPayer!: any[];
  listCommEncrs!: any[];
  listCommRest!: any[];

  input: any = '';
  result: any = '';

  mtv: number = 0;
  mte: number = 0;
  mtd: number = 0;
  mteDif: number = 0;

  totalVente: number = 0;
  totalAvance: number = 0;
  totalFrais: number = 0;
  totalRestant: number = 0;
  totalVersementCmd: number = 0;
  totlaAvanceReglement: number = 0;
  totalBenefice: number = 0;
  totalRemboursement: number = 0;
  totalDette: number = 0;
  totalWave: number = 0;

  decaissements_sum: number = 0;
  encaissements_sum: number = 0;

  nbr_cmd: number = 0;
  nbr_cmd_payee: number = 0;
  nbr_cmd_encours: number = 0;
  nbr_cmd_no_payee: number = 0;

  nbrVdus: number = 0;
  nbrPayer: number = 0;
  nbrEncrs: number = 0;
  nbrNonP: number = 0;

  title: any;
  isSearch: boolean = false;

  totPerCent: number = 0;
  verPerCent: number = 0;
  resPerCent: number = 0;

  date: any;
  codeClt: any;
  date1: any;
  date2: any;

  isAll: boolean = false;
  isToDay: boolean = false;
  isDate: boolean = false;
  isClt: boolean = false;
  is2Date: boolean = false;
  is2DateTrue: boolean = false;
  isToDate: boolean = false;

  searchSelect = '';
  selectedClient: any = null;
  showDropdown = false;

  isDisable = false;
  isClick = false;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle
  user: any;

  constructor(public clientService: ClientService, public router: Router, public userService: UserService,
    public commandeService: CommandeService, private datePipe: DatePipe,
    public statistiqueService: StatistiqueService) { }

  ngOnInit() {
    this.getClients();
    this.getCommandesToDay();
    this.getCommClientEndetter();
    this.refreshRoleAndPermissonsUser();
    this.user = this.userService.user;
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

  get filteredClient() {
    return this.clientService.listClient.filter(client =>
      client.name.toLowerCase().includes(this.searchSelect.toLowerCase())
    );
  }

  getClients() {
    this.clientService.getAll().subscribe(
      response => {
        this.clientService.listClient = response;
      });
  }

  getCommandes() {
    this.isDisable = true;
    this.isClick = true;
    this.isAll = true;
    this.isToDay = false; this.isDate = false;
    this.isClt = false; this.is2Date = false;
    this.title = 'vendu';
    this.isSearch = false;

    this.listCommande = [];
    this.totalFrais = 0;
    this.listVersement = [];
    this.listEncaissements = [];
    this.listeRemboursements = [];
    this.nbrVdus = 0;

    this.totalVente = 0;
    this.totalAvance = 0;
    this.totalVersementCmd = 0;
    this.totlaAvanceReglement = 0;
    this.totalRestant = 0;
    this.totalRemboursement = 0;
    this.totalDette = 0;
    this.totalWave = 0;
    this.encaissements_sum = 0;
    this.decaissements_sum = 0;
    this.totalBenefice = 0;

    this.decaissements_sum = 0;
    this.encaissements_sum = 0;

    this.nbr_cmd = 0;
    this.nbr_cmd_payee = 0;
    this.nbr_cmd_encours = 0;
    this.nbr_cmd_no_payee = 0;

    this.commandeService.getCommandes().subscribe(
      data => {
        this.isDisable = false;
        this.isClick = false;
        let response: any = data;
        this.listCommande = response.commandes;
        this.listeDettePaie = response.listeDettes;
        this.totalFrais = response.frais;
        this.listVersement = response.reglements;

        this.listeRemboursements = response.listeRemboursements;
        this.nbrVdus = this.listCommande.length;

        this.totalVente = response.net;
        this.totalAvance = response.versement;
        this.totalVersementCmd = response.totalVersementCmd;
        this.totlaAvanceReglement = response.totlaAvanceReglement;
        this.totalRestant = response.restant;
        this.totalRemboursement = response.remboursement;
        this.totalDette = response.dette;
        this.totalWave = response.wave;
        this.totalBenefice = response.benefice;

        this.decaissements_sum = response.decaissements_sum;
        this.encaissements_sum = response.encaissements_sum;

        this.nbr_cmd = response.nbr_cmd;
        this.nbr_cmd_payee = response.nbr_cmd_payee;
        this.nbr_cmd_encours = response.nbr_cmd_encours;
        this.nbr_cmd_no_payee = response.nbr_no_payee;
      });
  }

  onChangeDate(ctrl: any) {
    this.isDate = true;
    this.isToDay = false; this.isAll = false;
    this.isClt = false; this.is2Date = false;

    this.listCommande = [];
    this.totalFrais = 0;
    this.listVersement = [];
    this.listEncaissements = [];
    this.listeRemboursements = [];
    this.nbrVdus = 0;

    this.totalVente = 0;
    this.totalAvance = 0;
    this.totalVersementCmd = 0;
    this.totlaAvanceReglement = 0;
    this.totalRestant = 0;
    this.totalRemboursement = 0;
    this.totalDette = 0;
    this.totalWave = 0;
    this.encaissements_sum = 0;
    this.decaissements_sum = 0;
    this.totalBenefice = 0;

    this.decaissements_sum = 0;
    this.encaissements_sum = 0;

    this.nbr_cmd = 0;
    this.nbr_cmd_payee = 0;
    this.nbr_cmd_encours = 0;
    this.nbr_cmd_no_payee = 0;

    if (ctrl.value) {
      let date: any = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.date = date;

      this.commandeService.getCommandeByDate(date).subscribe(
        data => {
          let response: any = data;
          this.listCommande = response.commandes;
          this.listeDettePaie = response.listeDettes;
          this.totalFrais = response.frais;
          this.listVersement = response.reglements;

          this.listeRemboursements = response.listeRemboursements;
          this.nbrVdus = this.listCommande.length;

          this.totalVente = response.net;
          this.totalAvance = response.versement;
          this.totalVersementCmd = response.totalVersementCmd;
          this.totlaAvanceReglement = response.totlaAvanceReglement;
          this.totalRestant = response.restant;
          this.totalRemboursement = response.remboursement;
          this.totalDette = response.dette;
          this.totalWave = response.wave;
          this.totalBenefice = response.benefice;

          this.decaissements_sum = response.decaissements_sum;
          this.encaissements_sum = response.encaissements_sum;

          this.nbr_cmd = response.nbr_cmd;
          this.nbr_cmd_payee = response.nbr_cmd_payee;
          this.nbr_cmd_encours = response.nbr_cmd_encours;
          this.nbr_cmd_no_payee = response.nbr_no_payee;

        });
    }
  }

  getCommandesToDay() {
    this.isToDay = true;
    this.is2Date = false; this.isClt = false;
    this.isDate = false; this.isAll = false;
    this.title = 'vendu';

    this.listCommande = [];
    this.totalFrais = 0;
    this.listVersement = [];
    this.listEncaissements = [];
    this.listeRemboursements = [];
    this.nbrVdus = 0;

    this.totalVente = 0;
    this.totalAvance = 0;
    this.totalVersementCmd = 0;
    this.totlaAvanceReglement = 0;
    this.totalRestant = 0;
    this.totalRemboursement = 0;
    this.totalDette = 0;
    this.totalWave = 0;
    this.encaissements_sum = 0;
    this.decaissements_sum = 0;
    this.totalBenefice = 0;

    this.decaissements_sum = 0;
    this.encaissements_sum = 0;

    this.nbr_cmd = 0;
    this.nbr_cmd_payee = 0;
    this.nbr_cmd_encours = 0;
    this.nbr_cmd_no_payee = 0;

    this.commandeService.getCommandesToDay().subscribe(
      data => {
        let response: any = data;
        this.listCommande = response.commandes;
        this.listeDettePaie = response.listeDettes;
        this.totalFrais = response.frais;
        this.listVersement = response.reglements;

        this.listeRemboursements = response.listeRemboursements;
        this.nbrVdus = this.listCommande.length;

        this.totalVente = response.net;
        this.totalAvance = response.versement;
        this.totalVersementCmd = response.totalVersementCmd;
        this.totlaAvanceReglement = response.totlaAvanceReglement;
        this.totalRestant = response.restant;
        this.totalRemboursement = response.remboursement;
        this.totalDette = response.dette;
        this.totalWave = response.wave;
        this.totalBenefice = response.benefice;

        this.decaissements_sum = response.decaissements_sum;
        this.encaissements_sum = response.encaissements_sum;

        this.nbr_cmd = response.nbr_cmd;
        this.nbr_cmd_payee = response.nbr_cmd_payee;
        this.nbr_cmd_encours = response.nbr_cmd_encours;
        this.nbr_cmd_no_payee = response.nbr_no_payee;
      });
  }


  // For Calculator
  pressNum(num: string) {

    //Do Not Allow . more than once
    if (num == ".") {
      if (this.input != "") {

        const lastNum = this.getLastOperand()
        if (lastNum.lastIndexOf(".") >= 0) return;
      }
    }

    //Do Not Allow 0 at beginning.
    //Javascript will throw Octal literals are not allowed in strict mode.
    if (num == "0") {
      if (this.input == "") {
        return;
      }
      const PrevKey = this.input[this.input.length - 1];
      if (PrevKey === '/' || PrevKey === '*' || PrevKey === '-' || PrevKey === '+') {
        return;
      }
    }

    this.input = this.input + num
    this.calcAnswer();
  }

  getLastOperand() {
    let pos: number;
    pos = this.input.toString().lastIndexOf("+")
    if (this.input.toString().lastIndexOf("-") > pos) pos = this.input.lastIndexOf("-")
    if (this.input.toString().lastIndexOf("*") > pos) pos = this.input.lastIndexOf("*")
    if (this.input.toString().lastIndexOf("/") > pos) pos = this.input.lastIndexOf("/")
    return this.input.substr(pos + 1)
  }

  pressOperator(op: string) {

    //Do not allow operators more than once
    const lastKey = this.input[this.input.length - 1];
    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+') {
      return;
    }

    this.input = this.input + op
    this.calcAnswer();
  }

  clear() {
    if (this.input != "") {
      this.input = this.input.substr(0, this.input.length - 1)
    }
  }

  allClear() {
    this.result = '';
    this.input = '';
  }

  calcAnswer() {
    let formula = this.input;

    let lastKey = formula[formula.length - 1];

    if (lastKey === '.') {
      formula = formula.substr(0, formula.length - 1);
    }

    lastKey = formula[formula.length - 1];

    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+' || lastKey === '.') {
      formula = formula.substr(0, formula.length - 1);
    }

    this.result = eval(formula);
  }

  getAnswer() {
    this.calcAnswer();
    this.input = this.result;
    if (this.input == "0") this.input = "";
  }

  editCommande(commande: any) {
    $('#closeModal').click();
    this.commandeService.edit(commande);
  }

  detail(commande: any) {
    $('#closeModal').click();
    this.commandeService.getCommande(commande.id).subscribe((data) => {
      let response: any = data;
      this.commandeService.commande = response.commande;
      localStorage.removeItem('commande')
      localStorage.removeItem('dossier')
      localStorage.removeItem('client')
      localStorage.removeItem('listLigneCommande')
      localStorage.removeItem('listLigneCommande')
      localStorage.setItem('commande', JSON.stringify(this.commandeService.commande));
      localStorage.setItem('listLigneCommande', JSON.stringify(response.ligneCommandes));
      localStorage.setItem('listReglement', JSON.stringify(response.ligneReglements));
      localStorage.setItem('client', JSON.stringify(response.client));
      localStorage.setItem('dossier', JSON.stringify(response.dossier));
      this.router.navigate(['/commande-detail']);
    });
  }

  searchNumber() {
    var input: any, filter, table: any, tr, i;

    input = document.getElementById("inputNum");
    if (input.value) {
      this.isSearch = true;
    } else {
      this.isSearch = false;
    }
    filter = input.value.toUpperCase();
    table = document.getElementById("tableComm");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      var td0 = tr[i].getElementsByTagName("td")[0];

      if (td0) {
        var txtValue0 = td0.textContent || td0.innerHTML;
        if (
          txtValue0.toUpperCase().indexOf(filter) == 0
        ) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  searchDate() {
    var input: any, filter, table: any, tr, i;

    input = document.getElementById("inputDate");
    if (input.value) {
      this.isSearch = true;
    } else {
      this.isSearch = false;
    }
    filter = input.value.toUpperCase();
    table = document.getElementById("tableComm");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      var td0 = tr[i].getElementsByTagName("td")[1];

      if (td0) {
        var txtValue0 = td0.textContent || td0.innerHTML;
        if (
          txtValue0.toUpperCase().indexOf(filter) == 0
        ) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  searchClient() {
    var input: any, filter, table: any, tr, i;

    input = document.getElementById("inputClt");
    if (input.value) {
      this.isSearch = true;
    } else {
      this.isSearch = false;
    }
    filter = input.value.toUpperCase();
    table = document.getElementById("tableComm");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      var td0 = tr[i].getElementsByTagName("td")[2];

      if (td0) {
        var txtValue0 = td0.textContent || td0.innerHTML;
        if (
          txtValue0.toUpperCase().indexOf(filter) == 0
        ) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  onChange2DatesFirst(ctrl: any) {
    if (ctrl.value) {
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.date1 = date;
      this.is2DateTrue = true;
    } else {
      this.is2DateTrue = false;
    }
  }

  onChange2DatesSecond(ctrl: any) {
    this.is2Date = true; this.isToDate = true;
    this.isToDay = false; this.isClt = false;
    this.isDate = false; this.isAll = false;
    if (ctrl.value) {
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.date2 = date;
      this.listCommande = [];
      this.totalFrais = 0;
      this.listVersement = [];
      this.listEncaissements = [];
      this.listeRemboursements = [];
      this.nbrVdus = 0;

      this.totalVente = 0;
      this.totalAvance = 0;
      this.totalVersementCmd = 0;
      this.totalRestant = 0;
      this.totalRemboursement = 0;
      this.totalDette = 0;
      this.totalWave = 0;
      this.encaissements_sum = 0;
      this.decaissements_sum = 0;
      this.totalBenefice = 0;

      this.nbr_cmd = 0;
      this.nbr_cmd_payee = 0;
      this.nbr_cmd_encours = 0;
      this.nbr_cmd_no_payee = 0;

      this.commandeService.getCommandeBy2Dates(this.date1, date).subscribe(
        data => {

          let response: any = data;
          this.listCommande = response.commandes;
          this.listeDettePaie = response.listeDettes;
          this.totalFrais = response.frais;
          this.listVersement = response.reglements;

          this.listeRemboursements = response.listeRemboursements;
          this.nbrVdus = this.listCommande.length;

          this.totalVente = response.net;
          this.totalAvance = response.versement;
          this.totalVersementCmd = response.totalVersementCmd;
          this.totalRestant = response.restant;
          this.totalRemboursement = response.remboursement;
          this.totalDette = response.dette;
          this.totalWave = response.wave;
          this.totalBenefice = response.benefice;

          this.decaissements_sum = response.decaissements_sum;
          this.encaissements_sum = response.encaissements_sum;

          this.nbr_cmd = response.nbr_cmd;
          this.nbr_cmd_payee = response.nbr_cmd_payee;
          this.nbr_cmd_encours = response.nbr_cmd_encours;
          this.nbr_cmd_no_payee = response.nbr_no_payee;
        });
    }
  }

  getCommClientEndetter() {
    this.statistiqueService.getCommandesClientEndette().subscribe(
      res => {
        let response: any = res;
        this.listCommClt = response;
      });
  }

  printToDay() {
    this.commandeService.onPrint().subscribe(() => {
      window.open(
        'http://qg-avenir.iconestock.com/server/public/print/toDay/caisse?user='
        + this.user.id,
        '_blank'
      );
    });
  }

  printAll() {
    this.commandeService.onPrint().subscribe(() => {
      window.open(
        'http://qg-avenir.iconestock.com/server/public/print/all/caisse?user='
        + this.user.id,
        '_blank'
      );
    });
  }

  printDate() {
    this.commandeService.onPrint().subscribe(() => {
      window.open(
        'http://qg-avenir.iconestock.com/server/public/print/date/caisse/'
        + this.date
        + '?user='
        + this.user.id,
        '_blank'
      );
    });
  }

  printTwoDate() {
    this.commandeService.onPrint().subscribe(() => {
      window.open(
        'http://qg-avenir.iconestock.com/server/public/print/twoDate/caisse/'
        + this.date1
        + '/'
        + this.date2
        + '?user='
        + this.user.id,
        '_blank'
      );
    });
  }

}
