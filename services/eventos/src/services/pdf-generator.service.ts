// @ts-nocheck
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventProspect, ProspectStatus } from '../entities/event-prospect.entity';
import { Event } from '../entities/event.entity';
import { EventConfigService } from './event-config.service';
import { CategoryService } from './category.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';

@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);
  private fonts: any;

  constructor(
    @InjectRepository(EventProspect)
    private prospectRepository: Repository<EventProspect>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private eventConfigService: EventConfigService,
    private categoryService: CategoryService,
  ) {
    // Configurar fuentes para PDFMake (Roboto está incluida por defecto)
    this.fonts = {
      Roboto: {
        normal: 'node_modules/pdfmake/build/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'node_modules/pdfmake/build/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'node_modules/pdfmake/build/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'node_modules/pdfmake/build/fonts/Roboto/Roboto-MediumItalic.ttf',
      },
    };
  }

  /**
   * Generar prospecto PDF completo para un evento
   */
  async generateProspect(
    eventId: string,
    organizationId: string,
    userId: string,
  ): Promise<EventProspect> {
    // Verificar que el evento existe
    const event = await this.eventRepository.findOne({
      where: { id: eventId, organizationId },
    });

    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    // Obtener configuración completa
    const config = await this.eventConfigService.getCompleteConfig(eventId, organizationId);

    // Obtener categorías agrupadas
    const categories = await this.categoryService.findByEvent(eventId, organizationId);
    const categoriesByModality = this.groupCategoriesByModality(categories);

    // Crear registro de prospecto
    const prospect = this.prospectRepository.create({
      eventId,
      organizationId,
      version: 1,
      status: ProspectStatus.PENDING,
      generatedBy: userId,
      configSnapshot: config,
    });

    const savedProspect = await this.prospectRepository.save(prospect);

    try {
      // Generar PDF usando PDFMake
      const pdfBuffer = await this.generatePdfWithPdfMake(event, config, categoriesByModality);

      // Guardar PDF
      const fileName = `prospecto-${event.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      const filePath = await this.savePdfFile(fileName, pdfBuffer);

      // Actualizar prospecto
      savedProspect.status = ProspectStatus.COMPLETED;
      savedProspect.filePath = filePath;
      savedProspect.fileName = fileName;
      savedProspect.fileSize = pdfBuffer.length;
      savedProspect.generatedAt = new Date();
      savedProspect.fileUrl = `/api/admin/events/${eventId}/prospects/${savedProspect.id}/download`;

      await this.prospectRepository.save(savedProspect);

      this.logger.log(`Prospecto generado exitosamente: ${fileName}`);

      return savedProspect;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error generando prospecto: ${errorMessage}`, errorStack);

      savedProspect.status = ProspectStatus.FAILED;
      savedProspect.errorMessage = errorMessage;
      await this.prospectRepository.save(savedProspect);

      throw error;
    }
  }

  /**
   * Generar PDF usando PDFMake (ligero, rápido, soporta imágenes en headers/footers)
   */
  private async generatePdfWithPdfMake(
    event: Event,
    config: any,
    categoriesByModality: Record<string, any[]>,
  ): Promise<Buffer> {
    const printer = new PdfPrinter(this.fonts);

    // Cargar imágenes (banner, logos) si existen
    const images: Record<string, string> = {};
    
    // Intentar cargar banner si existe
    if (event.bannerUrl) {
      try {
        const bannerData = await this.loadImage(event.bannerUrl);
        if (bannerData) {
          images.banner = `data:image/png;base64,${bannerData.toString('base64')}`;
        }
      } catch (error) {
        this.logger.warn(`No se pudo cargar banner: ${event.bannerUrl}`);
      }
    }

    // TODO: Agregar logos de sponsors si están configurados
    // Ejemplo: images.logoXIOM = await this.loadImage('/path/to/xiom-logo.png');

    // Definir el documento PDF
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      
      // HEADER DINÁMICO (aparece en todas las páginas)
      // @ts-ignore - PDFMake tiene tipos estrictos para funciones dinámicas
      header: (currentPage: number, _pageCount: number) => {
        if (currentPage === 1) {
          // En la primera página, header más grande con banner
          return {
            margin: [40, 20, 40, 10] as [number, number, number, number],
            columns: [
              {
                width: '*',
                stack: [
                  {
                    text: event.name,
                    fontSize: 24,
                    bold: true,
                    color: '#1a237e',
                    alignment: 'center' as const,
                  },
                  {
                    text: `${this.formatDateShort(event.startDate)} - ${this.formatDateShort(event.endDate)} | ${event.venue || 'Lima - Perú'}`,
                    fontSize: 11,
                    color: '#666666',
                    alignment: 'center' as const,
                    margin: [0, 5, 0, 0] as [number, number, number, number],
                  },
                ],
              },
            ],
          };
        }
        // En páginas siguientes, header simple
        return {
          margin: [40, 20, 40, 10] as [number, number, number, number],
          text: event.name,
          fontSize: 12,
          bold: true,
          color: '#1a237e',
          alignment: 'center' as const,
        };
      },

      // FOOTER CON LOGOS (aparece en todas las páginas)
      // @ts-ignore - PDFMake tiene tipos estrictos para funciones dinámicas
      footer: (currentPage: number, pageCount: number) => {
        const footerContent: Content[] = [
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 1,
                lineColor: '#cccccc',
              },
            ],
            margin: [0, 10, 0, 10] as [number, number, number, number],
          },
        ];

        // Agregar logos de sponsors si existen (como en el flyer)
        // TODO: Cargar logos desde configuración del evento
        if (images.logoXIOM || images.logoPowerAde || images.logoCircuito) {
          footerContent.push({
            columns: [
              images.logoXIOM
                ? {
                    image: images.logoXIOM,
                    width: 80,
                    alignment: 'left' as const,
                    margin: [0, 5, 0, 0] as [number, number, number, number],
                  }
                : { text: '', width: 80 },
              {
                text: '',
                width: '*',
              },
              images.logoCircuito
                ? {
                    image: images.logoCircuito,
                    width: 100,
                    alignment: 'center' as const,
                    margin: [0, 5, 0, 0] as [number, number, number, number],
                  }
                : { text: '', width: 100 },
              {
                text: '',
                width: '*',
              },
              images.logoPowerAde
                ? {
                    image: images.logoPowerAde,
                    width: 80,
                    alignment: 'right' as const,
                    margin: [0, 5, 0, 0] as [number, number, number, number],
                  }
                : { text: '', width: 80 },
            ],
            margin: [0, 5, 0, 0] as [number, number, number, number],
          });
        }

        footerContent.push({
          text: `Página ${currentPage} de ${pageCount}`,
          fontSize: 9,
          color: '#999999',
          alignment: 'center' as const,
          margin: [0, 5, 0, 0] as [number, number, number, number],
        });

        return footerContent;
      },

      // CONTENIDO DEL PDF
      content: [
        // =====================================================
        // PORTADA CON BANNER
        // =====================================================
        ...(images.banner
          ? ([
              {
                image: images.banner,
                width: 515,
                alignment: 'center' as const,
                margin: [0, 0, 0, 20] as [number, number, number, number],
              },
            ] as Content[])
          : []),

        {
          text: event.name,
          fontSize: 32,
          bold: true,
          color: '#1a237e',
          alignment: 'center' as const,
          margin: [0, 0, 0, 10] as [number, number, number, number],
        } as Content,

        {
          text: `${this.formatDate(event.startDate)} - ${this.formatDate(event.endDate)}`,
          fontSize: 14,
          color: '#333333',
          alignment: 'center' as const,
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },

        {
          text: event.venue || 'Lima - Perú',
          fontSize: 12,
          color: '#666666',
          alignment: 'center' as const,
          margin: [0, 0, 0, 20] as [number, number, number, number],
        },

        // Línea divisoria
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 2,
              lineColor: '#1a237e',
            },
          ],
          margin: [0, 10, 0, 20],
        },

        // Descripción del evento
        ...(event.description
          ? [
              {
                text: event.description,
                fontSize: 11,
                color: '#333333',
                alignment: 'justify',
                margin: [0, 0, 0, 30],
              },
            ]
          : []),

        // =====================================================
        // INFORMACIÓN BÁSICA
        // =====================================================
        ...(config.basicInfo ? this.generateBasicInfoContent(config.basicInfo, event) : []),

        // =====================================================
        // FECHAS Y LUGAR
        // =====================================================
        this.generateDatesAndVenueContent(event, config),

        // =====================================================
        // MODALIDADES Y CATEGORÍAS
        // =====================================================
        this.generateCategoriesContent(categoriesByModality),

        // =====================================================
        // SISTEMA DE COMPETENCIA
        // =====================================================
        ...(config.competitionSystem
          ? this.generateCompetitionSystemContent(config.competitionSystem)
          : []),

        // =====================================================
        // PREMIOS
        // =====================================================
        ...(config.awards ? this.generateAwardsContent(config.awards) : []),

        // =====================================================
        // INSCRIPCIONES Y PAGOS
        // =====================================================
        ...(config.registration ? this.generateRegistrationContent(config.registration) : []),

        // =====================================================
        // EQUIPAMIENTO
        // =====================================================
        ...(config.equipment ? this.generateEquipmentContent(config.equipment) : []),

        // =====================================================
        // NORMATIVAS (12. NORMATIVA DE INSCRIPCIONES)
        // =====================================================
        this.generateRegistrationNormativesContent(),

        // =====================================================
        // CIERRE DE INSCRIPCIONES (13.)
        // =====================================================
        ...(config.registration
          ? this.generateRegistrationDeadlineContent(config.registration)
          : []),

        // =====================================================
        // PREMIOS (14.)
        // =====================================================
        ...(config.awards ? this.generateAwardsDetailedContent(config.awards) : []),

        // =====================================================
        // INDICACIONES FINALES (15.)
        // =====================================================
        this.generateFinalInstructionsContent(config),
      ],

      // Estilos globales
      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
      },

      // Estilos personalizados
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#1a237e',
          margin: [0, 20, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          color: '#1a237e',
          margin: [0, 15, 0, 8],
        },
        sectionNumber: {
          fontSize: 12,
          bold: true,
          color: '#333333',
          margin: [0, 15, 0, 5],
        },
        bodyText: {
          fontSize: 10,
          color: '#333333',
          margin: [0, 0, 0, 5],
        },
        highlight: {
          fontSize: 10,
          bold: true,
          color: '#1a237e',
        },
      },
    };

    // Generar PDF
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks: Buffer[] = [];

        pdfDoc.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        pdfDoc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(pdfBuffer);
        });

        pdfDoc.on('error', reject);

        pdfDoc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Cargar imagen desde URL o ruta local
   */
  private async loadImage(imagePathOrUrl: string): Promise<Buffer | null> {
    try {
      // Si es una URL HTTP/HTTPS
      if (imagePathOrUrl.startsWith('http://') || imagePathOrUrl.startsWith('https://')) {
        return await this.downloadImage(imagePathOrUrl);
      }

      // Si es una ruta local
      const fullPath = path.isAbsolute(imagePathOrUrl)
        ? imagePathOrUrl
        : path.join(process.cwd(), imagePathOrUrl);

      return await fs.readFile(fullPath);
    } catch (error) {
      this.logger.warn(`Error cargando imagen ${imagePathOrUrl}: ${error.message}`);
      return null;
    }
  }

  /**
   * Descargar imagen desde URL
   */
  private async downloadImage(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      protocol.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        const chunks: Buffer[] = [];
        response.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      }).on('error', reject);
    });
  }

  /**
   * Generar contenido de información básica
   */
  private generateBasicInfoContent(basicInfo: any, event: Event): Content[] {
    return [
      {
        text: '📋 INFORMACIÓN BÁSICA',
        style: 'header',
      },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: `Evento: ${basicInfo.eventName || event.name}`, style: 'bodyText' },
              ...(basicInfo.organizationName
                ? [{ text: `Organizador: ${basicInfo.organizationName}`, style: 'bodyText' }]
                : []),
              ...(basicInfo.organizationRUC
                ? [{ text: `RUC: ${basicInfo.organizationRUC}`, style: 'bodyText' }]
                : []),
            ],
          },
          {
            width: '*',
            stack: [
              ...(basicInfo.competitionManager
                ? [
                    {
                      text: `Gerente de Competencia: ${basicInfo.competitionManager.name} - ${basicInfo.competitionManager.contact}`,
                      style: 'bodyText',
                    },
                  ]
                : []),
              ...(basicInfo.generalJudge
                ? [
                    {
                      text: `Juez General: ${basicInfo.generalJudge.name} - ${basicInfo.generalJudge.contact}`,
                      style: 'bodyText',
                    },
                  ]
                : []),
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },
    ];
  }

  /**
   * Generar contenido de fechas y lugar
   */
  private generateDatesAndVenueContent(event: Event, config: any): Content {
    return {
      stack: [
        { text: '📅 FECHAS Y LUGAR', style: 'header' },
        ...(event.startDate
          ? [{ text: `Fecha de Inicio: ${this.formatDate(event.startDate)}`, style: 'bodyText' }]
          : []),
        ...(event.endDate
          ? [{ text: `Fecha de Fin: ${this.formatDate(event.endDate)}`, style: 'bodyText' }]
          : []),
        ...(event.venue ? [{ text: `Lugar: ${event.venue}`, style: 'bodyText' }] : []),
        ...(event.address ? [{ text: `Dirección: ${event.address}`, style: 'bodyText' }] : []),
        ...(config.registration?.registrationEndDate
          ? [
              {
                text: `Fecha Límite de Inscripción: ${this.formatDate(config.registration.registrationEndDate)}`,
                style: 'bodyText',
              },
            ]
          : []),
      ],
      margin: [0, 0, 0, 20],
    };
  }

  /**
   * Generar contenido de categorías con tablas
   */
  private generateCategoriesContent(categoriesByModality: Record<string, any[]>): Content[] {
    const content: Content[] = [
      {
        text: '🏆 MODALIDADES Y CATEGORÍAS',
        style: 'header',
      },
    ];

    for (const [modality, categories] of Object.entries(categoriesByModality)) {
      content.push({
        text: modality === 'INDIVIDUAL' ? '👤 Individual' : '👥 Dobles',
        style: 'subheader',
      });

      // Crear tabla de categorías
      const tableBody = [
        // Headers
        [
          { text: 'Código', style: 'highlight', fillColor: '#1a237e', color: '#ffffff' },
          { text: 'Nombre', style: 'highlight', fillColor: '#1a237e', color: '#ffffff' },
          { text: 'Género', style: 'highlight', fillColor: '#1a237e', color: '#ffffff' },
          { text: 'Rango de Edad', style: 'highlight', fillColor: '#1a237e', color: '#ffffff' },
          { text: 'Costo', style: 'highlight', fillColor: '#1a237e', color: '#ffffff' },
        ],
      ];

      // Filas de datos
      for (const category of categories) {
        tableBody.push([
          { text: category.eventCode || '-', style: 'bodyText' },
          { text: category.name || '-', style: 'bodyText' },
          { text: this.formatGender(category.gender), style: 'bodyText' },
          { text: this.formatAgeRange(category.ageRange), style: 'bodyText' },
          {
            text: `${category.currency || 'PEN'} ${parseFloat(category.cost || 0).toFixed(2)}`,
            style: 'bodyText',
          },
        ]);
      }

      content.push({
        table: {
          headerRows: 1,
          widths: [80, '*', 80, 100, 80],
          body: tableBody,
        },
        layout: {
          fillColor: (rowIndex: number) => {
            return rowIndex % 2 === 0 ? '#f9f9f9' : '#ffffff';
          },
        },
        margin: [0, 0, 0, 20],
      });
    }

    return content;
  }

  /**
   * Generar contenido de sistema de competencia
   */
  private generateCompetitionSystemContent(system: any): Content[] {
    return [
      {
        text: '⚙️ SISTEMA DE COMPETENCIA',
        style: 'header',
      },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: `Sets por Defecto: Mejor de ${system.defaultSets || 5}`, style: 'bodyText' },
              { text: `Sets en Finales: Mejor de ${system.finalSets || 7}`, style: 'bodyText' },
            ],
          },
          {
            width: '*',
            stack: [
              { text: `Tiempo de Calentamiento: ${system.warmupTimeMinutes || 5} minutos`, style: 'bodyText' },
              { text: `Descanso entre Sets: ${system.breakBetweenSetsMinutes || 1} minuto(s)`, style: 'bodyText' },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },
    ];
  }

  /**
   * Generar contenido de premios (sección general)
   */
  private generateAwardsContent(awards: any): Content[] {
    return [
      {
        text: '🏅 PREMIOS',
        style: 'header',
      },
      {
        columns: [
          {
            width: '*',
            stack: [
              ...(awards.recognitionFirst
                ? [
                    {
                      text: `1er Lugar: ${awards.recognitionFirst}`,
                      style: 'bodyText',
                    },
                    ...(awards.prizeFirst
                      ? [
                          {
                            text: `   Premio Económico: ${awards.currency || 'PEN'} ${parseFloat(awards.prizeFirst).toFixed(2)}`,
                            style: 'bodyText',
                            margin: [10, 0, 0, 0] as [number, number, number, number],
                          },
                        ]
                      : []),
                  ]
                : []),
              ...(awards.recognitionSecond
                ? [
                    {
                      text: `2do Lugar: ${awards.recognitionSecond}`,
                      style: 'bodyText',
                    },
                    ...(awards.prizeSecond
                      ? [
                          {
                            text: `   Premio Económico: ${awards.currency || 'PEN'} ${parseFloat(awards.prizeSecond).toFixed(2)}`,
                            style: 'bodyText',
                            margin: [10, 0, 0, 0] as [number, number, number, number],
                          },
                        ]
                      : []),
                  ]
                : []),
              ...(awards.recognitionThird
                ? [
                    {
                      text: `3er Lugar: ${awards.recognitionThird}`,
                      style: 'bodyText',
                    },
                    ...(awards.prizeThird
                      ? [
                          {
                            text: `   Premio Económico: ${awards.currency || 'PEN'} ${parseFloat(awards.prizeThird).toFixed(2)}`,
                            style: 'bodyText',
                            margin: [10, 0, 0, 0] as [number, number, number, number],
                          },
                        ]
                      : []),
                  ]
                : []),
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },
    ];
  }

  /**
   * Generar contenido de inscripciones y pagos
   */
  private generateRegistrationContent(registration: any): Content[] {
    return [
      {
        text: '📝 INSCRIPCIONES Y PAGOS',
        style: 'header',
      },
      {
        stack: [
          ...(registration.eventWhatsApp
            ? [{ text: `WhatsApp: ${registration.eventWhatsApp}`, style: 'bodyText' }]
            : []),
          ...(registration.eventEmail1
            ? [{ text: `Email 1: ${registration.eventEmail1}`, style: 'bodyText' }]
            : []),
          ...(registration.eventEmail2
            ? [{ text: `Email 2: ${registration.eventEmail2}`, style: 'bodyText' }]
            : []),
          {
            text: 'Datos de Pago:',
            style: 'subheader',
            margin: [0, 10, 0, 5] as [number, number, number, number],
          },
          ...(registration.paymentAccountHolder
            ? [{ text: `Titular: ${registration.paymentAccountHolder}`, style: 'bodyText' }]
            : []),
          ...(registration.paymentAccountNumber
            ? [{ text: `Cuenta Corriente BCP: ${registration.paymentAccountNumber}`, style: 'bodyText' }]
            : []),
          ...(registration.paymentCCI
            ? [{ text: `CCI: ${registration.paymentCCI}`, style: 'bodyText' }]
            : []),
          ...(registration.paymentYape
            ? [{ text: `YAPE: ${registration.paymentYape}`, style: 'bodyText' }]
            : []),
          ...(registration.paymentNotes
            ? [
                {
                  text: `Nota: ${registration.paymentNotes}`,
                  style: 'bodyText',
                  italics: true,
                  color: '#856404',
                  margin: [0, 5, 0, 0] as [number, number, number, number],
                },
              ]
            : []),
        ],
        margin: [0, 0, 0, 20],
      },
    ];
  }

  /**
   * Generar contenido de equipamiento
   */
  private generateEquipmentContent(equipment: any): Content[] {
    return [
      {
        text: '🏓 EQUIPAMIENTO',
        style: 'header',
      },
      {
        columns: [
          {
            width: '*',
            stack: [
              ...(equipment.tablesCount
                ? [{ text: `N° de Mesas: ${equipment.tablesCount}`, style: 'bodyText' }]
                : []),
              ...(equipment.tableBrand
                ? [{ text: `Marca de Mesas: ${equipment.tableBrand}`, style: 'bodyText' }]
                : []),
            ],
          },
          {
            width: '*',
            stack: [
              ...(equipment.floorType
                ? [{ text: `Tipo de Piso: ${equipment.floorType}`, style: 'bodyText' }]
                : []),
              ...(equipment.ballBrand
                ? [{ text: `Pelotas: ${equipment.ballBrand}`, style: 'bodyText' }]
                : []),
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },
      ...(equipment.otherEquipment
        ? [
            {
              text: `Otros Equipos: ${equipment.otherEquipment}`,
              style: 'bodyText',
              margin: [0, 0, 0, 20] as [number, number, number, number],
            },
          ]
        : []),
    ];
  }

  /**
   * Generar contenido de normativas de inscripción (12. NORMATIVA DE INSCRIPCIONES)
   */
  private generateRegistrationNormativesContent(): Content[] {
    return [
      {
        text: '12. NORMATIVA DE INSCRIPCIONES',
        style: 'sectionNumber',
      },
      {
        text: [
          'Los atletas podrán inscribirse en su categoría oficial, una adicional y la Categoría Libre. ',
          'Los atletas con Ranking Nacional no podrán participar en las Categorías Escolares (12, 14 y 17). ',
          'En la Categoría Universitaria solo podrán participar estudiantes universitarios actualmente matriculados que no hayan sido parte de una Pre-Selección Nacional en los últimos 2 años. ',
          'Las categorías especiales y libres no se consideran adicionales. ',
          'El comprobante de pago de inscripción debe ser enviado junto con el formulario de inscripción.',
        ],
        style: 'bodyText',
        margin: [0, 0, 0, 15],
      },
    ];
  }

  /**
   * Generar contenido de cierre de inscripciones (13. CIERRE DE INSCRIPCIONES)
   */
  private generateRegistrationDeadlineContent(registration: any): Content[] {
    return [
      {
        text: '13. CIERRE DE INSCRIPCIONES',
        style: 'sectionNumber',
      },
      {
        text: [
          `Las inscripciones serán aceptadas hasta las 22:00 horas del `,
          registration.registrationEndDate
            ? this.formatDate(registration.registrationEndDate)
            : 'día establecido',
          `. `,
          `Las inscripciones deben ser enviadas vía email a: ${registration.eventEmail1 || 'miguelferreb@hotmail.com'}`,
          ...(registration.eventEmail2 ? [`, con copia a ${registration.eventEmail2}`] : []),
          '.',
        ],
        style: 'bodyText',
        margin: [0, 0, 0, 20],
      },
    ];
  }

  /**
   * Generar contenido detallado de premios (14. PREMIOS)
   */
  private generateAwardsDetailedContent(awards: any): Content[] {
    return [
      {
        text: '14. PREMIOS',
        style: 'sectionNumber',
      },
      {
        text: 'TODAS LAS CATEGORÍAS',
        style: 'subheader',
        margin: [0, 5, 0, 5],
      },
      {
        stack: [
          ...(awards.recognitionFirst
            ? [
                {
                  text: `1er Lugar: ${awards.recognitionFirst}`,
                  style: 'bodyText',
                },
              ]
            : []),
          ...(awards.recognitionSecond
            ? [
                {
                  text: `2do Lugar: ${awards.recognitionSecond}`,
                  style: 'bodyText',
                },
              ]
            : []),
          ...(awards.recognitionThird
            ? [
                {
                  text: `3er Lugar: ${awards.recognitionThird}`,
                  style: 'bodyText',
                },
              ]
            : []),
        ],
        margin: [0, 0, 0, 10] as [number, number, number, number],
      },
      ...(awards.prizeFirst || awards.prizeSecond || awards.prizeThird
        ? [
            {
              text: 'PREMIO ECONÓMICO CATEGORÍA INDIVIDUAL LIBRE',
              style: 'subheader',
              margin: [0, 10, 0, 5] as [number, number, number, number],
            },
            {
              stack: [
                ...(awards.prizeFirst
                  ? [
                      {
                        text: `1er Lugar: ${awards.currency || 'PEN'} ${parseFloat(awards.prizeFirst).toFixed(2)}`,
                        style: 'bodyText',
                      },
                    ]
                  : []),
                ...(awards.prizeSecond
                  ? [
                      {
                        text: `2do Lugar: ${awards.currency || 'PEN'} ${parseFloat(awards.prizeSecond).toFixed(2)}`,
                        style: 'bodyText',
                      },
                    ]
                  : []),
                ...(awards.prizeThird
                  ? [
                      {
                        text: `3er Lugar: ${awards.currency || 'PEN'} ${parseFloat(awards.prizeThird).toFixed(2)}`,
                        style: 'bodyText',
                      },
                    ]
                  : []),
              ],
              margin: [0, 0, 0, 20] as [number, number, number, number],
            },
          ]
        : []),
    ];
  }

  /**
   * Generar contenido de indicaciones finales (15. INDICACIONES FINALES)
   */
  private generateFinalInstructionsContent(_config: any): Content[] {
    return [
      {
        text: '15. INDICACIONES FINALES',
        style: 'sectionNumber',
      },
      {
        text: [
          'Si un atleta decide retirarse del torneo y solicitar reembolso, debe comunicarlo con un máximo de 24 horas antes del sorteo. ',
          'Para cualquier información adicional, contactar vía email a ',
          { text: 'topspinttclub@gmail.com', style: 'highlight' },
          ' o WhatsApp al ',
          { text: '970 776 254', style: 'highlight' },
          '.',
        ],
        style: 'bodyText',
        margin: [0, 0, 0, 20],
      },
    ];
  }

  /**
   * Agrupar categorías por modalidad
   */
  private groupCategoriesByModality(categories: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {
      INDIVIDUAL: [],
      DOUBLES: [],
      TEAM: [],
    };

    for (const category of categories) {
      const modality = category.modality || 'INDIVIDUAL';
      if (!grouped[modality]) {
        grouped[modality] = [];
      }
      grouped[modality].push(category);
    }

    // Eliminar modalidades vacías
    Object.keys(grouped).forEach((key) => {
      if (grouped[key].length === 0) {
        delete grouped[key];
      }
    });

    return grouped;
  }

  /**
   * Guardar archivo PDF
   */
  private async savePdfFile(fileName: string, buffer: Buffer): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'prospects');

    // Crear directorio si no existe
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    return filePath;
  }

  /**
   * Formatear fecha
   */
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Formatear fecha corta (solo día y mes)
   */
  private formatDateShort(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-PE', {
      month: '2-digit',
      day: '2-digit',
    });
  }

  /**
   * Formatear género
   */
  private formatGender(gender: string): string {
    const map: Record<string, string> = {
      MALE: 'Varones',
      FEMALE: 'Damas',
      MIXED: 'Mixto',
      ALL: 'Sin restricción',
    };
    return map[gender] || gender;
  }

  /**
   * Formatear rango de edad
   */
  private formatAgeRange(ageRange: any): string {
    if (!ageRange) return '-';
    if (ageRange.rule) return ageRange.rule;
    if (ageRange.min && ageRange.max) {
      return `${ageRange.min} - ${ageRange.max} años`;
    }
    if (ageRange.min) {
      return `Desde ${ageRange.min} años`;
    }
    if (ageRange.max) {
      return `Hasta ${ageRange.max} años`;
    }
    return '-';
  }

  /**
   * Obtener prospecto por ID
   */
  async getProspect(id: string, organizationId: string): Promise<EventProspect> {
    const prospect = await this.prospectRepository.findOne({
      where: { id, organizationId },
    });

    if (!prospect) {
      throw new NotFoundException('Prospecto no encontrado');
    }

    return prospect;
  }

  /**
   * Listar prospectos de un evento
   */
  async getEventProspects(eventId: string, organizationId: string): Promise<EventProspect[]> {
    return await this.prospectRepository.find({
      where: { eventId, organizationId },
      order: { version: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Obtener archivo PDF
   */
  async getPdfFile(prospectId: string, organizationId: string): Promise<{ buffer: Buffer; fileName: string }> {
    const prospect = await this.getProspect(prospectId, organizationId);

    if (prospect.status !== ProspectStatus.COMPLETED || !prospect.filePath) {
      throw new NotFoundException('Prospecto no generado o archivo no disponible');
    }

    const buffer = await fs.readFile(prospect.filePath);

    return {
      buffer,
      fileName: prospect.fileName || `prospecto-${prospectId}.pdf`,
    };
  }
}
