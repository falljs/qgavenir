export interface Notification {
  id: number;               // ID de la notification
  user_id: number | null;   // ID de l'utilisateur (ou null)
  order_id: number | null;  // ID de la commande associée (ou null)
  title: string;            // Titre de la notification
  message: string;          // Message de la notification
  is_read: boolean;         // Si la notification est lue ou non
  created_at: string;       // Date de création (en format ISO)
  updated_at: string;       // Date de mise à jour (en format ISO)
}
