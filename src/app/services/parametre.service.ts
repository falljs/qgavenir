import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ParametreService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";
  private urlVider = "https://www.qg-avenir.iconestock.com/server/public/api/automatique";
  public urlLogo = "https://www.qg-avenir.iconestock.com/server/public/parametre/";
  public urlSetting = "https://iconestock.com/api/setting/iconestock"
  public urlEssaie = "https://iconestock.com/api/wave/payer_essaie/essaie"

  private setting = `${this.url}/parametre/setting`;
  private updated = `${this.url}/parametre/update`;
  private maintenance = `${this.url}/parametre/maintenance`;
  private logo = `${this.url}/parametre/logo`;
  private models = `${this.url}/parametre/models`;
  private update_model = `${this.url}/parametre/update_model`;
  private payment = `${this.url}/wave/checkout`;
  private credit = `${this.url}/parametre/credit`;
  private updatePay = `${this.url}/parametre/updatePayment`;
  private vider = `${this.urlVider}/vider`;

  date_paye: any = '';
  payement: any = 0;
  counter: any = 0;
  difference: any = 0;
  reste_jour: any = 0;
  checkModalCredit: any = 0;

  constructor(private http: HttpClient) { }

  getGarantie() {
    return this.http.get<any>(
      this.url + '/parametre/garantie'
    );
  }

  updateGarantie(data: any) {
    return this.http.put<any>(
      this.url + '/parametre/garantie',
      data
    );
  }

  getSetting(): Observable<Object> {
    return this.http.get(`${this.setting}`);
  }

  getSettingIconeStock(): Observable<Object> {
    return this.http.get(`${this.urlSetting}`);
  }

  getEssaieIconeStock(reference: string): Observable<Object> {
    return this.http.get(`${this.urlEssaie}/${reference}`);
  }

  updateData(data: Object): Observable<Object> {
    return this.http.post(`${this.updated}`, data);
  }

  setMaintenance(data: Object): Observable<Object> {
    return this.http.post(`${this.maintenance}`, data);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

  updateLogo(formData: FormData): Observable<any> {
    return this.http.post(`${this.logo}`, formData);
  }

  onUpdate_model(id: number): Observable<Object> {
    return this.http.get(`${this.update_model}/${id}`);
  }

  getModels(): Observable<any> {
    return this.http.get(`${this.models}`);
  }

  getPayment(): Observable<Object> {
    return this.http.get(`${this.payment}`);
  }

  updateCredit(): Observable<Object> {
    return this.http.get(`${this.credit}`);
  }

  updatePayment(): Observable<Object> {
    return this.http.get(`${this.updatePay}`);
  }

  updatePaie() {
    this.updatePayment().subscribe((data) => {
    });
  }

  viderCommande(): Observable<any> {
    return this.http.get(`${this.vider}/commande`, { responseType: 'text' });
  }

  viderDevis(): Observable<any> {
    return this.http.get(`${this.vider}/devis`, { responseType: 'text' });
  }

  viderBon(): Observable<any> {
    return this.http.get(`${this.vider}/bon`, { responseType: 'text' });
  }

  viderAchat(): Observable<any> {
    return this.http.get(`${this.vider}/achat`, { responseType: 'text' });
  }

  viderBonAchat(): Observable<any> {
    return this.http.get(`${this.vider}/bonAchat`, { responseType: 'text' });
  }

  viderProduit(): Observable<any> {
    return this.http.get(`${this.vider}/produit`, { responseType: 'text' });
  }

  viderMouvement(): Observable<any> {
    return this.http.get(`${this.vider}/mouvement`, { responseType: 'text' });
  }

  viderInventaire(): Observable<any> {
    return this.http.get(`${this.vider}/inventaire`, { responseType: 'text' });
  }

  viderCompte(): Observable<any> {
    return this.http.get(`${this.vider}/compte`, { responseType: 'text' });
  }

  viderUser(): Observable<any> {
    return this.http.get(`${this.vider}/utilisateur`, { responseType: 'text' });
  }

}
