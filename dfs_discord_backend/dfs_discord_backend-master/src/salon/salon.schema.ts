import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SalonDocument = Salon & Document;

@Schema()
export class Salon {
  @Prop()
  nom: string;

  @Prop()
  serveurId: string;
}

export const SalonSchema = SchemaFactory.createForClass(Salon);
