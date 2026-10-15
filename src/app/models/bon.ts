import { LigneBon } from "./ligne-bon";

export class Bon {
  id! :any;
  numero! :any;
  numDos! : any;
  date_bon! : any;
  heure_bon! : any;
  valid! : boolean;
  etat! : boolean;
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
  benefice! : any;
  ligneBon :Array<LigneBon> =[];
  isselected!: boolean;
 
 }
