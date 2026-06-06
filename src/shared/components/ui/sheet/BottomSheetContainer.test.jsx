import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BottomSheetContainer from './BottomSheetContainer';

describe('BottomSheetContainer', () => {
  const mockOnClose = vi.fn();

  it('does not render when isOpen is false', () => {
    render(
      <BottomSheetContainer
        isOpen={false}
        onClose={mockOnClose}
      >
        <div>Sheet Content</div>
      </BottomSheetContainer>
    );
    expect(screen.queryByText('Sheet Content')).not.toBeInTheDocument();
  });

  it('renders sheet content when isOpen is true', () => {
    render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
      >
        <div>Sheet Content</div>
      </BottomSheetContainer>
    );
    expect(screen.getByText('Sheet Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
        title="Sheet Title"
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
        title="Sheet Title"
        subtitle="Sheet Subtitle"
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    expect(screen.getByText('Sheet Subtitle')).toBeInTheDocument();
  });

  it('applies fixed positioning classes', () => {
    const { container } = render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const sheet = container.querySelector('[role="dialog"]');
    expect(sheet).toHaveClass('fixed');
  });

  it('applies rounded top corners (rounded-t-3xl)', () => {
    const { container } = render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const sheet = container.querySelector('[role="dialog"]');
    expect(sheet).toHaveClass('rounded-t-3xl');
  });

  it('applies z-[85] for proper stacking by default', () => {
    const { container } = render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const sheet = container.querySelector('[role="dialog"]');
    expect(sheet).toHaveClass('z-[85]');
  });

  it('has role="dialog" for accessibility', () => {
    const { container } = render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const sheet = container.querySelector('[role="dialog"]');
    expect(sheet).toHaveAttribute('role', 'dialog');
    expect(sheet).toHaveAttribute('aria-modal', 'true');
  });

  it('has overflow-y-auto for scrollable content', () => {
    const { container } = render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const contentWrapper = container.querySelector('.overflow-y-auto');
    expect(contentWrapper).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
        className="custom-sheet-class"
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const sheet = container.querySelector('[role="dialog"]');
    expect(sheet).toHaveClass('custom-sheet-class');
  });

  it('accepts maxHeight prop', () => {
    const { container } = render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
        maxHeight="75vh"
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const sheet = container.querySelector('[role="dialog"]');
    expect(sheet).toHaveStyle({ maxHeight: '75vh' });
  });

  it('renders close button in header when title is provided', () => {
    render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
        title="Modal Title"
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const closeButton = screen.getByLabelText('Tutup');
    expect(closeButton).toBeInTheDocument();
  });

  it('renders close button even without title (showCloseButton defaults to true)', () => {
    render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const closeButton = screen.getByLabelText('Tutup');
    expect(closeButton).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
        title="Modal Title"
        showCloseButton={false}
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const closeButton = screen.queryByLabelText('Tutup');
    expect(closeButton).not.toBeInTheDocument();
  });

  it('hides handle bar when showHandle is false', () => {
    const { container } = render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
        showHandle={false}
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const handleBar = container.querySelector('.bg-gray-300.dark\\:bg-gray-600');
    expect(handleBar).not.toBeInTheDocument();
  });

  it('renders backdrop with z-[75] by default', () => {
    const { container } = render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).toHaveClass('z-[75]');
  });

  it('applies shadow-2xl for depth', () => {
    const { container } = render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const sheet = container.querySelector('[role="dialog"]');
    expect(sheet).toHaveClass('shadow-2xl');
  });

  it('renders headerRight element when provided', () => {
    render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
        title="Modal Title"
        headerRight={<button>Custom Action</button>}
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('applies custom z-index values', () => {
    const { container } = render(
      <BottomSheetContainer
        isOpen={true}
        onClose={mockOnClose}
        backdropZIndex="z-[60]"
        sheetZIndex="z-[70]"
      >
        <div>Content</div>
      </BottomSheetContainer>
    );
    const backdrop = container.querySelector('[role="presentation"]');
    const sheet = container.querySelector('[role="dialog"]');
    expect(backdrop).toHaveClass('z-[60]');
    expect(sheet).toHaveClass('z-[70]');
  });
});
