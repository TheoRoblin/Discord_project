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
  async create(@Body() createServeurDto: any) {
    console.log(createServeurDto)
    return this.salonService.create(createServeurDto);
  }

  @Get(':id')
  async getSalonById(@Param('id') id: string){
    return this.salonService.findAllSalonOfServeur(id);
  }

}
