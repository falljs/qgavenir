import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Fonction pour nettoyer le stockage local
  clearLocalStorage(exceptions: string[]) {
    const keysToRemove = [];
    // Récupérez toutes les clés dans le stockage local
    for (let i = 0; i < localStorage.length; i++) {
      const key: any = localStorage.key(i);
      // Vérifiez si la clé n'est pas dans la liste des exceptions
      if (!exceptions.includes(key)) {
        // Si la clé n'est pas dans les exceptions, ajoutez-la à la liste des clés à supprimer
        keysToRemove.push(key);
      }
    }
    // Supprimez toutes les clés qui ne sont pas dans la liste des exceptions
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  clearExecptException() {
    const exceptions = ['user', 'token', 'payment', 'setting', 'settingIconeStock', 'settingPayments', 'allPermissions'];
    this.clearLocalStorage(exceptions);
  }

  rootClient() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  rootAccueil() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  rootDevis() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  rootCompte() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  rootFrais() {
    localStorage.removeItem('bon');
    localStorage.removeItem('compte');
    localStorage.removeItem('rapport');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  routRapport() {
    localStorage.removeItem('bon');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  rootDossier() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  rootProduit() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  rootTicket() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  rootUser() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  rootVente() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  rootCaisse() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneCommande');
  }

  rootSetting() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneCommande');
  }

  rootBon() {
    localStorage.removeItem('bon');
    localStorage.removeItem('frais');
    localStorage.removeItem('compte');
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('listBon');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneCommande');
    localStorage.removeItem('compte');
  }

  rootConvertBon() {
    localStorage.removeItem('dossier');
    localStorage.removeItem('client');
    localStorage.removeItem('devis');
    localStorage.removeItem('bon');
    localStorage.removeItem('commande');
    localStorage.removeItem('setting');
    localStorage.removeItem('listBon');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('listLigneDevis');
    localStorage.removeItem('listLigneBon');
    localStorage.removeItem('listReglement');
    localStorage.removeItem('listLigneCommande');
    localStorage.removeItem('compte');
  }


}
