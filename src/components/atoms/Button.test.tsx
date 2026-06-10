import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button component', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading state', () => {
        render(<Button isLoading>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });

    it('is disabled when the disabled prop is true', () => {
        render(<Button disabled>Click me</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies variant classes correctly', () => {
        const { rerender } = render(<Button variant="primary">Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-indigo-600');

        rerender(<Button variant="destructive">Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-red-600');
    });
});
