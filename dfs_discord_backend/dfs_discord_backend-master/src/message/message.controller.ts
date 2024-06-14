import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request, Param,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/auth.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() requete) {
    console.log(requete.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createdMessageDto: any, @Request() request) {
    const email = request.user.sub;
    return this.messageService.create(createdMessageDto, email);
  }

  @Get(':id')
  async getMessageBySalon(@Param('id') id: string){
    return this.messageService.findAllMessageOfSalon(id);
  }

}
