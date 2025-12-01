import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TeamsService } from './teams.service';

@Controller()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @MessagePattern('create_team')
  createTeam(@Payload() data: any) {
    return this.teamsService.create(data);
  }

  @MessagePattern('get_team')
  getTeam(@Payload() data: { id: string }) {
    return this.teamsService.findOne(data.id);
  }

  @MessagePattern('create_lineup')
  createLineup(@Payload() data: any) {
    return this.teamsService.createLineup(data);
  }

  @MessagePattern('validate_lineup')
  validateLineup(@Payload() data: { lineupId: string }) {
    return this.teamsService.validateLineup(data.lineupId);
  }
}


