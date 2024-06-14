// src/cats/cats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalonDocument, Salon } from './salon.schema';
import {Serveur, ServeurDocument} from "../serveur/serveur.schema";


@Injectable()
export class SalonService {
  constructor(
    @InjectModel(Salon.name) private salonModel: Model<SalonDocument>,
    @InjectModel(Serveur.name) private serveurModel: Model<ServeurDocument>,
  ) {}

  async create(createdSalonDto: any): Promise<Salon> {
    console.log(createdSalonDto);
    const createdSalon = new this.salonModel(createdSalonDto);
    console.log(createdSalon);
    return createdSalon.save();
  }

  async findAllSalonOfServeur(serveurId: string): Promise<Salon[]> {
    return this.salonModel.find({serveurId})
  }

}
