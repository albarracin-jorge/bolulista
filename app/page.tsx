import AddItemForm from '@/components/add-item-form';
import ItemList from '@/components/item-list';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const [items, categories] = await Promise.all([
    prisma.item.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.category.findMany({
      orderBy: {
        title: 'asc',
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 py-8 font-sans dark:bg-bg-primary">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-text">
            BoluLista
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Organiza tus compras por categorías
          </p>
        </header>

        <div className="flex flex-col items-center gap-8">
          <AddItemForm categories={categories} />
          <ItemList items={items} categories={categories} />
        </div>
      </div>
    </div>
  );
}
