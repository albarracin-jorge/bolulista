import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'bolulista_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const secret =
  process.env.SESSION_SECRET ??
  (process.env.NODE_ENV === 'production' ? undefined : 'dev-session-secret');

if (!secret) {
  throw new Error('SESSION_SECRET is required in production.');
}

const secretKey = secret;

type SessionPayload = {
  userId: string;
  exp: number;
};

function sign(payload: string) {
  return crypto.createHmac('sha256', secretKey).update(payload).digest('base64url');
}

function encodeSession(payload: SessionPayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

function decodeSession(token: string): SessionPayload | null {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  const payload: SessionPayload = {
    userId,
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
  };

  cookieStore.set(SESSION_COOKIE, encodeSession(payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireUserId() {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHENTICATED');
  }
  return session.userId;
}
