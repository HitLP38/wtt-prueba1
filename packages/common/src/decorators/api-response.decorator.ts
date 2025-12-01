import { SetMetadata } from '@nestjs/common';

export const API_RESPONSE_METADATA = 'api_response';

export const ApiResponse = (message: string) =>
  SetMetadata(API_RESPONSE_METADATA, message);


