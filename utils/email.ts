import { EmailTemplateType } from '@/components/EmailTemplates';


interface EmailParams {
  to: string;
  subject: string;
  template: EmailTemplateType;
  data: Record<string, any>;
}

export async function sendEmailNotification(params: EmailParams) {
  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}
