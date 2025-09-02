import { z } from 'zod';

const ViteEnv = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(20),
});

type Env = z.infer<typeof ViteEnv>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;
  const parsed = ViteEnv.safeParse(import.meta.env);
  if (!parsed.success) {
    // Surface all errors at startup to avoid mysterious runtime failures
    const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n');
    // eslint-disable-next-line no-console
    console.error('[env] Invalid Vite env:', issues);
    throw new Error('Invalid environment configuration. Check .env and VITE_* variables.');
  }
  _env = parsed.data;
  return _env;
}