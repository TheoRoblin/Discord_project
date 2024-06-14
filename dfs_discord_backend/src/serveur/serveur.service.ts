// src/cats/cats.service.ts
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Serveur, ServeurDocument} from './serveur.schema';
import {
    Utilisateur,
    UtilisateurDocument,
} from 'src/utilisateur/utilisateur.schema';

@Injectable()
export class ServeurService {
    constructor(
        @InjectModel(Serveur.name) private serveurModel: Model<ServeurDocument>,
        @InjectModel(Utilisateur.name)
        private utilisateurModel: Model<UtilisateurDocument>,
    ) {
    }

    async create(createdServeurDto: any, email: string): Promise<Serveur> {
        const user = await this.utilisateurModel.findOne({email})
        createdServeurDto.owner = user._id
        const createdServeur = new this.serveurModel(createdServeurDto);
        console.log(createdServeurDto)
        return createdServeur.save();
    }

    async findAllPublic(email:string): Promise<Serveur[]> {
        const utilisateur = await this.utilisateurModel.findOne({email});
        return this.serveurModel.find({public: true,blackList: {$ne: utilisateur._id.toString()}});
    }

    async blockUser(userIdBlock: string, serveurId: string, email: string): Promise<Serveur> {
        const user = await this.utilisateurModel.findOne({email})
        const ownerServer = await this.serveurModel.findById(serveurId)
        console.log(userIdBlock)
        if (user._id.toString() !== ownerServer.owner || user._id.toString() === userIdBlock) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }

        return this.serveurModel.findOneAndUpdate(
            {_id: serveurId},
            {$addToSet: {blackList: userIdBlock}},
            {new: true}
        )

    }

    async unblockUser(userIdBlock: string, serveurId: string, email: string): Promise<Serveur> {
        const user = await this.utilisateurModel.findOne({email})
        const ownerServer = await this.serveurModel.findById(serveurId)
        if (user._id.toString() !== ownerServer.owner || user._id.toString() === userIdBlock) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }

        return this.serveurModel.findOneAndUpdate(
            {_id: serveurId,},
            {$pull: {blackList: userIdBlock}},
            {new: true}
        )

    }

    async findAllServerOfUser(email: string): Promise<Serveur[]> {
        const utilisateur = await this.utilisateurModel.findOne({email});

        const serveurs = await this.serveurModel.find({
            _id: {$in: utilisateur.serveurs},
            blackList: {$ne: utilisateur._id.toString()}
        });

        return serveurs;
    }

}
