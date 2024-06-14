import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request, Param,
} from '@nestjs/common';
import { SalonService } from './salon.service';
import { AuthGuard } from 'src/auth.guard';

@Controller('salon')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() requete) {
    console.log(requete.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createServeurDto: any, @Request() request) {
    const email = request.user.sub;
    return this.salonService.create(createServeurDto, email);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getSalonById(@Param('id') id: string, @Request() request){
    const email = request.user.sub;
    return this.salonService.findAllSalonOfServeur(id, email);
  }

}
