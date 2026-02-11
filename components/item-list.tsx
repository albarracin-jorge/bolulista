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
  link: string | null;
  imageUrl: string | null;
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
  const [editLink, setEditLink] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleEdit(item: Item) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditDescription(item.description || '');
    setEditLink(item.link || '');
    setEditImageUrl(item.imageUrl || '');
    setEditCategoryId(item.categoryId);
    setError(null);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
    setEditLink('');
    setEditImageUrl('');
    setEditCategoryId('');
    setError(null);
  }

  async function handleUpdate(id: string) {
    const formData = new FormData();
    formData.append('name', editName);
    formData.append('description', editDescription);
    formData.append('link', editLink);
    formData.append('imageUrl', editImageUrl);
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
              <input
                type="url"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                disabled={isPending}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-success focus:outline-none focus:ring-1 focus:ring-success disabled:opacity-50 dark:border-bg-tertiary dark:bg-bg-tertiary dark:text-text"
                placeholder="Link del producto (ej: https://...)"
              />
              <input
                type="url"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                disabled={isPending}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-success focus:outline-none focus:ring-1 focus:ring-success disabled:opacity-50 dark:border-bg-tertiary dark:bg-bg-tertiary dark:text-text"
                placeholder="URL de la imagen (ej: https://...)"
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
              {item.imageUrl && (
                <div className="mb-3 overflow-hidden rounded-lg">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-48 w-full object-cover"
                  />
                </div>
              )}
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
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-success hover:underline"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Ver producto
                  </a>
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
