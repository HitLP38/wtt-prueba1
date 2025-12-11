import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType, NotificationStatus } from '@wtt/common';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  /**
   * Crea una notificación y la envía por WhatsApp
   */
  async sendNotification(
    type: NotificationType,
    phone: string,
    message: string,
    options?: {
      playerId?: string;
      teamId?: string;
      matchId?: string;
    },
  ): Promise<Notification> {
    // Crear notificación
    const notification = this.notificationRepository.create({
      type,
      phone,
      message,
      playerId: options?.playerId,
      teamId: options?.teamId,
      matchId: options?.matchId,
      status: NotificationStatus.PENDING,
      retryCount: 0,
    });

    await this.notificationRepository.save(notification);

    // Enviar WhatsApp (implementar integración real)
    try {
      await this.sendWhatsApp(phone, message);
      notification.status = NotificationStatus.SENT;
      notification.sentAt = new Date();
    } catch (error) {
      notification.status = NotificationStatus.FAILED;
      notification.errorMessage = error instanceof Error ? error.message : String(error);
      notification.retryCount = 1;
    }

    return await this.notificationRepository.save(notification);
  }

  /**
   * Envía notificación de llamado de partido
   */
  async sendMatchCall(
    phone: string,
    matchDetails: {
      eventName: string;
      round: string;
      opponent: string;
      tableNumber: number;
      callNumber: 1 | 2 | 3;
    },
    playerId?: string,
    teamId?: string,
    matchId?: string,
  ): Promise<Notification> {
    const callText = matchDetails.callNumber === 1 ? 'PRIMER' : 
                    matchDetails.callNumber === 2 ? 'SEGUNDO' : 'TERCER';

    const message = `🎾 ${callText} LLAMADO\n\n` +
      `Evento: ${matchDetails.eventName}\n` +
      `Ronda: ${matchDetails.round}\n` +
      `Contra: ${matchDetails.opponent}\n` +
      `Mesa: ${matchDetails.tableNumber}\n\n` +
      `Por favor presentarse inmediatamente.`;

    return this.sendNotification(
      NotificationType.MATCH_CALL,
      phone,
      message,
      { playerId, teamId, matchId },
    );
  }

  /**
   * Envía notificación de partido programado
   */
  async sendMatchScheduled(
    phone: string,
    matchDetails: {
      eventName: string;
      scheduledTime: Date;
      opponent: string;
      tableNumber: number;
    },
    playerId?: string,
    teamId?: string,
    matchId?: string,
  ): Promise<Notification> {
    const timeStr = matchDetails.scheduledTime.toLocaleString('es-PE', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const message = `📅 Partido Programado\n\n` +
      `Evento: ${matchDetails.eventName}\n` +
      `Fecha y Hora: ${timeStr}\n` +
      `Contra: ${matchDetails.opponent}\n` +
      `Mesa: ${matchDetails.tableNumber}\n\n` +
      `Por favor estar presente 15 minutos antes.`;

    return this.sendNotification(
      NotificationType.MATCH_SCHEDULED,
      phone,
      message,
      { playerId, teamId, matchId },
    );
  }

  /**
   * Integración WhatsApp (placeholder - implementar con Twilio o Meta API)
   */
  private async sendWhatsApp(phone: string, message: string): Promise<void> {
    // TODO: Implementar integración real con Twilio o Meta WhatsApp API
    console.log(`📱 Enviando WhatsApp a ${phone}: ${message}`);
    
    // Simulación - en producción usar:
    // - Twilio WhatsApp API
    // - Meta WhatsApp Cloud API
    // - O servicio de mensajería preferido
  }

  /**
   * Reintenta enviar notificación fallida
   */
  async retryFailedNotification(notificationId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error('Notificación no encontrada');
    }

    notification.retryCount = (notification.retryCount || 0) + 1;
    notification.status = NotificationStatus.PENDING;

    try {
      await this.sendWhatsApp(notification.phone, notification.message);
      notification.status = NotificationStatus.SENT;
      notification.sentAt = new Date();
    } catch (error) {
      notification.status = NotificationStatus.FAILED;
      notification.errorMessage = error instanceof Error ? error.message : String(error);
    }

    return await this.notificationRepository.save(notification);
  }
}

