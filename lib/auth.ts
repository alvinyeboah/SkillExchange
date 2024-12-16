import { jwtVerify, SignJWT } from 'jose';
import { nanoid } from 'nanoid';

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
  username: string;
  exp?: number;
  iat?: number;
}

class JWTManager {
  private secretKey: Uint8Array;

  constructor() {
    const secretKeyString = process.env.JWT_SECRET;
    if (!secretKeyString) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    this.secretKey = new TextEncoder().encode(secretKeyString);
  }

  /**
   * Sign a token with optional expiration time
   * @param payload Token payload data
   * @param expiresInHours Expiration time in hours (default: 24)
   * @returns Signed JWT token
   */
  async sign(
    payload: Omit<TokenPayload, 'exp' | 'iat'>, 
    expiresInHours: number = 24
  ): Promise<string> {
    const token = await new SignJWT({ 
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      username: payload.username
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(nanoid()) // Unique token identifier
      .setIssuedAt()
      .setExpirationTime(`${expiresInHours}h`)
      .sign(this.secretKey);

    return token;
  }

  /**
   * Verify and decode a JWT token
   * @param token JWT token to verify
   * @returns Decoded payload or null if verification fails
   */
  async verify(token: string): Promise<TokenPayload | null> {
    try {
      const { payload } = await jwtVerify<TokenPayload>(
        token, 
        this.secretKey,
        { algorithms: ['HS256'] }
      );

      return payload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Decode a JWT token without verification (use with caution)
   * @param token JWT token to decode
   * @returns Decoded payload or null if decoding fails
   */
  decode(token: string): TokenPayload | null {
    try {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(
        Buffer.from(base64Payload, 'base64').toString('utf-8')
      );
      return payload;
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  }
}

// Create a singleton instance
export const jwtManager = new JWTManager();