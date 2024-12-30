import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EMAIL_TEMPLATES } from "@/components/EmailTemplates";

type EmailTemplate = keyof typeof EMAIL_TEMPLATES;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, subject, template, data } = await request.json();

    if (!Object.keys(EMAIL_TEMPLATES).includes(template)) {
      return NextResponse.json(
        { error: `Email template '${template}' not found` },
        { status: 400 }
      );
    }

    const Template = EMAIL_TEMPLATES[template as EmailTemplate];
    const htmlContent: string = Template(data);

    const { data: emailData, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: emailData });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
