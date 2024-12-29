import { ServiceRequestTemplate } from './ServiceRequest';
import { WelcomeTemplate } from './Welcome';

export const EMAIL_TEMPLATES = {
  'service-request': ServiceRequestTemplate,
  'welcome': WelcomeTemplate,
  // Add other templates here
} as const;

export type EmailTemplateType = keyof typeof EMAIL_TEMPLATES;