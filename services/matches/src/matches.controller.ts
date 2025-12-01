import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MatchesService } from './matches.service';

@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @MessagePattern('create_match')
  createMatch(@Payload() data: any) {
    return this.matchesService.create(data);
  }

  @MessagePattern('get_match')
  getMatch(@Payload() data: { id: string }) {
    return this.matchesService.findOne(data.id);
  }

  @MessagePattern('assign_table')
  assignTable(@Payload() data: { matchId: string; tableNumber: number }) {
    return this.matchesService.assignTable(data.matchId, data.tableNumber);
  }

  @MessagePattern('start_match')
  startMatch(@Payload() data: { matchId: string; refereeId: string }) {
    return this.matchesService.startMatch(data.matchId, data.refereeId);
  }
}


