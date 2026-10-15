import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StatistiqueService } from 'src/app/services/statistique.service';
import { ChartConfiguration } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
import { parseISO, startOfWeek, addDays, format, isSameDay, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  listProduit: any[] = [];
  listProduitByDate: any[] = [];
  listProduitBy2Date: any[] = [];
  nbrPdt: number = 0;
  nbrPdtByDate: number = 0;
  nbrPdtBy2Date: number = 0;
  isDate: boolean = false;
  is2Date: boolean = false;
  date: any;

  commandesDuJour: number = 0;
  commandesDuJourInvalide: number = 0;

  /* Start Diagramme des ventes */
  startDate: string = '';
  endDate: string = '';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  public chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Total TTC',
        fill: true,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.2)',
        tension: 0.4,
        pointRadius: 4
      }
    ]
  };

  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };
  /* End Diagramme des ventes */

  searchSelect = '';
  searchSelectDate = '';
  searchSelect2Dates = '';

  firstRoleName: string | null = null;

  selectedDateFilter: string | null = null;     // date choisie pour la carte "vendus le"
  selectedDateRangeEnd: string | null = null;    // date de fin pour la carte "vendus entre le"

  get todayDate(): Date {
    return new Date();
  }

  // Libellés de date à afficher dans les en-têtes de tableau
  selectedDateLabel: string = '';   // pour la carte "byDate"
  selectedRangeLabel: string = '';  // pour la carte "by2Date"
  dateFin: any;                     // date de fin, non stockée actuellement

  get todayLabel(): string {
    return format(new Date(), 'EEEE dd MMMM yyyy', { locale: fr });
  }

  // 👇 Ajoutez les getters ICI, dans la classe
  get isFilterCardActive(): boolean {
    return this.searchSelect.trim().length > 0;
  }

  get isFilterDateActive(): boolean {
    return this.isDate || this.searchSelectDate.trim().length > 0;
  }

  get isFilter2DateActive(): boolean {
    return this.is2Date || this.searchSelect2Dates.trim().length > 0;
  }

  get isChartFilterActive(): boolean {
    return !!this.startDate && !!this.endDate;
  }

  get hasActiveFilter(): boolean {
    return this.isFilterCardActive || this.isFilterDateActive
      || this.isFilter2DateActive || this.isChartFilterActive;
  }

  constructor(
    public statistiqueService: StatistiqueService, public userService: UserService,
    private datePipe: DatePipe, public router: Router, public localStorageService: LocalStorageService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getMostSeller();
    this.getChartData();
    this.refreshRoleAndPermissonsUser();
    // Vérifier si les rôles existent dans l'utilisateur
    if (this.userService.user.roles && this.userService.user.roles.length > 0) {
      // Extraire le nom du premier rôle
      this.firstRoleName = this.userService.user.roles[0].name;
    }
  }

  printDashboard() {

    const content = document.getElementById('dashboard-print');
    if (!content) return;

    // Clone du dashboard pour ne jamais modifier l'affichage original
    const clone = content.cloneNode(true) as HTMLElement;

    // Permettre aux tableaux de prendre toute leur hauteur lors de l'impression
    clone.querySelectorAll<HTMLElement>('[data-print-section]').forEach(section => {
      section.style.maxHeight = 'none';
      section.style.height = 'auto';
      section.style.overflow = 'visible';
    });

    const sections = clone.querySelectorAll<HTMLElement>('[data-print-section]');

    sections.forEach((section: HTMLElement) => {

      const key = section.getAttribute('data-print-section');

      let isEmpty = false;

      /*
       * IMPORTANT :
       * On ne vérifie PLUS quel filtre est actif.
       *
       * Chaque tableau est maintenant traité indépendamment.
       * Si plusieurs tableaux ont des résultats, ils seront TOUS imprimés.
       */

      switch (key) {

        // Tableau : produits les plus vendus aujourd'hui
        case 'today':
          isEmpty = this.filteredToDay.length === 0;
          break;

        // Tableau : produits les plus vendus à une date
        case 'byDate':
          isEmpty = this.filteredDate.length === 0;
          break;

        // Tableau : produits les plus vendus entre deux dates
        case 'by2Date':
          isEmpty = this.filtered2Date.length === 0;
          break;

        // Graphique
        case 'chart':
          // On conserve le graphique uniquement s'il possède des données
          isEmpty = !this.chartData?.datasets?.some(
            dataset => Array.isArray(dataset.data) && dataset.data.length > 0
          );
          break;

        default:
          break;
      }

      // Supprimer uniquement les sections réellement vides
      if (isEmpty) {
        section.remove();
      }
    });

    /*
     * Vérifier s'il reste au moins une section à imprimer
     */
    const remainingSections =
      clone.querySelectorAll('[data-print-section]').length;

    if (remainingSections === 0) {

      const msg = document.createElement('div');

      msg.className = 'text-center text-muted p-5';

      msg.innerText =
        'Aucune donnée à imprimer pour la sélection actuelle.';

      clone.appendChild(msg);
    }

    /*
     * Ouvrir la fenêtre d'impression
     */
    const popup = window.open(
      '',
      '_blank',
      'width=1200,height=800'
    );

    if (!popup) {
      return;
    }

    popup.document.write(`
    <!DOCTYPE html>
    <html lang="fr">

    <head>

      <meta charset="UTF-8">

      <title>Rapport Dashboard</title>

      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      >

      <style>

        @page {
          size: A4;
          margin: 12mm;
        }

        * {
          box-sizing: border-box;
        }

        body {
          padding: 0;
          margin: 0;
          font-family: Arial, sans-serif;
          font-size: 12px;
        }

        /*
         * Chaque carte peut occuper plusieurs pages
         */
        .card {
          margin-bottom: 25px;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        /*
         * Les tableaux doivent pouvoir dépasser
         * la hauteur initiale du dashboard
         */
        .table-responsive {
          overflow: visible !important;
          max-height: none !important;
          height: auto !important;
        }

        /*
         * Supprimer les champs de recherche/date à l'impression
         */
        input {
          display: none !important;
        }

        /*
         * Supprimer les boutons
         */
        button,
        .no-print {
          display: none !important;
        }

        /*
         * Masquer les éléments inutiles
         */
        .progress {
          display: none !important;
        }

        /*
         * Tableau pleine largeur
         */
        table {
          width: 100% !important;
          border-collapse: collapse;
          page-break-inside: auto;
        }

        thead {
          display: table-header-group;
        }

        tbody {
          display: table-row-group;
        }

        tr {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        th,
        td {
          padding: 6px !important;
          vertical-align: middle;
        }

        /*
         * Les colonnes Bootstrap
         */
        .row {
          display: flex;
          flex-wrap: wrap;
        }

        /*
         * Sur papier, les cartes restent lisibles
         */
        [data-print-section] {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
          margin-bottom: 25px;
        }

        /*
         * Éviter qu'une carte soit coupée entre deux pages
         * autant que possible.
         */
        .card,
        .card-body {
          break-inside: avoid;
        }

      </style>

    </head>

    <body>

      ${clone.innerHTML}

    </body>

    </html>
  `);

    popup.document.close();

    /*
     * Attendre le chargement du CSS avant impression
     */
    setTimeout(() => {

      popup.focus();

      popup.print();

      popup.close();

    }, 700);
  }

  refreshRoleAndPermissonsUser(): void {
    this.userService.refreshRoleAndPermissonsUser(this.userService.user.id).subscribe(data => {
      let resp: any = data;
      this.userService.user.permissions = resp.user.permissions;
      this.userService.setRoles(resp.user.roles);
    });
  }

  getChartData() {
    this.statistiqueService.getVentesParJour().subscribe(data => {
      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Lundi

      const labels: string[] = [];
      const values: number[] = [];

      // Construire les 7 jours de la semaine
      for (let i = 0; i < 7; i++) {
        const currentDate = addDays(weekStart, i);
        const dateStr = format(currentDate, 'dd-MM-yyyy');
        labels.push(dateStr);

        // Chercher la vente correspondante
        const entry = data.find(item => isSameDay(parseISO(item.date), currentDate));
        values.push(entry ? entry.total : 0);
      }

      this.chartData = {
        labels: labels,
        datasets: [
          {
            data: values,
            label: 'Total TTC (Semaine en cours)',
            fill: true,
            borderColor: '#007bff',
            backgroundColor: 'rgba(0,123,255,0.2)',
            tension: 0.4,
            pointRadius: 4
          }
        ]
      };

      setTimeout(() => {
        this.chart?.update();
      }, 0);
    });
  }

  getChartDataDates() {
    if (!this.startDate || !this.endDate) return;

    this.statistiqueService.getVentesParJourFexible(this.startDate, this.endDate).subscribe(data => {
      const labels: string[] = [];
      const values: number[] = [];

      const startStr = format(parseISO(this.startDate), 'EEEE dd MMMM yyyy', { locale: fr });
      const endStr = format(parseISO(this.endDate), 'EEEE dd MMMM yyyy', { locale: fr });
      const label = `Total TTC du ${startStr} au ${endStr}`;

      const start = parseISO(this.startDate);
      const end = parseISO(this.endDate);
      const nbDays = differenceInDays(end, start);

      for (let i = 0; i <= nbDays; i++) {
        const currentDate = addDays(start, i);
        const dateStr = format(currentDate, 'dd-MM-yyyy');
        // Ajoute la valeur
        const vente = data.find(item => isSameDay(parseISO(item.date), currentDate));
        values.push(vente ? vente.total : 0);

        // Ajoute le label uniquement si :
        // - l'intervalle est petit (<= 7 jours), ou
        // - c'est le premier ou dernier jour
        if (nbDays <= 7 || i === 0 || i === nbDays) {
          labels.push(dateStr);
        } else {
          labels.push(''); // label vide pour éviter surcharge visuelle
        }
      }

      this.chartData = {
        labels: labels,
        datasets: [
          {
            data: values,
            label: label,
            fill: true,
            borderColor: '#007bff',
            backgroundColor: 'rgba(0,123,255,0.2)',
            tension: 0.4,
            pointRadius: 4
          }
        ]
      };

      setTimeout(() => {
        this.chart?.update();
      }, 0);
    });
  }

  onDateChange() {
    this.getChartDataDates(); // Met à jour dès qu'une date change
  }

  getInfo() {
    this.statistiqueService.getInfo().subscribe(res => {
      let response: any = res;
      this.commandesDuJour = response.commandesDuJour.length;
      this.commandesDuJourInvalide = response.commandesDuJourInvalide.length;
    })
  }

  getMostSeller() {
    this.statistiqueService.getMostSeller().subscribe(res => {
      let response: any = res;
      this.listProduit = response;
      this.nbrPdt = this.listProduit.length;

      for (var i = 0; i < this.nbrPdt; i++) {
        const qtyOut = this.listProduit[i].sum_qty;
        const qtyInit = this.listProduit[i].qty_init;
        this.listProduit[i].perCent = Math.round((qtyOut * 100) / qtyInit);
      }

    })
  }

  onChangeDate(ctrl: any) {
    if (ctrl.value) {
      this.isDate = true;

      const date = this.datePipe.transform(ctrl.value, 'yyyy-MM-dd');
      this.selectedDateLabel = format(parseISO(date!), 'EEEE dd MMMM yyyy', { locale: fr });
      this.selectedRangeLabel = ''; // reset tant que la 2e date n'est pas choisie

      this.statistiqueService.getMostSellerByDate(date).subscribe(res => {
        const response: any = res;
        this.listProduitByDate = response;
        this.nbrPdtByDate = this.listProduitByDate.length;

        for (let i = 0; i < this.nbrPdtByDate; i++) {
          const produit = this.listProduitByDate[i];

          // Sécurité : si un champ est null, on le force à 0
          const qtyOut = Number(produit.sum_qty) || 0;      // quantité vendue
          const qtyRest = Number(produit.qty_rest) || 0;    // quantité restante actuelle

          // Quantité initiale du jour = restant + vendu
          const qtyInit = qtyRest + qtyOut;

          // Calcul du pourcentage vendu (évite la division par 0)
          produit.perCent = qtyInit > 0 ? Math.round((qtyOut * 100) / qtyInit) : 0;
        }
      });
    } else {
      this.isDate = false;
    }
  }

  onChange2DatesFirst(ctrl: any) {
    if (ctrl.value) {
      let date = this.datePipe.transform(ctrl.value, 'yyyy-MM-dd');
      this.date = date;
    }
  }
  onChange2DatesSecond(ctrl: any) {
    if (ctrl.value) {
      this.is2Date = true;
      let dateFin = this.datePipe.transform(ctrl.value, 'yyyy-MM-dd');
      this.dateFin = dateFin;

      this.selectedRangeLabel =
        `du ${format(parseISO(this.date), 'dd MMMM yyyy', { locale: fr })} ` +
        `au ${format(parseISO(dateFin!), 'dd MMMM yyyy', { locale: fr })}`;

      this.statistiqueService.getMostSellerBy2Date(this.date, dateFin).subscribe(res => {
        let response: any = res;
        this.listProduitBy2Date = response;
        this.nbrPdtBy2Date = this.listProduitBy2Date.length;

        for (let i = 0; i < this.nbrPdtBy2Date; i++) {
          const produit = this.listProduitBy2Date[i];

          // Sécurisation
          const qtyRestAujourdhui = Number(produit.qty_rest) || 0; // stock du jour actuel (fin de période)
          const ventesPeriode = Number(produit.sum_qty) || 0;       // ventes sur la période

          // ⚙️ Quantité initiale au début de la période
          const qtyInitPeriode = qtyRestAujourdhui + ventesPeriode;

          // Assignation correcte
          produit.qty_init = qtyInitPeriode;
          produit.qty_rest = qtyRestAujourdhui;
          produit.sum_qty = ventesPeriode;

          // Pourcentage de vente sur la période
          produit.perCent = qtyInitPeriode > 0 ? Math.round((ventesPeriode * 100) / qtyInitPeriode) : 0;
        }
      });
    } else {
      this.is2Date = false;
    }
  }

  get filteredToDay() {
    return this.listProduit.filter(produit =>
      produit.produit.toLowerCase().includes(this.searchSelect.toLowerCase())
    );
  }

  get filteredDate() {
    return this.listProduitByDate.filter(produit =>
      produit.produit.toLowerCase().includes(this.searchSelectDate.toLowerCase())
    );
  }

  get filtered2Date() {
    return this.listProduitBy2Date.filter(produit =>
      produit.produit.toLowerCase().includes(this.searchSelect2Dates.toLowerCase())
    );
  }

  routeFrais() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/frais']);
  }

  routeRapport() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/rapport']);
  }
}
