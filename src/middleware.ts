import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware Next.js — Protection des routes sensibles côté serveur.
 *
 * Stratégie :
 *  1. Lit le cookie `studroom_token` (envoyé automatiquement par le navigateur).
 *  2. Décode le payload JWT (sans vérification de signature — le backend reste
 *     l'autorité de vérification cryptographique).
 *  3. Vérifie que le rôle est `admin` pour accéder au dashboard.
 *  4. Redirige vers la page d'accueil avec un paramètre `?unauthorized=1`
 *     si la condition n'est pas remplie.
 *
 * Pourquoi sans vérification de signature ici ?
 *  - Le secret JWT n'est pas disponible côté Edge runtime (et ne doit pas l'être).
 *  - Le middleware agit comme un garde de premier niveau pour éviter le rendu SSR
 *    de pages admin à des utilisateurs non authentifiés.
 *  - La vraie vérification cryptographique reste dans le backend Express (requireAdmin).
 *  - Un attaquant qui forgerait un JWT invalide serait bloqué dès le premier appel API.
 */

const AUTH_COOKIE_NAME = 'studroom_token';

/**
 * Décoder le payload JWT sans vérifier la signature.
 *
 * Format cookie-parser (signed: true) : `s:HEADER.PAYLOAD.JWT_SIG.HMAC`
 *   → 4 segments séparés par `.` une fois le préfixe `s:` retiré.
 * Format JWT brut standard        : `HEADER.PAYLOAD.JWT_SIG`
 *   → 3 segments.
 *
 * Dans les deux cas, le payload est toujours le 2e segment (index 1).
 * On utilise atob() (disponible en Edge Runtime) plutôt que Buffer.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    // Retirer le préfixe `s:` ajouté par cookie-parser pour les cookies signés
    const rawToken = token.startsWith('s:') ? token.slice(2) : token;

    const parts = rawToken.split('.');
    // JWT valide : au moins 3 segments (header.payload.signature + éventuel HMAC cookie)
    if (parts.length < 3) return null;

    // Le payload est TOUJOURS le 2e segment (index 1)
    const payloadB64 = parts[1];

    // Base64url → Base64 standard → JSON (Edge Runtime : atob disponible globalement)
    const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    // Padding manquant
    const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Vérifie si le token est expiré */
function isTokenExpired(payload: Record<string, unknown>): boolean {
  if (typeof payload.exp !== 'number') return true;
  return payload.exp * 1000 < Date.now();
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Route /dashboard ──────────────────────────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    const cookieValue = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    // 1. Cookie absent → rediriger
    if (!cookieValue) {
      return redirectUnauthorized(req, 'session_required');
    }

    // 2. Décoder le JWT
    const payload = decodeJwtPayload(cookieValue);

    // 3. Payload invalide → rediriger
    if (!payload) {
      return redirectUnauthorized(req, 'invalid_token');
    }

    // 4. Token expiré → rediriger
    if (isTokenExpired(payload)) {
      return redirectUnauthorized(req, 'session_expired');
    }

    // 5. Rôle non-admin → rediriger avec message 403
    if (payload.role !== 'admin') {
      return redirectForbidden(req);
    }

    // ✅ Admin vérifié — laisser passer
    return NextResponse.next();
  }

  return NextResponse.next();
}

/** Redirection vers la page d'accueil avec raison de l'échec */
function redirectUnauthorized(req: NextRequest, reason: string): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = '/';
  url.searchParams.set('auth_required', reason);
  return NextResponse.redirect(url);
}

/** Redirection vers la page d'accueil avec message d'accès refusé */
function redirectForbidden(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = '/';
  url.searchParams.set('auth_required', 'forbidden');
  return NextResponse.redirect(url);
}

/**
 * Limiter le middleware aux routes qui nécessitent une protection.
 * Exclure les assets statiques, les images Next.js et les API routes.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};
