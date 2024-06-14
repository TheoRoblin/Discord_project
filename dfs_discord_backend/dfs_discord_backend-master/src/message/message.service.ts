// src/cats/cats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import {
  Utilisateur,
  UtilisateurDocument,
} from '../utilisateur/utilisateur.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Utilisateur.name) private utilisateurModel: Model<UtilisateurDocument>
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
