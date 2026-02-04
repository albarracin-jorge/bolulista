'use client';

import { useState, useTransition } from 'react';
import { loginUser, registerUser } from '@/app/actions/auth';

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = isRegister ? await registerUser(formData) : await loginUser(formData);
      if (!result.success) {
        setError(result.error || 'Error inesperado');
      }
    });
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-bg-tertiary bg-white p-6 shadow-sm dark:border-bg-tertiary dark:bg-bg-secondary">
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-text">
        {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
      </h2>

      {error && (
        <div className="mb-4 rounded-md bg-error/10 p-3 text-sm text-error dark:bg-error/20 dark:text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-text"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isPending}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-success focus:outline-none focus:ring-1 focus:ring-success disabled:opacity-50 dark:border-bg-tertiary dark:bg-bg-tertiary dark:text-text dark:placeholder-zinc-500"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-text"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            disabled={isPending}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-success focus:outline-none focus:ring-1 focus:ring-success disabled:opacity-50 dark:border-bg-tertiary dark:bg-bg-tertiary dark:text-text dark:placeholder-zinc-500"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-success px-4 py-2 font-medium text-neutral-100 hover:bg-success/90 disabled:opacity-50"
        >
          {isPending ? 'Procesando...' : isRegister ? 'Crear cuenta' : 'Ingresar'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm text-text hover:text-text/80"
        >
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
}
