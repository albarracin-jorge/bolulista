'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUserId } from '@/lib/session';

const itemSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'La categoría es requerida'),
});

const categorySchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
});

export async function createItem(formData: FormData) {
  try {
    const userId = await requireUserId();
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description') || undefined,
      categoryId: formData.get('categoryId'),
    };

    const validatedData = itemSchema.parse(rawData);

    const category = await prisma.category.findFirst({
      where: { id: validatedData.categoryId, userId },
    });

    if (!category) {
      return { success: false, error: 'Categoría inválida' };
    }

    await prisma.item.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return { success: false, error: 'Debes iniciar sesión' };
    }
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Error al crear el item' };
  }
}

export async function createCategory(formData: FormData) {
  try {
    const userId = await requireUserId();
    const rawData = {
      title: formData.get('title'),
    };

    const validatedData = categorySchema.parse(rawData);

    const category = await prisma.category.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    revalidatePath('/');
    return { success: true, category };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return { success: false, error: 'Debes iniciar sesión' };
    }
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Error al crear la categoría' };
  }
}

export async function deleteItem(id: string) {
  try {
    const userId = await requireUserId();
    const result = await prisma.item.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return { success: false, error: 'Item no encontrado' };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return { success: false, error: 'Debes iniciar sesión' };
    }
    return { success: false, error: 'Error al eliminar el item' };
  }
}

export async function updateItem(id: string, formData: FormData) {
  try {
    const userId = await requireUserId();
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description') || undefined,
      categoryId: formData.get('categoryId'),
    };

    const validatedData = itemSchema.parse(rawData);

    const category = await prisma.category.findFirst({
      where: { id: validatedData.categoryId, userId },
    });

    if (!category) {
      return { success: false, error: 'Categoría inválida' };
    }

    const result = await prisma.item.updateMany({
      where: { id, userId },
      data: validatedData,
    });

    if (result.count === 0) {
      return { success: false, error: 'Item no encontrado' };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return { success: false, error: 'Debes iniciar sesión' };
    }
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Error al actualizar el item' };
  }
}
