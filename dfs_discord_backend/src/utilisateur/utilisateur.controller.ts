import {Body, Controller, Get, Param, Post, Request, UseGuards} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth.guard';
import {ServeurService} from "../serveur/serveur.service";

@Controller()
export class UtilisateurController {
  constructor(
    private readonly utilisateurService: UtilisateurService,
    private readonly jwtService: JwtService,
  ) {}

  // @Get()
  // findAll() {
  //   return this.utilisateurService.findAll();
  // }

  @Post('inscription')
  async inscription(@Body() createUtilisateurDto: any) {
    //TODO : vérifier les donnée (regles mot de passe, email unique ...)
    console.log(createUtilisateurDto);
    return this.utilisateurService.create(createUtilisateurDto);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  async getServersOfUser(@Param("id") id:string) {
    return this.utilisateurService.findAllUsersOfServer(id);
  }

  @Post('login')
  async create(@Body() utilisateurDto: any) {
    const utilisateur =
      await this.utilisateurService.getByEmailAndClearPassword(
        utilisateurDto.email,
        utilisateurDto.password,
      );


    const payload = {
      sub: utilisateur.email,
      userId: utilisateur._id,
    };

    return await this.jwtService.signAsync(payload);
  }

  @Post('rejoindre-serveur')
  @UseGuards(AuthGuard)
  async rejoindreServeur(
    @Body() serveurArejoindreDto: any,
    @Request() requete,
  ) {
    const email = requete.user.sub;

    return this.utilisateurService.rejoindreServeur(
      email,
      serveurArejoindreDto._id,
    );
  }
}
