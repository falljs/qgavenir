import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private produits = `${this.url}/produit/produits`;
  private categories = `${this.url}/produit/categories`;
  private produit = `${this.url}/produit/produit`;
  private export = `${this.url}/produit/export`;
  private created = `${this.url}/produit/create`;
  private import = `${this.url}/produit/import`;
  private update = `${this.url}/produit/update`;
  private produitByCode = `${this.url}/produit/codeProduit`;
  private deleted = `${this.url}/produit/delete`;
  private search = `${this.url}/produit/search`;
  private produitByCategory = `${this.url}/produit/searchBycategory`;
  private qtyOn = `${this.url}/produit/searchByQtyOn`;
  private qtyOff = `${this.url}/produit/searchByQtyOff`;
  private qtyAlert = `${this.url}/produit/searchByQtyAlert`;
  private prodsBycodeFn = `${this.url}/produit/produitsBycodeFn`;

  private entrepot_uns = `${this.url}/produit/entrepot_uns`;
  private entrepot_update = `${this.url}/produit/entrepot_update`;
  private entrepot_delete = `${this.url}/produit/entrepot_delete`;


  private entrepot_deuxS = `${this.url}/produit/entrepot_deuxS`;
  private entrepot_update_deux = `${this.url}/produit/entrepot_update_deux`;
  private entrepot_delete_deux = `${this.url}/produit/entrepot_delete_deux`;

  private searchByEntrepot = `${this.url}/produit/searchEntrepot`;

  private create_mouvement_depot = `${this.url}/produit/create_mouvement_depot`;
  private update_mouvement_depot = `${this.url}/produit/update_mouvement_depot`;
  private create_mouvement_stock = `${this.url}/produit/create_mouvement_stock`;
  private update_mouvement_stock = `${this.url}/produit/update_mouvement_stock`;
  private mouvements = `${this.url}/produit/mouvements`;
  private mouvement = `${this.url}/produit/mouvement`;
  private mouvement_supprimer_stock = `${this.url}/produit/mouvement_supprimer_stock`;
  private mouvement_annuler_stock = `${this.url}/produit/mouvement_annuler_stock`;
  private mouvement_supprimer_depot = `${this.url}/produit/mouvement_supprimer_depot`;
  private mouvement_annuler_depot = `${this.url}/produit/mouvement_annuler_depot`;
  private getLigneMouvementById = `${this.url}/produit/getLigneMouvement`;

  private maxid = `${this.url}/produit/maxId`;

  listProduits!: any[];
  listLigneMouvement: any = [];
  listMouvements: any = [];

  mouvemen!: any;

  listProduitsEntrepot_uns!: any[];

  maxId: any;

  constructor(private http: HttpClient) { }

  getAllEntrepotUn() {
    return this.http.get<any[]>(`${this.url}/produit/entrepot_uns`);
  }

  createEntrepot(data: { id_produit: number; stock: number; mode: 'validated' | 'free' }) {
    return this.http.post(`${this.url}/produit/entrepot_create`, data);
  }

  getMaxId(): Observable<any> {
    return this.http.get(`${this.maxid}`);
  }

  getAllProduct(): Observable<any> {
    return this.http.get(this.produits);
  }

  exportAllProduct(): Observable<any> {
    return this.http.get(this.export, { responseType: 'blob' });
  }

  getAllCategories(): Observable<any> {
    return this.http.get(this.categories);
  }

  getProductByCategory(category: any): Observable<Object> {
    return this.http.get(`${this.produitByCategory}/${category}`);
  }

  getProductByQtyOn(): Observable<any> {
    return this.http.get(this.qtyOn);
  }

  getProductByQtyOff(): Observable<any> {
    return this.http.get(this.qtyOff);
  }

  getProductByQtyAlert(): Observable<any> {
    return this.http.get(this.qtyAlert);
  }

  createProduit(data: any) {
    return this.http.post(`${this.created}`, data);
  }

  importProduit(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.import}`, formData);
  }

  updateProduit(data: any) {
    return this.http.post(`${this.update}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/${id}`, { responseType: 'text' });
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

  getProduit(id: number): Observable<Object> {
    return this.http.get(`${this.produit}/${id}`);
  }

  getProduitByCode(code: any): Observable<Object> {
    return this.http.get(`${this.produitByCode}/${code}`);
  }

  searchProduit(search: any): Observable<Object> {
    return this.http.get(`${this.search}/${search}`);
  }

  getProduitsByCodeFn(code: any): Observable<any> {
    return this.http.get(`${this.prodsBycodeFn}/${code}`);
  }

  /**
   * Les methodes pour depot1
   * 
   **/

  getEntrepot_uns(): Observable<any> {
    return this.http.get(this.entrepot_uns);
  }

  update_produitsEntrepot(produit: any) {
    return this.http.post(
      this.url + '/produit/entrepot_update',
      produit
    );
  }

  delete_produitsEntrepot(id: number): Observable<any> {
    return this.http.get(`${this.entrepot_delete}/${id}`, { responseType: 'text' });
  }

  /**
   * Les methodes pour depot1
   * 
   **/

  getEntrepot_deuxS(): Observable<any> {
    return this.http.get(this.entrepot_deuxS);
  }

  update_produitsEntrepot_deux(data: any) {
    return this.http.post(`${this.entrepot_update_deux}`, data);
  }

  delete_produitsEntrepot_deux(id: number): Observable<any> {
    return this.http.get(`${this.entrepot_delete_deux}/${id}`, { responseType: 'text' });
  }

  searchEntrepot(search: any): Observable<Object> {
    return this.http.get(`${this.searchByEntrepot}/${search}`);
  }

  /**
   * Les methodes pour mouvement
   * 
   **/

  onCreate_mouvement_depot(data: any) {
    return this.http.post(`${this.create_mouvement_depot}`, data);
  }

  onUdapte_mouvement_depot(data: any) {
    return this.http.post(`${this.update_mouvement_depot}`, data);
  }

  onCreate_mouvement_stock(data: any) {
    return this.http.post(`${this.create_mouvement_stock}`, data);
  }

  onUdapte_mouvement_stock(data: any) {
    return this.http.post(`${this.update_mouvement_stock}`, data);
  }

  getMouvements(): Observable<any> {
    return this.http.get(this.mouvements);
  }

  getMouvement(numero: number): Observable<Object> {
    return this.http.get(`${this.mouvement}/${numero}`);
  }

  deleteMouvementStock(numero: number): Observable<Object> {
    return this.http.get(`${this.mouvement_supprimer_stock}/${numero}`);
  }

  cancelMouvementStock(numero: number): Observable<Object> {
    return this.http.get(`${this.mouvement_annuler_stock}/${numero}`);
  }

  deleteMouvementDepot(numero: number): Observable<Object> {
    return this.http.get(`${this.mouvement_supprimer_depot}/${numero}`);
  }

  cancelMouvementDepot(numero: number): Observable<Object> {
    return this.http.get(`${this.mouvement_annuler_depot}/${numero}`);
  }

  getLigneMouvement(numero: number): Observable<Object> {
    return this.http.get(`${this.getLigneMouvementById}/${numero}`);
  }

}
