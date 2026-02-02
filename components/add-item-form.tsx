'use client';

import { useState, useTransition } from 'react';
import { createItem, createCategory } from '@/app/actions/items';

interface Category {
  id: string;
  title: string;
}

interface AddItemFormProps {
  categories: Category[];
}

export default function AddItemForm({ categories }: AddItemFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createItem(formData);
      if (result.success) {
        setSuccess('Item agregado correctamente');
        // event.currentTarget.reset();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Error al agregar el item');
      }
    });
  }

  async function handleCreateCategory(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!newCategoryTitle.trim()) {
      setError('El nombre de la categoría es requerido');
      return;
    }

    const formData = new FormData();
    formData.append('title', newCategoryTitle);

    startTransition(async () => {
      const result = await createCategory(formData);
      if (result.success) {
        setNewCategoryTitle('');
        setShowNewCategory(false);
        setSuccess('Categoría creada correctamente');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Error al crear la categoría');
      }
    });
  }

  return (
    <div className="w-full max-w-2xl rounded-lg border border-bg-tertiary bg-white p-6 shadow-sm dark:border-bg-tertiary dark:bg-bg-secondary">
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-text">
        Agregar Item
      </h2>

      {error && (
        <div className="mb-4 rounded-md bg-error/10 p-3 text-sm text-error dark:bg-error/20 dark:text-error">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-success/10 p-3 text-sm text-success dark:bg-success/20 dark:text-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-text"
          >
            Nombre *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isPending}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-success focus:outline-none focus:ring-1 focus:ring-success disabled:opacity-50 dark:border-bg-tertiary dark:bg-bg-tertiary dark:text-text dark:placeholder-zinc-500"
            placeholder="Un boluproducto"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-text"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            disabled={isPending}
            rows={3}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-success focus:outline-none focus:ring-1 focus:ring-success disabled:opacity-50 dark:border-bg-tertiary dark:bg-bg-tertiary dark:text-text dark:placeholder-zinc-500"
            placeholder="Por si queres justificar lo injustificable..."
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-zinc-700 dark:text-text"
            >
              Categoría *
            </label>
            <button
              type="button"
              onClick={() => setShowNewCategory(!showNewCategory)}
              className="text-sm text-text hover:text-text/80"
            >
              {showNewCategory ? 'Cancelar' : '+ Nueva categoría'}
            </button>
          </div>

          {showNewCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
                disabled={isPending}
                className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-success focus:outline-none focus:ring-1 focus:ring-success disabled:opacity-50 dark:border-bg-tertiary dark:bg-bg-tertiary dark:text-text dark:placeholder-zinc-500"
                placeholder="Nombre de la categoría"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={isPending}
                className="rounded-md bg-success px-4 py-2 text-sm font-medium text-neutral-100 hover:bg-success/90 disabled:opacity-50"
              >
                Crear
              </button>
            </div>
          ) : (
            <select
              id="categoryId"
              name="categoryId"
              required
              disabled={isPending}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-success focus:outline-none focus:ring-1 focus:ring-success disabled:opacity-50 dark:border-bg-tertiary dark:bg-bg-tertiary dark:text-text"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-success px-4 py-2 font-medium text-neutral-100 hover:bg-success/90 disabled:opacity-50"
        >
          {isPending ? 'Agregando...' : 'Agregar Item'}
        </button>
      </form>
    </div>
  );
}
