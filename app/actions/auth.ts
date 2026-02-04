'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { clearSession, setSession } from '@/lib/session';
import { hashPassword, verifyPassword } from '@/lib/password';
import { revalidatePath } from 'next/cache';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function registerUser(formData: FormData) {
  try {
    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const { email, password } = authSchema.parse(payload);
  
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: 'El email ya está registrado' };
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword(password),
      },
    });

    await setSession(user.id);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.log({error});
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Error al crear el usuario' };
  }
}

export async function loginUser(formData: FormData) {
  try {
    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const { email, password } = authSchema.parse(payload);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    await setSession(user.id);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Error al iniciar sesión' };
  }
}

export async function logoutUser() {
  await clearSession();
  revalidatePath('/');
}
