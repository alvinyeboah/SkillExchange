import { format } from 'date-fns';

interface ServiceRequestEmailProps {
  requestId: string;
  requirements?: string;
  deadline?: string;
  clientName: string;
  clientAvatar?: string;
  projectTitle: string;
  budget?: number;
  skillsRequired?: string[];
}

export const ServiceRequestTemplate = (
  props: ServiceRequestEmailProps
): string => {
  const formattedDeadline = props.deadline ? format(new Date(props.deadline), 'PPP') : 'No deadline specified';
  const receivedDate = format(new Date(), 'PPP');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Service Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(to right, rgba(0, 0, 255, 0.1), rgba(0, 0, 255, 0.05)); border-radius: 8px; overflow: hidden;">
        <tr>
          <td style="padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="background-color: #e2e8f0; color: #64748b; font-size: 12px; padding: 4px 8px; border-radius: 4px;">New Request</span>
                </td>
                <td align="right">
                  <span style="color: #64748b; font-size: 14px;">ID: ${props.requestId}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <h1 style="font-size: 24px; margin: 10px 0;">New Service Request</h1>
                  <p style="color: #64748b; margin: 0;">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E" alt="User icon" style="vertical-align: middle; margin-right: 5px;">
                    From: ${props.clientName}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
        <tr>
          <td>
            <h2 style="font-size: 18px; margin: 0;">${props.projectTitle}</h2>
            <p style="color: #64748b; font-size: 14px; margin: 5px 0;">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E" alt="Calendar icon" style="vertical-align: middle; margin-right: 5px;">
              Received on ${receivedDate}
            </p>
          </td>
          <td align="right">
            <img src="${props.clientAvatar || 'https://www.gravatar.com/avatar/?d=mp'}" alt="${props.clientName}" style="width: 48px; height: 48px; border-radius: 50%;">
          </td>
        </tr>
      </table>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <h3 style="font-size: 16px; margin: 0;">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='16' y1='13' x2='8' y2='13'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='8' y2='17'%3E%3C/line%3E%3Cpolyline points='10 9 9 9 8 9'%3E%3C/polyline%3E%3C/svg%3E" alt="File icon" style="vertical-align: middle; margin-right: 5px;">
              Requirements
            </h3>
            <p style="font-size: 14px; margin: 5px 0;">${props.requirements || 'No specific requirements provided'}</p>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
        <tr>
          <td>
            <h3 style="font-size: 16px; margin: 0;">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E" alt="Clock icon" style="vertical-align: middle; margin-right: 5px;">
              Deadline
            </h3>
            <p style="font-size: 14px; margin: 5px 0;">${formattedDeadline}</p>
          </td>
          ${props.budget ? `
          <td align="right">
            <h3 style="font-size: 16px; margin: 0;">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='1' x2='12' y2='23'%3E%3C/line%3E%3Cpath d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'%3E%3C/path%3E%3C/svg%3E" alt="Dollar icon" style="vertical-align: middle; margin-right: 5px;">
              Budget
            </h3>
            <p style="font-size: 14px; margin: 5px 0;">$${props.budget}</p>
          </td>
          ` : ''}
        </tr>
      </table>

      ${props.skillsRequired && props.skillsRequired.length > 0 ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
        <tr>
          <td>
            <h3 style="font-size: 16px; margin: 0;">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='8' r='7'%3E%3C/circle%3E%3Cpolyline points='8.21 13.89 7 23 12 20 17 23 15.79 13.88'%3E%3C/polyline%3E%3C/svg%3E" alt="Award icon" style="vertical-align: middle; margin-right: 5px;">
              Skills Required
            </h3>
            <p style="font-size: 14px; margin: 5px 0;">
              ${props.skillsRequired.map(skill => `
                <span style="display: inline-block; background-color: #e2e8f0; color: #64748b; font-size: 12px; padding: 2px 8px; border-radius: 4px; margin-right: 5px; margin-bottom: 5px;">${skill}</span>
              `).join('')}
            </p>
          </td>
        </tr>
      </table>
      ` : ''}

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px; background-color: #f1f5f9; border-radius: 8px;">
        <tr>
          <td style="padding: 20px;">
            <p style="font-size: 14px; color: #64748b; margin: 0 0 10px 0;">Please respond to this request as soon as possible.</p>
            <a href="/requests/${props.requestId}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'%3E%3C/path%3E%3Cpolyline points='15 3 21 3 21 9'%3E%3C/polyline%3E%3Cline x1='10' y1='14' x2='21' y2='3'%3E%3C/line%3E%3C/svg%3E" alt="External link icon" style="vertical-align: middle; margin-right: 5px; filter: invert(1);">
              View Full Request
            </a>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};