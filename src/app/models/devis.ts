import { LigneDevis } from "./ligne-devis";

export class Devis {
  id! :any;
  numero! :any;
  numDos! : any;
  date_devis! : any;
  heure_devis! : any;
  type! : any;
  totht! : any;
  reduction! : any;
  net!:any;
  tottva! : any;
  auteur!:any;
  id_client!:any;
  nom_client!:any;
  code_client!:any;
  numero_client!:any;
  email_client!:any;
  totttc! : any;
  ligneDevis :Array<LigneDevis> =[];
 }
