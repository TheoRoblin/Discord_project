// src/cats/cats.service.ts
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import {
  Utilisateur,
  UtilisateurDocument,
} from '../utilisateur/utilisateur.schema';
import {SalonService} from "../salon/salon.service";
import {Salon, SalonDocument} from "../salon/salon.schema";
import {Serveur, ServeurDocument} from "../serveur/serveur.schema";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Utilisateur.name) private utilisateurModel: Model<UtilisateurDocument>,
    @InjectModel(Salon.name) private salonModel: Model<SalonDocument>,
    @InjectModel(Serveur.name) private serveurModel: Model<ServeurDocument>
  ){}

  async create(
    createdMessageDto: any,
    email: string,
  ): Promise<MessageDocument> {
    const user = await this.utilisateurModel.findOne({email})
    const nouveauMessage = {
      contenu: createdMessageDto.contenu,
      userId: user._id,
      salonId: createdMessageDto.salonId,
      createdAt: Date.now(),
    };

    if (!user) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const channel = await this.salonModel.findOne({_id: createdMessageDto.salonId});
    const server = await this.serveurModel.findOne({_id: channel.serveurId});

    if (server.blackList.find(value => value === user._id.toString())) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const createdSalon = new this.messageModel(nouveauMessage);
    return createdSalon.save();
  }

  async findAllMessageOfSalon(salonId: string): Promise<MessageDocument[]> {
    return this.messageModel
      .find({ salonId })
      .populate({
      path: "userId", select: {
          urlAvatar: 1,
          prenom: 1,
          nom: 1,
      }
    }).sort({ createdAt: 1 });

  }
}
