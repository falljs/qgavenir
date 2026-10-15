import { LigneCommande } from "./ligne-commande";
import { LigneReglement } from "./ligne-reglement";

export class Commande {
  id! :any;
  numero! :any;
  numDos! : any;
  date_comm! : any;
  heure_comm! : any;
  valid! : boolean;
  etat! : boolean;
  totht! : any;
  reduction! : any;
  restant! : any;
  versement! : any;
  net!:any;
  tottva! : any;
  auteur!:any;
  id_client!:any;
  nom_client!:any;
  code_client!:any;
  numero_client!:any;
  email_client!:any;
  totttc! : any;
  benefice! : any;
  ligneCommande :Array<LigneCommande> =[];
  reglement :Array<LigneReglement> =[];
 }
