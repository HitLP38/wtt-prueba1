# 🎯 Sistema de Gestión de Mesas y Árbitros

## 📋 Características Principales

### 1. **Sistema de Autenticación y Permisos por Evento**
- Login de árbitros habilitado solo para eventos específicos
- Panel de administrador para gestionar permisos
- Bloqueo de mesa al iniciar sesión

### 2. **Panel de Administrador**
- Habilitar/deshabilitar árbitros por evento
- Configurar parámetros del evento (sets, categorías, etc.)
- Visualización de estado de todas las mesas
- Control de desdoblamiento de mesas

### 3. **Panel de Árbitro**
- Acceso solo a eventos habilitados
- Visualización de mesas asignadas
- Lista de partidos del árbitro
- Bloqueo de mesa al entrar

### 4. **Sistema de Estado de Mesas (Colores)**
- 🟢 **Verde**: Mesa disponible
- 🟡 **Amarillo**: Mesa en progreso
- 🔴 **Rojo**: Mesa atrasada
- ⚪ **Gris**: Mesa bloqueada/ocupada

### 5. **Sistema de Desdoblamiento**
- Detección automática de mesas atrasadas
- Asignación de mesa disponible a otra atrasada
- Partidos simultáneos de la misma serie

---

## 🗄️ Entidades Necesarias

### 1. **EventReferee (Permisos Árbitro-Evento)** - NUEVA

```typescript
@Entity('event_referees')
@Index(['eventId']) // Árbitros por evento
@Index(['refereeId']) // Eventos por árbitro
@Index(['eventId', 'refereeId'], { unique: true }) // Un permiso único
export class EventReferee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  refereeId: string;

  @Column({ default: true })
  isEnabled: boolean; // Habilitado para este evento

  @Column({ nullable: true })
  enabledBy: string; // ID del admin que habilitó

  @Column({ nullable: true })
  enabledAt: Date;

  @Column({ nullable: true })
  disabledAt: Date;

  @Column({ nullable: true, type: 'text' })
  notes: string; // Notas del administrador

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. **TableLock (Bloqueo de Mesa)** - NUEVA

```typescript
@Entity('table_locks')
@Index(['tableId']) // Bloqueos por mesa
@Index(['refereeId']) // Mesas bloqueadas por árbitro
@Index(['eventId']) // Bloqueos por evento
@Index(['isActive']) // Solo bloqueos activos
export class TableLock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  tableId: string;

  @Column()
  refereeId: string; // Árbitro que bloqueó la mesa

  @Column({ default: true })
  isActive: boolean; // Si el bloqueo está activo

  @Column()
  lockedAt: Date; // Fecha/hora del bloqueo

  @Column({ nullable: true })
  unlockedAt: Date; // Fecha/hora de desbloqueo

  @Column({ nullable: true, type: 'text' })
  reason: string; // Razón del bloqueo

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 3. **EventSettings (Configuración de Evento)** - NUEVA

```typescript
@Entity('event_settings')
@Index(['eventId'], { unique: true }) // Una configuración por evento
export class EventSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column({ default: 5 })
  defaultSetsToWin: number; // Al mejor de 5 (default)

  @Column({ default: 7 })
  finalSetsToWin: number; // Final al mejor de 7

  @Column({ type: 'jsonb', nullable: true })
  categorySettings: Record<string, {
    setsToWin: number;
    finalSetsToWin: number;
    exceptions?: string[];
  }>; // Excepciones por categoría

  @Column({ default: true })
  allowTableUnfolding: boolean; // Permitir desdoblamiento

  @Column({ default: 30 })
  matchDurationEstimate: number; // Duración estimada en minutos

  @Column({ default: 15 })
  tableChangeTime: number; // Tiempo entre partidos en la misma mesa

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 4. **TableStatus (Estado de Mesa)** - ENUM NUEVO

```typescript
// packages/common/src/constants/index.ts

export enum TableStatus {
  AVAILABLE = 'available',      // 🟢 Disponible
  IN_PROGRESS = 'in_progress',  // 🟡 En progreso
  DELAYED = 'delayed',          // 🔴 Atrasada
  LOCKED = 'locked',            // ⚪ Bloqueada
  MAINTENANCE = 'maintenance',  // ⚫ En mantenimiento
}

export enum TableStatusColor {
  AVAILABLE = '#4CAF50',        // Verde
  IN_PROGRESS = '#FFC107',      // Amarillo
  DELAYED = '#F44336',          // Rojo
  LOCKED = '#9E9E9E',           // Gris
  MAINTENANCE = '#424242',      // Negro
}
```

### 5. **Actualizar Table Entity**

```typescript
@Entity('tables')
export class Table {
  // ... campos existentes ...

  @Column({
    type: 'enum',
    enum: TableStatus,
    default: TableStatus.AVAILABLE,
  })
  status: TableStatus;

  @Column({ nullable: true })
  currentMatchId: string; // Partido actual

  @Column({ nullable: true })
  lockedByRefereeId: string; // Árbitro que tiene la mesa bloqueada

  @Column({ nullable: true })
  lastMatchCompletedAt: Date; // Última vez que terminó un partido

  @Column({ nullable: true })
  progressPercentage: number; // Progreso de la serie (0-100)
}
```

---

## 🔐 Sistema de Autenticación por Evento

### **Service: EventAccessService**

```typescript
// services/events/src/event-access.service.ts

@Injectable()
export class EventAccessService {
  constructor(
    @InjectRepository(EventReferee)
    private eventRefereeRepository: Repository<EventReferee>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  /**
   * Verifica si un árbitro tiene acceso a un evento
   */
  async hasAccess(refereeId: string, eventId: string): Promise<boolean> {
    const access = await this.eventRefereeRepository.findOne({
      where: {
        refereeId,
        eventId,
        isEnabled: true,
      },
    });

    return !!access;
  }

  /**
   * Habilita acceso de árbitro a evento (solo admin)
   */
  async enableAccess(
    eventId: string,
    refereeId: string,
    enabledBy: string,
    notes?: string,
  ): Promise<EventReferee> {
    const existing = await this.eventRefereeRepository.findOne({
      where: { eventId, refereeId },
    });

    if (existing) {
      existing.isEnabled = true;
      existing.enabledBy = enabledBy;
      existing.enabledAt = new Date();
      existing.notes = notes;
      return await this.eventRefereeRepository.save(existing);
    }

    const access = this.eventRefereeRepository.create({
      eventId,
      refereeId,
      isEnabled: true,
      enabledBy,
      enabledAt: new Date(),
      notes,
    });

    return await this.eventRefereeRepository.save(access);
  }

  /**
   * Deshabilita acceso (solo admin)
   */
  async disableAccess(
    eventId: string,
    refereeId: string,
    notes?: string,
  ): Promise<EventReferee> {
    const access = await this.eventRefereeRepository.findOne({
      where: { eventId, refereeId },
    });

    if (!access) {
      throw new NotFoundException('Acceso no encontrado');
    }

    access.isEnabled = false;
    access.disabledAt = new Date();
    access.notes = notes;

    return await this.eventRefereeRepository.save(access);
  }

  /**
   * Obtiene eventos accesibles para un árbitro
   */
  async getAccessibleEvents(refereeId: string): Promise<Event[]> {
    const accesses = await this.eventRefereeRepository.find({
      where: {
        refereeId,
        isEnabled: true,
      },
      relations: ['event'],
    });

    return accesses.map((access) => access.event).filter(Boolean);
  }
}
```

---

## 🔒 Sistema de Bloqueo de Mesas

### **Service: TableLockService**

```typescript
// services/matches/src/table-lock.service.ts

@Injectable()
export class TableLockService {
  constructor(
    @InjectRepository(TableLock)
    private tableLockRepository: Repository<TableLock>,
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
  ) {}

  /**
   * Bloquea una mesa (solo árbitro autorizado)
   */
  async lockTable(
    eventId: string,
    tableId: string,
    refereeId: string,
    reason?: string,
  ): Promise<TableLock> {
    // Verificar que no esté ya bloqueada
    const existingLock = await this.tableLockRepository.findOne({
      where: {
        tableId,
        isActive: true,
      },
    });

    if (existingLock && existingLock.refereeId !== refereeId) {
      throw new ConflictException('La mesa ya está bloqueada por otro árbitro');
    }

    // Crear o reactivar bloqueo
    if (existingLock) {
      existingLock.isActive = true;
      existingLock.lockedAt = new Date();
      existingLock.reason = reason;
      return await this.tableLockRepository.save(existingLock);
    }

    const lock = this.tableLockRepository.create({
      eventId,
      tableId,
      refereeId,
      isActive: true,
      lockedAt: new Date(),
      reason,
    });

    // Actualizar estado de la mesa
    await this.tableRepository.update(tableId, {
      status: TableStatus.LOCKED,
      lockedByRefereeId: refereeId,
    });

    return await this.tableLockRepository.save(lock);
  }

  /**
   * Desbloquea una mesa
   */
  async unlockTable(tableId: string, refereeId: string): Promise<void> {
    const lock = await this.tableLockRepository.findOne({
      where: {
        tableId,
        refereeId,
        isActive: true,
      },
    });

    if (!lock) {
      throw new NotFoundException('No hay bloqueo activo para esta mesa');
    }

    lock.isActive = false;
    lock.unlockedAt = new Date();
    await this.tableLockRepository.save(lock);

    // Actualizar estado de la mesa
    await this.tableRepository.update(tableId, {
      status: TableStatus.AVAILABLE,
      lockedByRefereeId: null,
    });
  }

  /**
   * Obtiene el bloqueo activo de una mesa
   */
  async getActiveLock(tableId: string): Promise<TableLock | null> {
    return await this.tableLockRepository.findOne({
      where: {
        tableId,
        isActive: true,
      },
      relations: ['referee'],
    });
  }
}
```

---

## 📊 Sistema de Estado de Mesas (Colores)

### **Service: TableStatusService**

```typescript
// services/matches/src/table-status.service.ts

@Injectable()
export class TableStatusService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(MatchAssignment)
    private assignmentRepository: Repository<MatchAssignment>,
  ) {}

  /**
   * Calcula el estado actual de una mesa
   */
  async calculateTableStatus(tableId: string): Promise<TableStatus> {
    const table = await this.tableRepository.findOne({
      where: { id: tableId },
    });

    if (!table) {
      throw new NotFoundException('Mesa no encontrada');
    }

    // Si está bloqueada
    if (table.lockedByRefereeId) {
      return TableStatus.LOCKED;
    }

    // Obtener partido actual
    const currentMatch = await this.matchRepository.findOne({
      where: {
        tableNumber: table.tableNumber,
        status: In([MatchStatus.IN_PROGRESS, MatchStatus.SCHEDULED]),
      },
      order: { scheduledTime: 'ASC' },
    });

    if (currentMatch?.status === MatchStatus.IN_PROGRESS) {
      // Verificar si está atrasada
      const isDelayed = await this.isTableDelayed(tableId);
      return isDelayed ? TableStatus.DELAYED : TableStatus.IN_PROGRESS;
    }

    return TableStatus.AVAILABLE;
  }

  /**
   * Verifica si una mesa está atrasada
   */
  private async isTableDelayed(tableId: string): Promise<boolean> {
    const table = await this.tableRepository.findOne({
      where: { id: tableId },
    });

    // Obtener todos los partidos de la serie en esta mesa
    const seriesMatches = await this.matchRepository.find({
      where: {
        tableNumber: table.tableNumber,
      },
      order: { scheduledTime: 'ASC' },
    });

    const totalMatches = seriesMatches.length;
    const completedMatches = seriesMatches.filter(
      (m) => m.status === MatchStatus.COMPLETED,
    ).length;

    const expectedProgress = this.calculateExpectedProgress(seriesMatches);
    const actualProgress = (completedMatches / totalMatches) * 100;

    // Si el progreso real está más de 20% por debajo del esperado, está atrasada
    return actualProgress < expectedProgress - 20;
  }

  /**
   * Calcula progreso esperado basado en tiempo
   */
  private calculateExpectedProgress(matches: Match[]): number {
    if (matches.length === 0) return 0;

    const now = new Date();
    const firstMatch = matches[0];
    const lastMatch = matches[matches.length - 1];

    if (!firstMatch.scheduledTime || !lastMatch.scheduledTime) return 0;

    const totalDuration = lastMatch.scheduledTime.getTime() - firstMatch.scheduledTime.getTime();
    const elapsed = now.getTime() - firstMatch.scheduledTime.getTime();

    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }

  /**
   * Actualiza estado de todas las mesas de un evento
   */
  async updateAllTableStatuses(eventId: string): Promise<void> {
    const tables = await this.tableRepository.find({
      where: { eventId },
    });

    for (const table of tables) {
      const status = await this.calculateTableStatus(table.id);
      await this.tableRepository.update(table.id, { status });
    }
  }

  /**
   * Obtiene color según estado
   */
  getStatusColor(status: TableStatus): string {
    return TableStatusColor[status];
  }
}
```

---

## 🔄 Sistema de Desdoblamiento

### **Service: TableUnfoldingService**

```typescript
// services/scheduler/src/table-unfolding.service.ts

@Injectable()
export class TableUnfoldingService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(MatchAssignment)
    private assignmentRepository: Repository<MatchAssignment>,
  ) {}

  /**
   * Detecta mesas atrasadas y sugiere desdoblamiento
   */
  async detectDelayedTables(eventId: string): Promise<{
    delayed: Table[];
    available: Table[];
    suggestions: UnfoldingSuggestion[];
  }> {
    const tables = await this.tableRepository.find({
      where: { eventId },
    });

    const delayed: Table[] = [];
    const available: Table[] = [];

    for (const table of tables) {
      const status = await this.calculateTableStatus(table.id);
      if (status === TableStatus.DELAYED) {
        delayed.push(table);
      } else if (status === TableStatus.AVAILABLE) {
        available.push(table);
      }
    }

    // Generar sugerencias de desdoblamiento
    const suggestions = this.generateUnfoldingSuggestions(delayed, available);

    return { delayed, available, suggestions };
  }

  /**
   * Genera sugerencias de desdoblamiento
   */
  private generateUnfoldingSuggestions(
    delayed: Table[],
    available: Table[],
  ): UnfoldingSuggestion[] {
    const suggestions: UnfoldingSuggestion[] = [];

    for (const delayedTable of delayed) {
      if (available.length === 0) break;

      const remainingMatches = this.getRemainingMatches(delayedTable.id);
      const availableTable = available.shift(); // Tomar primera disponible

      suggestions.push({
        delayedTableId: delayedTable.id,
        delayedTableNumber: delayedTable.tableNumber,
        helperTableId: availableTable.id,
        helperTableNumber: availableTable.tableNumber,
        matchesToShare: remainingMatches,
        estimatedTimeSaved: this.calculateTimeSaved(remainingMatches),
      });
    }

    return suggestions;
  }

  /**
   * Aplica desdoblamiento (asigna mesa disponible a mesa atrasada)
   */
  async applyUnfolding(
    delayedTableId: string,
    helperTableId: string,
    matchesToShare: Match[],
  ): Promise<void> {
    const delayedTable = await this.tableRepository.findOne({
      where: { id: delayedTableId },
    });

    const helperTable = await this.tableRepository.findOne({
      where: { id: helperTableId },
    });

    if (!delayedTable || !helperTable) {
      throw new NotFoundException('Mesa no encontrada');
    }

    // Dividir partidos entre las dos mesas
    const half = Math.ceil(matchesToShare.length / 2);

    for (let i = 0; i < matchesToShare.length; i++) {
      const match = matchesToShare[i];
      const targetTable = i < half ? delayedTable : helperTable;

      // Actualizar asignación
      await this.assignmentRepository.update(
        { matchId: match.id },
        {
          tableId: targetTable.id,
        },
      );

      await this.matchRepository.update(match.id, {
        tableNumber: targetTable.tableNumber,
      });
    }

    // Actualizar estado de mesas
    await this.tableRepository.update(delayedTableId, {
      status: TableStatus.IN_PROGRESS,
    });

    await this.tableRepository.update(helperTableId, {
      status: TableStatus.IN_PROGRESS,
    });
  }

  /**
   * Obtiene partidos pendientes de una mesa
   */
  private async getRemainingMatches(tableId: string): Promise<Match[]> {
    const table = await this.tableRepository.findOne({
      where: { id: tableId },
    });

    return await this.matchRepository.find({
      where: {
        tableNumber: table.tableNumber,
        status: In([MatchStatus.SCHEDULED, MatchStatus.IN_PROGRESS]),
      },
      order: { scheduledTime: 'ASC' },
    });
  }

  /**
   * Calcula tiempo ahorrado con desdoblamiento
   */
  private calculateTimeSaved(matches: Match[]): number {
    // Estimar tiempo total de partidos pendientes
    return matches.reduce((total, match) => {
      return total + (match.estimatedDuration || 30);
    }, 0);
  }
}
```

---

## 👨‍💼 Panel de Administrador

### **Endpoints**

```typescript
// services/admin/src/admin.controller.ts

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly eventAccessService: EventAccessService,
    private readonly tableStatusService: TableStatusService,
    private readonly unfoldingService: TableUnfoldingService,
    private readonly eventSettingsService: EventSettingsService,
  ) {}

  /**
   * Dashboard principal
   */
  @Get('dashboard')
  async getDashboard(@Query('eventId') eventId: string) {
    const tables = await this.tableRepository.find({ where: { eventId } });
    const statuses = await Promise.all(
      tables.map((t) => this.tableStatusService.calculateTableStatus(t.id)),
    );

    return {
      tables: tables.map((t, i) => ({
        ...t,
        status: statuses[i],
        color: this.tableStatusService.getStatusColor(statuses[i]),
      })),
      statistics: {
        available: statuses.filter((s) => s === TableStatus.AVAILABLE).length,
        inProgress: statuses.filter((s) => s === TableStatus.IN_PROGRESS).length,
        delayed: statuses.filter((s) => s === TableStatus.DELAYED).length,
        locked: statuses.filter((s) => s === TableStatus.LOCKED).length,
      },
    };
  }

  /**
   * Gestionar acceso de árbitros a eventos
   */
  @Get('events/:eventId/referees')
  async getEventReferees(@Param('eventId') eventId: string) {
    return this.eventAccessService.getEventReferees(eventId);
  }

  @Post('events/:eventId/referees/:refereeId/enable')
  async enableReferee(
    @Param('eventId') eventId: string,
    @Param('refereeId') refereeId: string,
    @Body() body: { notes?: string },
    @User() admin: any,
  ) {
    return this.eventAccessService.enableAccess(
      eventId,
      refereeId,
      admin.id,
      body.notes,
    );
  }

  @Post('events/:eventId/referees/:refereeId/disable')
  async disableReferee(
    @Param('eventId') eventId: string,
    @Param('refereeId') refereeId: string,
    @Body() body: { notes?: string },
  ) {
    return this.eventAccessService.disableAccess(eventId, refereeId, body.notes);
  }

  /**
   * Configuración de evento (sets, etc.)
   */
  @Get('events/:eventId/settings')
  async getEventSettings(@Param('eventId') eventId: string) {
    return this.eventSettingsService.getSettings(eventId);
  }

  @Patch('events/:eventId/settings')
  async updateEventSettings(
    @Param('eventId') eventId: string,
    @Body() settings: UpdateEventSettingsDto,
  ) {
    return this.eventSettingsService.updateSettings(eventId, settings);
  }

  /**
   * Detectar y sugerir desdoblamiento
   */
  @Get('events/:eventId/unfolding')
  async getUnfoldingSuggestions(@Param('eventId') eventId: string) {
    return this.unfoldingService.detectDelayedTables(eventId);
  }

  @Post('events/:eventId/unfolding/apply')
  async applyUnfolding(
    @Param('eventId') eventId: string,
    @Body() body: ApplyUnfoldingDto,
  ) {
    return this.unfoldingService.applyUnfolding(
      body.delayedTableId,
      body.helperTableId,
      body.matchesToShare,
    );
  }
}
```

---

## 👨‍⚖️ Panel de Árbitro (Actualizado)

### **Endpoints**

```typescript
// services/referees/src/referees.controller.ts (EXTENDER)

@Controller('referees')
export class RefereesController {
  // ... métodos existentes ...

  /**
   * Lista de eventos accesibles para el árbitro
   */
  @Get(':id/events')
  @UseGuards(AuthGuard, RefereeGuard)
  async getAccessibleEvents(@Param('id') id: string) {
    return this.eventAccessService.getAccessibleEvents(id);
  }

  /**
   * Panel principal del árbitro para un evento específico
   */
  @Get(':id/events/:eventId/panel')
  @UseGuards(AuthGuard, RefereeGuard)
  async getEventPanel(
    @Param('id') id: string,
    @Param('eventId') eventId: string,
  ) {
    // Verificar acceso
    const hasAccess = await this.eventAccessService.hasAccess(id, eventId);
    if (!hasAccess) {
      throw new ForbiddenException('No tienes acceso a este evento');
    }

    // Obtener mesas asignadas
    const assignments = await this.assignmentRepository.find({
      where: { refereeId: id },
      relations: ['match', 'table'],
    });

    // Obtener mesas del evento con estado
    const tables = await this.tableRepository.find({
      where: { eventId },
    });

    const tablesWithStatus = await Promise.all(
      tables.map(async (table) => {
        const status = await this.tableStatusService.calculateTableStatus(table.id);
        const isLocked = table.lockedByRefereeId === id;
        return {
          ...table,
          status,
          color: this.tableStatusService.getStatusColor(status),
          isLocked,
        };
      }),
    );

    return {
      event: await this.eventRepository.findOne({ where: { id: eventId } }),
      tables: tablesWithStatus,
      assignments: assignments.map((a) => ({
        ...a,
        match: a.match,
        table: a.table,
      })),
    };
  }

  /**
   * Bloquear mesa
   */
  @Post(':id/tables/:tableId/lock')
  @UseGuards(AuthGuard, RefereeGuard)
  async lockTable(
    @Param('id') id: string,
    @Param('tableId') tableId: string,
    @Body() body: { eventId: string; reason?: string },
  ) {
    // Verificar acceso al evento
    const hasAccess = await this.eventAccessService.hasAccess(id, body.eventId);
    if (!hasAccess) {
      throw new ForbiddenException('No tienes acceso a este evento');
    }

    return this.tableLockService.lockTable(body.eventId, tableId, id, body.reason);
  }

  /**
   * Desbloquear mesa
   */
  @Post(':id/tables/:tableId/unlock')
  @UseGuards(AuthGuard, RefereeGuard)
  async unlockTable(
    @Param('id') id: string,
    @Param('tableId') tableId: string,
  ) {
    return this.tableLockService.unlockTable(tableId, id);
  }

  /**
   * Partidos del árbitro en un evento
   */
  @Get(':id/events/:eventId/matches')
  @UseGuards(AuthGuard, RefereeGuard)
  async getEventMatches(
    @Param('id') id: string,
    @Param('eventId') eventId: string,
    @Query('status') status?: MatchStatus,
  ) {
    const hasAccess = await this.eventAccessService.hasAccess(id, eventId);
    if (!hasAccess) {
      throw new ForbiddenException('No tienes acceso a este evento');
    }

    const assignments = await this.assignmentRepository.find({
      where: {
        refereeId: id,
        match: {
          eventId,
          ...(status && { status }),
        },
      },
      relations: ['match', 'table'],
      order: { scheduledTime: 'ASC' },
    });

    return assignments.map((a) => ({
      ...a.match,
      table: a.table,
      assignment: a,
    }));
  }
}
```

---

## 🎨 Frontend: Componentes Necesarios

### 1. **Panel de Administrador**
- `AdminDashboard.tsx` - Vista general con colores
- `EventSettingsForm.tsx` - Configurar sets, categorías
- `RefereeAccessManager.tsx` - Habilitar/deshabilitar árbitros
- `TableStatusGrid.tsx` - Grid de mesas con colores
- `UnfoldingSuggestions.tsx` - Sugerencias de desdoblamiento

### 2. **Panel de Árbitro**
- `RefereeEventSelector.tsx` - Seleccionar evento
- `RefereeTablePanel.tsx` - Mesas con colores y bloqueo
- `RefereeMatchesList.tsx` - Lista de partidos
- `TableLockButton.tsx` - Botón de bloquear/desbloquear

---

## 📊 Flujo Completo

### **1. Administrador habilita árbitro**
```
Admin → Panel Admin → Eventos → Árbitros → Habilitar
→ EventReferee creado con isEnabled=true
```

### **2. Árbitro inicia sesión**
```
Árbitro → Login → Verifica permisos → Muestra eventos accesibles
```

### **3. Árbitro selecciona evento**
```
Árbitro → Selecciona evento → Verifica acceso → Muestra panel
```

### **4. Árbitro bloquea mesa**
```
Árbitro → Ve mesas disponibles → Clic en "Bloquear mesa"
→ TableLock creado → Table.status = LOCKED
```

### **5. Sistema detecta atraso**
```
Cron job → Calcula progreso → Detecta atraso
→ Table.status = DELAYED → Notifica admin
```

### **6. Desdoblamiento**
```
Admin → Ve sugerencias → Aplica desdoblamiento
→ Partidos redistribuidos → Dos mesas trabajando simultáneamente
```

---

Este sistema cubre todos los requerimientos. ¿Quieres que empiece a implementarlo?

