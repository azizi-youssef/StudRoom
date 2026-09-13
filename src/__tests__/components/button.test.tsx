import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button component', () => {
  it('renders children correctly', () => {
    render(<Button>Réserver</Button>);
    expect(screen.getByRole('button', { name: /réserver/i })).toBeInTheDocument();
  });

  it('defaults to type="button" to prevent accidental form submission', () => {
    render(<Button>OK</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('applies primary variant classes by default', () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/primary-/);
  });

  it('applies the correct variant class for "outline"', () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/bg-white/);
  });

  it('applies the correct variant class for "danger"', () => {
    render(<Button variant="danger">Supprimer</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/red-/);
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Indisponible</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    const handler = jest.fn();
    render(<Button onClick={handler}>Cliquez</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handler = jest.fn();
    render(<Button disabled onClick={handler}>Désactivé</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('merges custom className', () => {
    render(<Button className="my-custom-class">Custom</Button>);
    expect(screen.getByRole('button').className).toMatch(/my-custom-class/);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
