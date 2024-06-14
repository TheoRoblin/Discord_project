// src/cats/cats.service.ts
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalonDocument, Salon } from './salon.schema';
import {Serveur, ServeurDocument} from "../serveur/serveur.schema";
import {Utilisateur, UtilisateurDocument} from "../utilisateur/utilisateur.schema";


@Injectable()
export class SalonService {
  constructor(
    @InjectModel(Salon.name) private salonModel: Model<SalonDocument>,
    @InjectModel(Serveur.name) private serveurModel: Model<ServeurDocument>,
    @InjectModel(Utilisateur.name) private utilisateurModel: Model<UtilisateurDocument>
  ) {}

  async create(createdSalonDto: any, email:string): Promise<Salon> {

    const user = await this.utilisateurModel.findOne({email});
    const server = await this.serveurModel.findOne({_id: createdSalonDto.serveurId});

    if (server.blackList.find(value => value === user._id.toString())) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const createdSalon = new this.salonModel(createdSalonDto);
    console.log(createdSalon);
    return createdSalon.save();
  }

  async findAllSalonOfServeur(serveurId: string, email: string): Promise<Salon[]> {
    const user = await this.utilisateurModel.findOne({email});
    const server = await this.serveurModel.findOne({_id: serveurId});

    if (server.blackList.some(value => value === user._id.toString())) {
      console.log("coucou")
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.salonModel.find({serveurId})
  }

}
