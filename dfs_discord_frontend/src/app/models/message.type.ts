export declare type Message = {
  _id: string;
  contenu: String,
  salonId: String,
  createdAt: Date,
  userId: UserId,
};

declare type UserId = {
  _id: string,
  prenom: string,
  nom: string,
  urlAvatar: string,
}
