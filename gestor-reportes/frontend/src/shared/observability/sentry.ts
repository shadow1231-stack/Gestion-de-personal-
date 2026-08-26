/**
 * Inicialización de Sentry para captura de excepciones en producción (§7).
 * El DSN se lee de VITE_SENTRY_DSN; sin él, Sentry queda inactivo (dev local).
 * Ningún secreto se hardcodea aquí (§3, §4).
 */
import * as Sentry from '@sentry/react';

export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_ENVIRONMENT ?? 'development',
    integrations: [Sentry.browserTracingIntegration()],
    // Muestreo de trazas de rendimiento; ajústalo según el volumen en producción.
    tracesSampleRate: 0.1,
  });
}
