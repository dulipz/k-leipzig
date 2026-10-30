import type { APIRoute } from 'astro';
import { COOKIE } from '../../lib/sinahamala';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(COOKIE, { path: '/sinahamala' });
  return redirect('/sinahamala', 303);
};
