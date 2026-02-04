import AddItemForm from '@/components/add-item-form';
import AuthForm from '@/components/auth-form';
import ItemList from '@/components/item-list';
import { logoutUser } from '@/app/actions/auth';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export default async function Home() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 font-sans dark:bg-bg-primary">
        <AuthForm />
      </div>
    );
  }

  const [items, categories, user] = await Promise.all([
    prisma.item.findMany({
      where: { userId: session.userId },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.category.findMany({
      where: { userId: session.userId },
      orderBy: {
        title: 'asc',
      },
    }),
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { email: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 py-8 font-sans dark:bg-bg-primary">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-text">
            BoluLista
          </h1>
          <div className="mt-4 flex flex-col items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>{user?.email}</span>
            <form action={logoutUser}>
              <button
                type="submit"
                className="rounded-md bg-bg-tertiary px-3 py-1.5 text-text hover:bg-bg-tertiary/80"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </header>

        <div className="flex flex-col items-center gap-8">
          <AddItemForm categories={categories} />
          <ItemList items={items} categories={categories} />
        </div>
      </div>
    </div>
  );
}
