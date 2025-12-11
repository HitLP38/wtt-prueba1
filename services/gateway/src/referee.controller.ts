import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RefereeService } from './referee.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('referee')
@UseGuards(AuthGuard, RolesGuard)
@Roles('REFEREE')
export class RefereeController {
  constructor(private readonly refereeService: RefereeService) {}

  /**
   * Obtener eventos accesibles para el árbitro
   */
  @Get('events')
  async getAccessibleEvents(@Query('refereeId') refereeId: string) {
    return this.refereeService.getAccessibleEvents(refereeId);
  }

  /**
   * Obtener partidos asignados a un árbitro en un evento
   */
  @Get('events/:eventId/matches')
  async getAssignedMatches(
    @Param('eventId') eventId: string,
    @Query('refereeId') refereeId: string,
  ) {
    return this.refereeService.getAssignedMatches(eventId, refereeId);
  }

  /**
   * Bloquear una mesa
   */
  @Post('tables/:tableId/lock')
  async lockTable(
    @Param('tableId') tableId: string,
    @Body() body: { eventId: string; refereeId: string; reason?: string },
  ) {
    return this.refereeService.lockTable(
      body.eventId,
      tableId,
      body.refereeId,
      body.reason,
    );
  }

  /**
   * Desbloquear una mesa
   */
  @Post('tables/:tableId/unlock')
  async unlockTable(
    @Param('tableId') tableId: string,
    @Body() body: { refereeId: string },
  ) {
    return this.refereeService.unlockTable(tableId, body.refereeId);
  }

  /**
   * Iniciar partido
   */
  @Post('matches/:matchId/start')
  async startMatch(@Param('matchId') matchId: string) {
    return this.refereeService.startMatch(matchId);
  }

  /**
   * Obtener estado del marcador
   */
  @Get('matches/:matchId/score')
  async getMatchScore(@Param('matchId') matchId: string) {
    return this.refereeService.getMatchScore(matchId);
  }

  /**
   * Actualizar puntuación de un set
   */
  @Patch('matches/:matchId/sets/:setNumber')
  async updateSetScore(
    @Param('matchId') matchId: string,
    @Param('setNumber') setNumber: number,
    @Body() body: { player1Score: number; player2Score: number },
  ) {
    return this.refereeService.updateSetScore(
      matchId,
      setNumber,
      body.player1Score,
      body.player2Score,
    );
  }

  /**
   * Finalizar partido
   */
  @Post('matches/:matchId/complete')
  async completeMatch(@Param('matchId') matchId: string) {
    return this.refereeService.completeMatch(matchId);
  }
}

