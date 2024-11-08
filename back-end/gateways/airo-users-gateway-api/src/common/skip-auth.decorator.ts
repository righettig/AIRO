import { SetMetadata } from '@nestjs/common';

// Define a metadata key to be used for skipping authentication
export const SKIP_AUTH_KEY = 'skipAuth';
export const SkipAuth = () => SetMetadata(SKIP_AUTH_KEY, true);
