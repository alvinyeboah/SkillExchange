import { ServiceRequestTemplate } from "./ServiceRequest";
import { WelcomeTemplate } from "./Welcome";

type EmailTemplateFunction = (data: any) => string;

export const EMAIL_TEMPLATES: Record<string, EmailTemplateFunction> = {
  "service-request": ServiceRequestTemplate,
  welcome: WelcomeTemplate,
} as const;

export type EmailTemplateType = keyof typeof EMAIL_TEMPLATES;
