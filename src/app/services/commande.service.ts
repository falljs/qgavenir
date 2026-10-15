import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private created = `${this.url}/commande/create`;
  private updated = `${this.url}/commande/update`;
  private updatedInfo = `${this.url}/commande/updateInfo`;

  private deleted = `${this.url}/commande/delete`;
  private annuler = `${this.url}/commande/annuler`;
  private commandes = `${this.url}/commande/commandes`;
  private com = `${this.url}/commande/commande`;
  private reduce = `${this.url}/commande/reduction`;
  private maxid = `${this.url}/commande/maxId`;
  private search = `${this.url}/commande/search`;

  private searchByDate = `${this.url}/commande/searchByDate`;
  private searchByClient = `${this.url}/commande/searchByClient`;
  private searchByTwoDate = `${this.url}/commande/searchByTwoDate`;
  private commandesToDay = `${this.url}/commande/commandesToDay`;

  private nbrCommPayer = `${this.url}/commande/nombreCommandesPayer`;
  private nbrCommEncrs = `${this.url}/commande/nombreCommandesEncours`;
  private nbrCommRest = `${this.url}/commande/nombreCommandesRestant`;
  private nbrCommWave = `${this.url}/commande/nombreCommandesWave`;

  private nbrCommPayerToDay = `${this.url}/commande/nombreCommandesPayerToDay`;
  private nbrCommEncrsToDay = `${this.url}/commande/nombreCommandesEncoursToDay`;
  private nbrCommRestToDay = `${this.url}/commande/nombreCommandesRestantToDay`;

  private nbrCommPayerByDate = `${this.url}/commande/nombreCommandesPayerByDate`;
  private nbrCommEncrsByDate = `${this.url}/commande/nombreCommandesEncoursByDate`;
  private nbrCommRestByDate = `${this.url}/commande/nombreCommandesRestantByDate`;

  private nbrCommPayerByClient = `${this.url}/commande/nombreCommandesPayerByClient`;
  private nbrCommEncrsByClient = `${this.url}/commande/nombreCommandesEncoursByClient`;
  private nbrCommRestByClient = `${this.url}/commande/nombreCommandesRestantByClient`;

  private nbrCommPayerBy2Date = `${this.url}/commande/nombreCommandesPayerByTwoDate`;
  private nbrCommEncrs2Date = `${this.url}/commande/nombreCommandesEncoursByTwoDate`;
  private nbrCommRestBy2Date = `${this.url}/commande/nombreCommandesRestantByTwoDate`;

  private detteToDay = `${this.url}/commande/detteToDay`;
  private detteClient = `${this.url}/commande/dettesearchByClient`;
  private dettes = `${this.url}/commande/dettes`;
  private searchDetteByDate = `${this.url}/commande/searchDetteByDate`;

  listCommande!: any[];
  listDette!: any[];
  listDetteBon!: any[];
  commande!: any;
  maxId!: any;
  nbrCmd: number = 0;

  totalVente: number = 0;
  totalAvance: number = 0;
  totalRestant: number = 0;

  constructor(private http: HttpClient, public router: Router) { }

  getCommandesDay() {
    this.totalVente = 0; this.totalAvance = 0; this.totalRestant = 0;
    this.getCommandesToDay().subscribe(
      data => {
        let response: any = data;
        this.listCommande = response.commandes;
        this.nbrCmd = this.listCommande.length;
        let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

        for (var i = 0; i < this.nbrCmd; i++) {

          if (this.listCommande[i].net) {
            totalVente += this.listCommande[i].net;
            this.totalVente = totalVente;
          } else {
            totalVente += this.listCommande[i].net;
            this.totalVente = totalVente;
          }

          if (this.listCommande[i].versement) {
            totalAvance += this.listCommande[i].versement;
            this.totalAvance = totalAvance;
          } else {
            totalAvance += this.listCommande[i].versement;
            this.totalAvance = totalAvance;
          }

          if (this.listCommande[i].restant) {
            totalRestant += this.listCommande[i].restant;
            this.totalRestant = totalRestant;
          } else {
            totalRestant += this.listCommande[i].restant;
            this.totalRestant = totalRestant;
          }
        }
      });
  }

  create(data: Object): Observable<Object> {
    return this.http.post(`${this.created}`, data);
  }

  update(data: Object): Observable<Object> {
    return this.http.post(`${this.updated}`, data);
  }

  updateInfo(data: Object): Observable<Object> {
    return this.http.post(`${this.updatedInfo}`, data);
  }



  delete(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/${id}`, { responseType: 'text' });
  }

  cancel(id: number): Observable<any> {
    return this.http.get(`${this.annuler}/${id}`, { responseType: 'text' });
  }

  getCommande(id: number): Observable<Object> {
    return this.http.get(`${this.com}/${id}`);
  }

  getCommandesToDay(): Observable<any> {
    return this.http.get(`${this.commandesToDay}`);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

  getCommandes(): Observable<any> {
    return this.http.get(`${this.commandes}`);
  }

  getMaxId(): Observable<any> {
    return this.http.get(`${this.maxid}`);
  }

  reduction(data: Object): Observable<Object> {
    return this.http.post(`${this.reduce}`, data);
  }

  detail(commande: any) {
    this.getCommande(commande.id).subscribe((data) => {
      let response: any = data;
      this.commande = response.commande;
      localStorage.removeItem('restant');
      localStorage.removeItem('commande');
      localStorage.removeItem('client');
      localStorage.removeItem('listReglement')
      localStorage.removeItem('listLigneCommande');
      localStorage.setItem('commande', JSON.stringify(this.commande));
      localStorage.setItem('listReglementDetail', JSON.stringify(response.ligneReglements));
      localStorage.setItem('listLigneCommandeDetail', JSON.stringify(response.ligneCommandes));
      if (response.client) {
        localStorage.setItem('client', JSON.stringify(response.client));
      } else {
        localStorage.setItem('client', JSON.stringify(this.commande.nom_client));
      }
      this.router.navigate(['/commande-detail']);
    });
  }

  edit(commande: any) {
    this.getCommande(commande.id).subscribe((data) => {
      let response: any = data;
      this.commande = response.commande;
      localStorage.removeItem('commande')
      localStorage.removeItem('restant')
      localStorage.removeItem('client')
      localStorage.removeItem('listLigneCommande')
      localStorage.setItem('commande', JSON.stringify(this.commande));
      localStorage.setItem('listLigneCommande', JSON.stringify(response.ligneCommandes));
      if (response.client) {
        localStorage.setItem('client', JSON.stringify(response.client));
      } else {
        localStorage.setItem('client', JSON.stringify(this.commande.nom_client));
      }
      this.router.navigate(['/commande-detail']);
      this.router.navigate(['/commande-edit']);
    });
  }

  searchCommande(search: any): Observable<any> {
    return this.http.get(`${this.search}/${search}`);
  }

  getCommandeByDate(date: any): Observable<any> {
    return this.http.get(`${this.searchByDate}/${date}`);
  }

  getCommandeByCodeClient(code: string): Observable<any> {
    return this.http.get(`${this.searchByClient}/${code}`);
  }

  getCommandeBy2Dates(date1: any, date2: any): Observable<any> {
    return this.http.get(`${this.searchByTwoDate}/${date1}/${date2}`);
  }

  getNbrCommandesPayer(): Observable<any> {
    return this.http.get(`${this.nbrCommPayer}`);
  }

  getNbrCommandesEncours(): Observable<any> {
    return this.http.get(`${this.nbrCommEncrs}`);
  }

  getNbrCommandesRestant(): Observable<any> {
    return this.http.get(`${this.nbrCommRest}`);
  }

  getNbrCommandesWave(): Observable<any> {
    return this.http.get(`${this.nbrCommWave}`);
  }

  getNbrCommandesPayerToDay(): Observable<any> {
    return this.http.get(`${this.nbrCommPayerToDay}`);
  }

  getNbrCommandesEncoursToDay(): Observable<any> {
    return this.http.get(`${this.nbrCommEncrsToDay}`);
  }

  getNbrCommandesRestantToDay(): Observable<any> {
    return this.http.get(`${this.nbrCommRestToDay}`);
  }

  getNbrCommandesPayerByDate(date: any): Observable<any> {
    return this.http.get(`${this.nbrCommPayerByDate}/${date}`);
  }

  getNbrCommandesEncoursByDate(date: any): Observable<any> {
    return this.http.get(`${this.nbrCommEncrsByDate}/${date}`);
  }

  getNbrCommandesRestantByDate(date: any): Observable<any> {
    return this.http.get(`${this.nbrCommRestByDate}/${date}`);
  }

  getNbrCommandesPayerByClient(code: string): Observable<any> {
    return this.http.get(`${this.nbrCommPayerByClient}/${code}`);
  }

  getNbrCommandesEncoursByClient(code: string): Observable<any> {
    return this.http.get(`${this.nbrCommEncrsByClient}/${code}`);
  }

  getNbrCommandesRestantByClient(code: string): Observable<any> {
    return this.http.get(`${this.nbrCommRestByClient}/${code}`);
  }

  getNbrCommandesPayerBy2Date(date1: any, date2: any): Observable<any> {
    return this.http.get(`${this.nbrCommPayerBy2Date}/${date1}/${date2}`);
  }

  getNbrCommandesEncoursBy2Date(date1: any, date2: any): Observable<any> {
    return this.http.get(`${this.nbrCommEncrs2Date}/${date1}/${date2}`);
  }

  getNbrCommandesRestantBy2Date(date1: any, date2: any): Observable<any> {
    return this.http.get(`${this.nbrCommRestBy2Date}/${date1}/${date2}`);
  }

  getDetteToDay(): Observable<any> {
    return this.http.get(`${this.detteToDay}`);
  }

  searchDetteByClient(code: string): Observable<any> {
    return this.http.get(`${this.detteClient}/${code}`);
  }
  getDettes(): Observable<any> {
    return this.http.get(`${this.dettes}`);
  }

  getDetteByDate(date: any): Observable<any> {
    return this.http.get(`${this.searchDetteByDate}/${date}`);
  }

  sendFactureWhatsApp(numero: string) {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/send/facture/whatsapp/${numero}`);
  }

}
