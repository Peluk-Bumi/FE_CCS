import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiPlus } from 'react-icons/fi';
import FloatingActionButton from './FloatingActionButton';

describe('FloatingActionButton', () => {
  const mockOnClick = vi.fn();

  it('renders FAB with correct icon', () => {
    render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
      />
    );
    // Check if button exists with aria-label
    const button = screen.getByLabelText('Add Item');
    expect(button).toBeInTheDocument();
  });

  it('has 56px width and height (w-14 h-14)', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('w-14');
    expect(button).toHaveClass('h-14');
  });

  it('is hidden on desktop and visible on mobile', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
        visibleOn="mobile"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('hidden');
    expect(button).toHaveClass('max-md:flex');
  });

  it('applies primary variant classes by default', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-green-600');
  });

  it('applies secondary variant classes when specified', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
        variant="secondary"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-gray-400');
  });

  it('applies accent variant classes when specified', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
        variant="accent"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-gradient-to-br');
  });

  it('positions at bottom-right by default', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('bottom-5');
    expect(button).toHaveClass('right-4');
  });

  it('positions at bottom-left when specified', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
        position="bottom-left"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('bottom-5');
    expect(button).toHaveClass('left-4');
  });

  it('is fixed positioned', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('fixed');
  });

  it('has z-40 stacking context', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('z-40');
  });

  it('has rounded-full for circular shape', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('rounded-full');
  });

  it('has proper focus styles', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('focus:outline-none');
    expect(button).toHaveClass('focus:ring-2');
  });

  it('accepts and renders action prop for tracking', () => {
    const { container } = render(
      <FloatingActionButton
        onClick={mockOnClick}
        icon={FiPlus}
        label="Add Item"
        action="create-report"
      />
    );
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('data-action', 'create-report');
  });
});
