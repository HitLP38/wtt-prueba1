import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MatchesService } from './matches.service';
import { TableStatusService } from './services/table-status.service';

@Controller()
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly tableStatusService: TableStatusService,
  ) {}

  @MessagePattern('create_match')
  createMatch(@Payload() data: any) {
    return this.matchesService.create(data);
  }

  @MessagePattern('get_match')
  getMatch(@Payload() data: { id: string }) {
    return this.matchesService.findOne(data.id);
  }

  @MessagePattern('assign_table')
  assignTable(
    @Payload() data: { matchId: string; tableNumber: number; organizationId: string },
  ) {
    return this.matchesService.assignTable(
      data.matchId,
      data.tableNumber,
      data.organizationId,
    );
  }

  @MessagePattern('start_match')
  startMatch(
    @Payload() data: { matchId: string; refereeId: string; organizationId: string },
  ) {
    return this.matchesService.startMatch(
      data.matchId,
      data.refereeId,
      data.organizationId,
    );
  }

  @MessagePattern('get_event_tables')
  getEventTables(@Payload() data: { eventId: string; organizationId: string }) {
    return this.tableStatusService.getEventTables(data.eventId, data.organizationId);
  }

  @MessagePattern('get_event_matches')
  getEventMatches(@Payload() data: { eventId: string; organizationId: string }) {
    return this.matchesService.findByEvent(data.eventId, data.organizationId);
  }
}

