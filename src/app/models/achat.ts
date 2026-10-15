import { LigneAchat } from "./ligne-achat";
import { LigneReglementAchat } from "./ligne-reglement-achat";

export class Achat {
  id!: any;
  numero!: any;
  numDos!: any;
  date_achat!: any;
  heure_achat!: any;
  totht!: any;
  reduction!: any;
  restant!: any;
  versement!: any;
  net!: any;
  tottva!: any;
  auteur!: any;
  id_fn!: any;
  nom_fn!: any;
  code_fn!: any;
  numero_fn!: any;
  email_fn!: any;
  totttc!: any;
  numCheck!: any;
  totalFrais!: any;
  ligneAchat: Array<LigneAchat> = [];
  reglementAchat: Array<LigneReglementAchat> = [];
}
