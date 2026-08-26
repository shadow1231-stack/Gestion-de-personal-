import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '@/app/App';

describe('App', () => {
  it('renderiza la marca en la pantalla de autenticación', () => {
    render(<App />);
    expect(screen.getByText('Gestor de Reportes')).toBeInTheDocument();
  });
});
