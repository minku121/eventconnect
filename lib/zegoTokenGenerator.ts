import { createHmac } from 'crypto';

interface TokenPayload {
  app_id: number;
  user_id: string;
  nonce: number;
  ctime: number;
  expire: number;
  payload?: string;
}

export function generateToken04(
  appId: number,
  userId: string,
  secret: string,
  effectiveTimeInSeconds: number,
  payload?: string
): string {
  if (!appId || !userId || !secret) {
    throw new Error('Missing required parameters for token generation');
  }

  const createTime = Math.floor(Date.now() / 1000);
  const tokenInfo: TokenPayload = {
    app_id: appId,
    user_id: userId,
    nonce: Math.floor(Math.random() * 4294967295), // Random 32-bit number
    ctime: createTime,
    expire: createTime + effectiveTimeInSeconds,
    payload: payload
  };

  // Convert token info to JSON and base64
  const tokenJson = JSON.stringify(tokenInfo);
  const tokenBase64 = Buffer.from(tokenJson).toString('base64');

  // Calculate signature using HMAC-SHA256
  const signature = createHmac('sha256', secret)
    .update(tokenBase64)
    .digest('hex');

  // Combine token and signature
  return `${tokenBase64}.${signature}`;
} 