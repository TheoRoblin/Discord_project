import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Utilisateur } from '../utilisateur/utilisateur.schema';

@Schema()
export class Message extends Document {
  @Prop()
  contenu: string;

  @Prop({ type: Types.ObjectId, ref: 'Utilisateur' })
  userId: Utilisateur;

  @Prop()
  salonId: string;

  @Prop()
  createdAt: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export class MessageDocument {
}