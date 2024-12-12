import { NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request) => {
    try {
      const body = await req.json();
      await schema.parseAsync(body);
      return null;
    } catch (error: any) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: error.errors 
        },
        { status: 400 }
      );
    }
  };
}; 