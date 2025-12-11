# 🗄️ Esquema Completo de Base de Datos y Backend - Sistema ITTF

## 📋 Índice
1. [Entidades Principales](#entidades-principales)
2. [Sistema de Distribución Automática](#sistema-de-distribución-automática)
3. [CRUDs Requeridos](#cruds-requeridos)
4. [Panel de Árbitros](#panel-de-árbitros)
5. [Rankings](#rankings)
6. [Migraciones y Setup](#migraciones-y-setup)

---

## 📊 Entidades Principales

### 1. **Referee (Árbitro)** - NUEVA
```typescript
@Entity('referees')
@Index(['clerkId']) // Login con Clerk
@Index(['isActive']) // Árbitros activos
export class Referee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  clerkId: string; // ID de Clerk para autenticación

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  licenseNumber: string; // Licencia ITTF

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  matchesAssigned: number; // Contador para distribución

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. **Table (Mesa)** - NUEVA
```typescript
@Entity('tables')
@Index(['eventId']) // Mesas por evento
@Index(['isActive']) // Mesas disponibles
@Index(['eventId', 'isActive']) // Consultas combinadas
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  tableNumber: number; // Número de mesa (1, 2, 3, ...)

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  location: string; // "Sala A", "Sala B", etc.

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 3. **Player (Jugador)** - NUEVA
```typescript
@Entity('players')
@Index(['clerkId']) // Login con Clerk
@Index(['licenseNumber']) // Búsqueda por licencia
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  clerkId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  licenseNumber: string; // Licencia ITTF

  @Column({ nullable: true })
  club: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ default: 0 })
  currentRanking: number; // Ranking actual (actualizado dinámicamente)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 4. **TeamPlayer (Jugador en Equipo)** - NUEVA
```typescript
@Entity('team_players')
@Index(['teamId']) // Jugadores por equipo
@Index(['playerId']) // Equipos de un jugador
@Index(['teamId', 'playerId'], { unique: true }) // Evitar duplicados
export class TeamPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teamId: string;

  @Column()
  playerId: string;

  @Column()
  condition: string; // 'alumno', 'egresado', 'FDPTM', 'externo', 'otros'

  @Column({ default: false })
  isReserve: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 5. **Set (Set de Partido)** - NUEVA
```typescript
@Entity('sets')
@Index(['matchId']) // Sets por partido
@Index(['matchId', 'setNumber'], { unique: true }) // Un set por número en cada partido
export class Set {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  setNumber: number; // 1, 2, 3, 4, 5, 6, 7

  @Column({ default: 0 })
  player1Score: number; // Score del jugador/equipo 1

  @Column({ default: 0 })
  player2Score: number; // Score del jugador/equipo 2

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 6. **MatchIncident (Incidencia de Partido)** - NUEVA
```typescript
@Entity('match_incidents')
@Index(['matchId']) // Incidentes por partido
@Index(['type']) // Filtrar por tipo
export class MatchIncident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column({
    type: 'enum',
    enum: ['yellow_card', 'red_card', 'timeout', 'side_change', 'other'],
  })
  type: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column()
  timestamp: Date;

  @Column({ nullable: true })
  refereeId: string; // Árbitro que registró la incidencia

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 7. **News (Noticias)** - NUEVA
```typescript
@Entity('news')
@Index(['eventId']) // Noticias por evento
@Index(['isPublished']) // Solo publicadas
@Index(['publishedAt']) // Orden cronológico
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  eventId: string; // Si es noticia de un evento específico

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  authorId: string; // ID del usuario que creó la noticia

  @Column({ default: false })
  isPublished: boolean;

  @Column({ nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 8. **Ranking (Ranking)** - NUEVA
```typescript
@Entity('rankings')
@Index(['playerId']) // Rankings de un jugador
@Index(['eventId']) // Rankings por evento
@Index(['category']) // Rankings por categoría
@Index(['eventId', 'category']) // Rankings combinados
export class Ranking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  playerId: string;

  @Column({ nullable: true })
  eventId: string; // Si es ranking de evento específico

  @Column()
  category: string; // 'masculino', 'femenino', 'mixto', etc.

  @Column()
  position: number; // Posición en el ranking

  @Column({ default: 0 })
  points: number; // Puntos del ranking

  @Column({ nullable: true })
  previousPosition: number; // Posición anterior (para comparación)

  @Column({ nullable: true })
  calculatedAt: Date; // Fecha de cálculo

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 9. **EventCategory (Categoría de Evento)** - NUEVA
```typescript
@Entity('event_categories')
@Index(['eventId']) // Categorías por evento
export class EventCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  name: string; // 'Masculino', 'Femenino', 'Mixto', etc.

  @Column()
  division: string; // 'masculino' | 'femenino' | 'mixto'

  @Column({ nullable: true })
  maxPlayers: number;

  @Column({ nullable: true })
  maxTeams: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 10. **MatchAssignment (Asignación de Partido)** - NUEVA
```typescript
@Entity('match_assignments')
@Index(['matchId'], { unique: true }) // Un partido solo puede estar asignado una vez
@Index(['tableId']) // Partidos por mesa
@Index(['refereeId']) // Partidos por árbitro
@Index(['scheduledTime']) // Orden por horario
export class MatchAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  tableId: string;

  @Column()
  refereeId: string;

  @Column()
  scheduledTime: Date; // Horario programado

  @Column({ nullable: true })
  actualStartTime: Date; // Horario real de inicio

  @Column({ nullable: true })
  priority: number; // Prioridad (1 = más alta)

  @Column({ default: false })
  isConfirmed: boolean; // Confirmado por árbitro

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🔄 Actualización de Entidades Existentes

### **Match Entity** - ACTUALIZAR
```typescript
@Entity('matches')
// ... índices existentes ...
export class Match {
  // ... campos existentes ...

  // NUEVOS CAMPOS
  @Column({ nullable: true })
  categoryId: string; // Relación con EventCategory

  @Column({ nullable: true })
  scheduledTime: Date; // Horario programado (redundante con MatchAssignment, pero útil para queries)

  @Column({ nullable: true })
  estimatedDuration: number; // Duración estimada en minutos

  @Column({ nullable: true })
  actualDuration: number; // Duración real en minutos

  @Column({ nullable: true, type: 'jsonb' })
  metadata: Record<string, any>; // Datos adicionales (formato ITTF, etc.)
}
```

### **Event Entity** - ACTUALIZAR
```typescript
@Entity('events')
// ... índices existentes ...
export class Event {
  // ... campos existentes ...

  // NUEVOS CAMPOS
  @Column({ nullable: true })
  venue: string; // Lugar del evento

  @Column({ nullable: true })
  address: string; // Dirección completa

  @Column({ nullable: true })
  registrationDeadline: Date; // Fecha límite de inscripción

  @Column({ nullable: true })
  drawDate: Date; // Fecha del sorteo

  @Column({ nullable: true, type: 'decimal' })
  prizeMoney: number; // Premio en efectivo

  @Column({ default: 0 })
  maxTables: number; // Número máximo de mesas disponibles

  @Column({ nullable: true, type: 'jsonb' })
  settings: Record<string, any>; // Configuraciones del evento
}
```

### **Team Entity** - ACTUALIZAR
```typescript
@Entity('teams')
// ... índices existentes ...
export class Team {
  // ... campos existentes ...

  // NUEVOS CAMPOS
  @Column({ nullable: true })
  categoryId: string; // Categoría del equipo

  @Column({ default: 0 })
  membersCount: number; // Número de integrantes (calculado)

  @Column({ nullable: true, type: 'text' })
  notes: string; // Notas adicionales del equipo
}
```

---

## 🤖 Sistema de Distribución Automática de Partidos

### **Service: MatchDistributionService**

```typescript
// services/scheduler/src/match-distribution.service.ts

@Injectable()
export class MatchDistributionService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(Referee)
    private refereeRepository: Repository<Referee>,
    @InjectRepository(MatchAssignment)
    private assignmentRepository: Repository<MatchAssignment>,
  ) {}

  /**
   * Distribuye automáticamente partidos a mesas y árbitros
   * Algoritmo basado en ITTF:
   * 1. Prioriza partidos por ronda (finales primero)
   * 2. Balancea carga entre árbitros
   * 3. Asigna mesas disponibles
   * 4. Considera horarios y duraciones estimadas
   */
  async distributeMatches(
    eventId: string,
    options?: {
      startTime?: Date;
      maxConcurrentMatches?: number;
    },
  ): Promise<MatchAssignment[]> {
    // 1. Obtener partidos pendientes
    const pendingMatches = await this.matchRepository.find({
      where: {
        eventId,
        status: MatchStatus.SCHEDULED,
      },
      order: {
        round: 'ASC', // Finales primero
      },
    });

    // 2. Obtener mesas disponibles
    const availableTables = await this.tableRepository.find({
      where: {
        eventId,
        isActive: true,
      },
      order: {
        tableNumber: 'ASC',
      },
    });

    // 3. Obtener árbitros activos
    const activeReferees = await this.refereeRepository.find({
      where: {
        isActive: true,
      },
      order: {
        matchesAssigned: 'ASC', // Balancear carga
      },
    });

    if (availableTables.length === 0 || activeReferees.length === 0) {
      throw new Error('No hay mesas o árbitros disponibles');
    }

    // 4. Algoritmo de distribución
    const assignments: MatchAssignment[] = [];
    const maxConcurrent = options?.maxConcurrentMatches || availableTables.length;
    let currentTime = options?.startTime || new Date();
    let tableIndex = 0;
    let refereeIndex = 0;

    for (const match of pendingMatches) {
      // Asignar mesa (round-robin)
      const table = availableTables[tableIndex % availableTables.length];
      tableIndex++;

      // Asignar árbitro (balanceado)
      const referee = activeReferees[refereeIndex % activeReferees.length];
      refereeIndex++;

      // Crear asignación
      const assignment = this.assignmentRepository.create({
        matchId: match.id,
        tableId: table.id,
        refereeId: referee.id,
        scheduledTime: currentTime,
        priority: this.calculatePriority(match.round),
        isConfirmed: false,
      });

      await this.assignmentRepository.save(assignment);

      // Actualizar contador de árbitro
      await this.refereeRepository.increment({ id: referee.id }, 'matchesAssigned', 1);

      // Actualizar match
      await this.matchRepository.update(match.id, {
        tableNumber: table.tableNumber,
        refereeId: referee.id,
        scheduledTime: currentTime,
      });

      assignments.push(assignment);

      // Avanzar tiempo (estimación de duración)
      const estimatedDuration = match.estimatedDuration || 30; // Default 30 min
      currentTime = new Date(currentTime.getTime() + estimatedDuration * 60000);
    }

    return assignments;
  }

  /**
   * Calcula prioridad según ronda (ITTF)
   */
  private calculatePriority(round: string): number {
    const priorities: Record<string, number> = {
      'final': 10,
      'semifinal': 8,
      'quarterfinal': 6,
      'round_of_16': 4,
      'round_of_32': 3,
      'round_of_64': 2,
      'group_stage': 1,
    };
    return priorities[round.toLowerCase()] || 1;
  }

  /**
   * Redistribuye partidos si hay cambios (árbitro enfermo, mesa rota, etc.)
   */
  async redistributeMatch(
    matchId: string,
    newTableId?: string,
    newRefereeId?: string,
  ): Promise<MatchAssignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { matchId },
    });

    if (!assignment) {
      throw new Error('Asignación no encontrada');
    }

    // Reducir contador del árbitro anterior
    if (assignment.refereeId) {
      await this.refereeRepository.decrement(
        { id: assignment.refereeId },
        'matchesAssigned',
        1,
      );
    }

    // Actualizar asignación
    if (newTableId) assignment.tableId = newTableId;
    if (newRefereeId) {
      assignment.refereeId = newRefereeId;
      await this.refereeRepository.increment({ id: newRefereeId }, 'matchesAssigned', 1);
    }

    return await this.assignmentRepository.save(assignment);
  }
}
```

---

## 📝 CRUDs Requeridos

### **1. Referees CRUD**

```typescript
// services/referees/src/referees.controller.ts

@Controller('referees')
export class RefereesController {
  constructor(private readonly refereesService: RefereesService) {}

  @Get()
  findAll(@Query() filters: RefereeFiltersDto) {
    return this.refereesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refereesService.findOne(id);
  }

  @Post()
  create(@Body() createRefereeDto: CreateRefereeDto) {
    return this.refereesService.create(createRefereeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRefereeDto: UpdateRefereeDto) {
    return this.refereesService.update(id, updateRefereeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.refereesService.remove(id);
  }

  @Get(':id/matches')
  getMatches(@Param('id') id: string, @Query() filters: MatchFiltersDto) {
    return this.refereesService.getMatches(id, filters);
  }

  @Get(':id/assignments')
  getAssignments(@Param('id') id: string) {
    return this.refereesService.getAssignments(id);
  }
}
```

### **2. Tables CRUD**

```typescript
// services/matches/src/tables.controller.ts

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  findAll(@Query('eventId') eventId?: string) {
    return this.tablesService.findAll(eventId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(id);
  }

  @Get(':id/matches')
  getMatches(@Param('id') id: string, @Query('status') status?: MatchStatus) {
    return this.tablesService.getMatches(id, status);
  }

  @Get(':id/availability')
  getAvailability(@Param('id') id: string, @Query('date') date: string) {
    return this.tablesService.getAvailability(id, new Date(date));
  }
}
```

### **3. Players CRUD**

```typescript
// services/players/src/players.controller.ts

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(@Query() filters: PlayerFiltersDto) {
    return this.playersService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(id);
  }

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Get(':id/teams')
  getTeams(@Param('id') id: string) {
    return this.playersService.getTeams(id);
  }

  @Get(':id/ranking')
  getRanking(@Param('id') id: string, @Query('category') category?: string) {
    return this.playersService.getRanking(id, category);
  }
}
```

### **4. Teams CRUD (Actualizar)**

```typescript
// services/teams/src/teams.controller.ts (EXTENDER)

@Get(':id/players')
getPlayers(@Param('id') id: string) {
  return this.teamsService.getPlayers(id);
}

@Post(':id/players')
addPlayer(@Param('id') id: string, @Body() addPlayerDto: AddPlayerToTeamDto) {
  return this.teamsService.addPlayer(id, addPlayerDto);
}

@Delete(':id/players/:playerId')
removePlayer(@Param('id') id: string, @Param('playerId') playerId: string) {
  return this.teamsService.removePlayer(id, playerId);
}

@Get(':id/form')
getFormData(@Param('id') id: string) {
  return this.teamsService.getFormData(id);
}
```

### **5. News CRUD**

```typescript
// services/news/src/news.controller.ts

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  findAll(@Query() filters: NewsFiltersDto) {
    return this.newsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard) // Solo admins
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }

  @Post(':id/publish')
  @UseGuards(AuthGuard)
  publish(@Param('id') id: string) {
    return this.newsService.publish(id);
  }
}
```

### **6. Rankings CRUD**

```typescript
// services/rankings/src/rankings.controller.ts

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  findAll(@Query() filters: RankingFiltersDto) {
    return this.rankingsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rankingsService.findOne(id);
  }

  @Post('calculate')
  @UseGuards(AuthGuard) // Solo admins
  calculate(@Body() calculateDto: CalculateRankingDto) {
    return this.rankingsService.calculate(calculateDto);
  }

  @Get('player/:playerId')
  getPlayerRanking(@Param('playerId') playerId: string, @Query('category') category?: string) {
    return this.rankingsService.getPlayerRanking(playerId, category);
  }
}
```

---

## 👨‍⚖️ Panel de Árbitros

### **Endpoints Específicos para Árbitros**

```typescript
// services/referees/src/referees.controller.ts (EXTENDER)

@Controller('referees')
export class RefereesController {
  // ... CRUDs existentes ...

  /**
   * Panel principal del árbitro
   * Muestra todos sus partidos asignados con información completa
   */
  @Get(':id/panel')
  @UseGuards(AuthGuard, RefereeGuard) // Solo árbitros autenticados
  getPanel(@Param('id') id: string, @Query() filters: PanelFiltersDto) {
    return this.refereesService.getPanel(id, filters);
  }

  /**
   * Partidos activos del árbitro (en progreso o próximos)
   */
  @Get(':id/active-matches')
  getActiveMatches(@Param('id') id: string) {
    return this.refereesService.getActiveMatches(id);
  }

  /**
   * Confirmar asignación de partido
   */
  @Post(':id/assignments/:assignmentId/confirm')
  confirmAssignment(
    @Param('id') id: string,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.refereesService.confirmAssignment(id, assignmentId);
  }

  /**
   * Obtener información completa de un partido asignado
   * Incluye jugadores, equipos, formularios, historial
   */
  @Get(':id/matches/:matchId/details')
  getMatchDetails(@Param('id') id: string, @Param('matchId') matchId: string) {
    return this.refereesService.getMatchDetails(id, matchId);
  }

  /**
   * Obtener formulario completo de un equipo
   */
  @Get(':id/matches/:matchId/team/:teamId/form')
  getTeamForm(
    @Param('id') id: string,
    @Param('matchId') matchId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.refereesService.getTeamForm(id, matchId, teamId);
  }

  /**
   * Obtener jugadores de un equipo
   */
  @Get(':id/matches/:matchId/team/:teamId/players')
  getTeamPlayers(
    @Param('id') id: string,
    @Param('matchId') matchId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.refereesService.getTeamPlayers(id, matchId, teamId);
  }
}
```

### **Service: RefereesService - Métodos del Panel**

```typescript
// services/referees/src/referees.service.ts

@Injectable()
export class RefereesService {
  // ... métodos CRUD existentes ...

  /**
   * Obtiene el panel completo del árbitro
   */
  async getPanel(refereeId: string, filters: PanelFiltersDto) {
    const referee = await this.refereeRepository.findOne({ where: { id: refereeId } });

    if (!referee) {
      throw new NotFoundException('Árbitro no encontrado');
    }

    // Obtener asignaciones
    const assignments = await this.assignmentRepository.find({
      where: { refereeId },
      relations: ['match', 'table'],
      order: { scheduledTime: 'ASC' },
    });

    // Obtener partidos con detalles
    const matches = await Promise.all(
      assignments.map(async (assignment) => {
        const match = await this.matchRepository.findOne({
          where: { id: assignment.matchId },
          relations: ['team1', 'team2'],
        });

        // Obtener jugadores/equipos
        let team1Data = null;
        let team2Data = null;

        if (match.team1Id) {
          team1Data = await this.getTeamCompleteData(match.team1Id);
        }

        if (match.team2Id) {
          team2Data = await this.getTeamCompleteData(match.team2Id);
        }

        return {
          match,
          assignment,
          team1: team1Data,
          team2: team2Data,
          table: assignment.table,
        };
      }),
    );

    return {
      referee,
      matches,
      totalMatches: matches.length,
      activeMatches: matches.filter((m) => m.match.status === MatchStatus.IN_PROGRESS).length,
      completedMatches: matches.filter((m) => m.match.status === MatchStatus.COMPLETED).length,
    };
  }

  /**
   * Obtiene información completa de un equipo (jugadores, formulario, etc.)
   */
  private async getTeamCompleteData(teamId: string) {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });

    if (!team) return null;

    // Obtener jugadores
    const teamPlayers = await this.teamPlayerRepository.find({
      where: { teamId },
      relations: ['player'],
    });

    // Obtener formulario (alineación oficial si existe)
    const lineup = await this.teamLineupRepository.findOne({
      where: { teamId },
      order: { createdAt: 'DESC' },
    });

    return {
      team,
      players: teamPlayers.map((tp) => ({
        ...tp.player,
        condition: tp.condition,
        isReserve: tp.isReserve,
      })),
      lineup,
    };
  }
}
```

---

## 🏆 Rankings

### **Service: RankingsService - Cálculo ITTF**

```typescript
// services/rankings/src/rankings.service.ts

@Injectable()
export class RankingsService {
  /**
   * Calcula rankings según sistema ITTF
   * Basado en puntos de partidos ganados y posición final
   */
  async calculateRankings(eventId: string, category: string) {
    // 1. Obtener todos los partidos completados del evento
    const completedMatches = await this.matchRepository.find({
      where: {
        eventId,
        status: MatchStatus.COMPLETED,
      },
      relations: ['sets'],
    });

    // 2. Calcular puntos por jugador/equipo
    const pointsMap = new Map<string, number>();

    for (const match of completedMatches) {
      // Sistema de puntos ITTF
      const points = this.calculateMatchPoints(match);

      if (match.matchType === MatchType.TEAM) {
        if (match.team1Id) {
          const currentPoints = pointsMap.get(match.team1Id) || 0;
          pointsMap.set(match.team1Id, currentPoints + points.winner);
        }
        if (match.team2Id) {
          const currentPoints = pointsMap.get(match.team2Id) || 0;
          pointsMap.set(match.team2Id, currentPoints + points.loser);
        }
      } else {
        // Singles/Doubles
        if (match.player1Id) {
          const currentPoints = pointsMap.get(match.player1Id) || 0;
          pointsMap.set(match.player1Id, currentPoints + points.winner);
        }
        if (match.player2Id) {
          const currentPoints = pointsMap.get(match.player2Id) || 0;
          pointsMap.set(match.player2Id, currentPoints + points.loser);
        }
      }
    }

    // 3. Ordenar por puntos
    const sortedEntries = Array.from(pointsMap.entries()).sort((a, b) => b[1] - a[1]);

    // 4. Crear/actualizar rankings
    const rankings: Ranking[] = [];
    for (let i = 0; i < sortedEntries.length; i++) {
      const [entityId, points] = sortedEntries[i];
      const position = i + 1;

      // Obtener ranking anterior
      const previousRanking = await this.rankingRepository.findOne({
        where: { eventId, category, playerId: entityId },
      });

      const ranking = await this.rankingRepository.save({
        id: previousRanking?.id,
        playerId: entityId,
        eventId,
        category,
        position,
        points,
        previousPosition: previousRanking?.position || null,
        calculatedAt: new Date(),
      });

      rankings.push(ranking);
    }

    return rankings;
  }

  /**
   * Calcula puntos según resultado del partido (sistema ITTF)
   */
  private calculateMatchPoints(match: Match): { winner: number; loser: number } {
    // Sistema simplificado ITTF
    // En producción, usar fórmulas oficiales ITTF
    const setsWon = this.getSetsWon(match);
    const totalSets = match.sets.length;

    const winnerPoints = 10 * (setsWon.winner / totalSets);
    const loserPoints = 5 * (setsWon.loser / totalSets);

    return {
      winner: Math.round(winnerPoints),
      loser: Math.round(loserPoints),
    };
  }

  private getSetsWon(match: Match): { winner: number; loser: number } {
    let winner = 0;
    let loser = 0;

    for (const set of match.sets) {
      if (set.player1Score > set.player2Score) {
        winner++;
      } else {
        loser++;
      }
    }

    return { winner, loser };
  }
}
```

---

## 🔧 Migraciones y Setup

### **1. Crear Nuevo Servicio: Referees**

```bash
# Crear servicio de árbitros
cd WTT/services
nest generate service referees
nest generate controller referees referees

# Crear entidad
touch referees/src/entities/referee.entity.ts
```

### **2. Crear Nuevo Servicio: Tables**

```bash
# Crear servicio de mesas
nest generate service tables matches
nest generate controller tables matches
```

### **3. Crear Nuevo Servicio: Players**

```bash
nest generate service players
nest generate controller players players
```

### **4. Crear Nuevo Servicio: Scheduler (si no existe)**

```bash
nest generate service scheduler
nest generate controller scheduler scheduler
```

### **5. Configurar TypeORM en cada servicio**

```typescript
// Ejemplo: services/referees/src/app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referee } from './entities/referee.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || 'wtt_user',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'wtt_db',
        entities: [Referee],
        synchronize: process.env.NODE_ENV !== 'production', // Solo en desarrollo
      }),
    }),
    TypeOrmModule.forFeature([Referee]),
  ],
  // ...
})
```

---

## 📊 Queries Importantes para Visualización

### **1. Dashboard de Árbitro**
```sql
-- Partidos del árbitro con detalles
SELECT 
  m.id,
  m.round,
  m.status,
  m.scheduled_time,
  t.table_number,
  t1.name as team1_name,
  t2.name as team2_name
FROM matches m
LEFT JOIN match_assignments ma ON ma.match_id = m.id
LEFT JOIN tables t ON t.id = ma.table_id
LEFT JOIN teams t1 ON t1.id = m.team1_id
LEFT JOIN teams t2 ON t2.id = m.team2_id
WHERE ma.referee_id = :refereeId
ORDER BY m.scheduled_time ASC;
```

### **2. Formulario Completo de Equipo**
```sql
-- Jugadores del equipo con condiciones
SELECT 
  tp.condition,
  p.first_name,
  p.last_name,
  p.license_number,
  p.club
FROM team_players tp
JOIN players p ON p.id = tp.player_id
WHERE tp.team_id = :teamId;
```

### **3. Rankings Actualizados**
```sql
-- Top 10 rankings por categoría
SELECT 
  r.position,
  p.first_name,
  p.last_name,
  r.points,
  r.previous_position
FROM rankings r
JOIN players p ON p.id = r.player_id
WHERE r.event_id = :eventId 
  AND r.category = :category
ORDER BY r.position ASC
LIMIT 10;
```

---

## 🚀 Próximos Pasos

1. ✅ **Crear entidades faltantes** (Referee, Table, Player, etc.)
2. ✅ **Implementar servicios de distribución automática**
3. ✅ **Crear CRUDs completos**
4. ✅ **Implementar panel de árbitros**
5. ✅ **Sistema de rankings**
6. ⏳ **Conectar frontend con backend**
7. ⏳ **WebSockets para actualizaciones en tiempo real**
8. ⏳ **Testing completo**

---

Este documento es la base completa para configurar el backend en tu VPS. ¿Quieres que implemente alguna parte específica primero?

