import { NextResponse } from 'next/server';

interface RateLimit {
  timestamp: number;
  requests: number;
}

const rateLimit = new Map<string, RateLimit>();

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export const rateLimiter = (config: RateLimitConfig) => {
  return async (req: Request) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up old entries
    for (const [key, limit] of rateLimit.entries()) {
      if (limit.timestamp < windowStart) {
        rateLimit.delete(key);
      }
    }

    const currentLimit = rateLimit.get(ip);

    if (!currentLimit) {
      rateLimit.set(ip, { timestamp: now, requests: 1 });
      return null;
    }

    if (currentLimit.timestamp < windowStart) {
      // Reset if the window has passed
      rateLimit.set(ip, { timestamp: now, requests: 1 });
      return null;
    }

    currentLimit.requests++;
    rateLimit.set(ip, currentLimit);

    if (currentLimit.requests > config.max) {
      return NextResponse.json(
        { message: 'Too many requests' },
        { status: 429 }
      );
    }

    return null;
  };
};