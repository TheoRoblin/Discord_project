import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Serveur } from 'src/serveur/serveur.schema';

export type UtilisateurDocument = Utilisateur & Document;

@Schema()
export class Utilisateur {

  _id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  urlAvatar: string;

  @Prop()
  serveurs: Serveur[];
}

export const UtilisateurSchema = SchemaFactory.createForClass(Utilisateur);
