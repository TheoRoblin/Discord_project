import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Salon, SalonSchema } from './salon.schema';
import { SalonController } from './salon.controller';
import { SalonService } from './salon.service';
import {Serveur, ServeurSchema} from "../serveur/serveur.schema";
import {Utilisateur, UtilisateurSchema} from "../utilisateur/utilisateur.schema";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Salon.name, schema: SalonSchema },
      { name: Serveur.name, schema: ServeurSchema},
      { name: Utilisateur.name, schema: UtilisateurSchema}
    ]),
  ],
  providers: [SalonService],
  controllers: [SalonController],
})
export class SalonModule {}
