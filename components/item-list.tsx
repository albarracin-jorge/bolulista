'use client';

import { useState, useTransition } from 'react';
import { deleteItem, updateItem } from '@/app/actions/items';

interface Category {
  id: string;
  title: string;
}

interface Item {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  category: Category;
  createdAt: Date;
}

interface ItemListProps {
  items: Item[];
  categories: Category[];
}

export default function ItemList({ items, categories }: ItemListProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleEdit(item: Item) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditDescription(item.description || '');
    setEditCategoryId(item.categoryId);
    setError(null);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
    setEditCategoryId('');
    setError(null);
  }

  async function handleUpdate(id: string) {
    const formData = new FormData();
    formData.append('name', editName);
    formData.append('description', editDescription);
    formData.append('categoryId', editCategoryId);

    startTransition(async () => {
      const result = await updateItem(id, formData);
      if (result.success) {
        handleCancelEdit();
      } else {
        setError(result.error || 'Error al actualizar el item');
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este item?')) return;

    startTransition(async () => {
      const result = await deleteItem(id);
      if (!result.success) {
        setError(result.error || 'Error al eliminar el item');
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-2xl rounded-lg border border-bg-tertiary bg-white p-8 text-center shadow-sm dark:border-bg-tertiary dark:bg-bg-secondary">
        <p className="text-zinc-500 dark:text-zinc-400">
          No hay items agregados. ¡Agrega tu primer item!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-3">
      <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-text">
        Mis Items ({items.length})
      </h2>

      {error && (
        <div className="rounded-md bg-error/10 p-3 text-sm text-error dark:bg-error/20 dark:text-error">
          {error}
        </div>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border border-bg-tertiary bg-white p-4 shadow-sm dark:border-bg-tertiary dark:bg-bg-secondary"
        >
          {editingId === item.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={isPending}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-success focus:outline-none focus:ring-1 focus:ring-success disabled:opacity-50 dark:border-bg-tertiary dark:bg-bg-tertiary dark:text-text"
                placeholder="Nombre"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                disabled={isPending}
                rows={2}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-success focus:outline-none focus:ring-1 focus:ring-success disabled:opacity-50 dark:border-bg-tertiary dark:bg-bg-tertiary dark:text-text"
                placeholder="Descripción"
              />
              <select
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
                disabled={isPending}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-success focus:outline-none focus:ring-1 focus:ring-success disabled:opacity-50 dark:border-bg-tertiary dark:bg-bg-tertiary dark:text-text"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(item.id)}
                  disabled={isPending}
                  className="flex-1 rounded-md bg-success px-3 py-2 text-sm font-medium text-neutral-100 hover:bg-success/90 disabled:opacity-50"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isPending}
                  className="flex-1 rounded-md bg-bg-tertiary px-3 py-2 text-sm font-medium text-text hover:bg-bg-tertiary/80 disabled:opacity-50 dark:bg-bg-tertiary dark:text-text dark:hover:bg-bg-tertiary/80"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-text">
                    {item.name}
                  </h3>
                  <span className="rounded-full bg-success/20 px-2.5 py-0.5 text-xs font-medium text-success dark:bg-success/30 dark:text-success">
                    {item.category.title}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                  Agregado: {new Date(item.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  disabled={isPending}
                  className="rounded-md bg-success px-3 py-1.5 text-sm font-medium text-neutral-100 hover:bg-success/90 disabled:opacity-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isPending}
                  className="rounded-md bg-error px-3 py-1.5 text-sm font-medium text-white hover:bg-error/90 disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
