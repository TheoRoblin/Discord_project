import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request, Param, Put,
} from '@nestjs/common';
import { ServeurService } from './serveur.service';
import { AuthGuard } from 'src/auth.guard';

@Controller('serveur')
export class ServeurController {
  constructor(private readonly serveurService: ServeurService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() requete) {
    const email = requete.user.sub
    return this.serveurService.findAllPublic(email);
  }

  @Get('/possede')
  @UseGuards(AuthGuard)
  findAllServerOfUser(@Request() requete) {
    return this.serveurService.findAllServerOfUser(requete.user.sub);
  }

  @Put("block/:id")
  @UseGuards(AuthGuard)
  getBlockList(@Param("id" )serveurId: string , @Body() blockUser: any, @Request() request ){
    const emailOwner = request.user.sub
    console.log(blockUser.userId)
    return this.serveurService.blockUser(blockUser.userId, serveurId, emailOwner)
  }
  @Put("unblock/:id")
  @UseGuards(AuthGuard)
  getUnblockList(@Param("id" )serveurId: string , @Body() blockUser: any, @Request() request ){
    const emailOwner = request.user.sub
    return this.serveurService.unblockUser(blockUser, serveurId, emailOwner)
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createServeurDto: any, @Request() request) {
    const email = request.user.sub;
    return this.serveurService.create(createServeurDto, email);
  }
}
