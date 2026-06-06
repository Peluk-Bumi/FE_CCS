import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import VerificationPageLayout from './VerificationPageLayout';

describe('VerificationPageLayout', () => {
  it('renders scanner section', () => {
    render(
      <VerificationPageLayout
        scannerSection={<div>Scanner Component</div>}
      />
    );
    expect(screen.getByText('Scanner Component')).toBeInTheDocument();
  });

  it('renders header when provided', () => {
    render(
      <VerificationPageLayout
        headerContent={<h1>Verification Header</h1>}
        scannerSection={<div>Scanner</div>}
      />
    );
    expect(screen.getByText('Verification Header')).toBeInTheDocument();
  });

  it('renders instructions section', () => {
    render(
      <VerificationPageLayout
        scannerSection={<div>Scanner</div>}
        instructionsSection={<div>Instructions</div>}
      />
    );
    expect(screen.getByText('Instructions')).toBeInTheDocument();
  });

  it('applies lg:grid-cols-2 class for desktop grid', () => {
    const { container } = render(
      <VerificationPageLayout
        scannerSection={<div>Scanner</div>}
        instructionsSection={<div>Instructions</div>}
      />
    );
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('lg:grid-cols-2');
  });

  it('applies gap-6 and max-md:gap-4 for responsive gaps', () => {
    const { container } = render(
      <VerificationPageLayout
        scannerSection={<div>Scanner</div>}
        instructionsSection={<div>Instructions</div>}
      />
    );
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('gap-6');
    expect(grid).toHaveClass('max-md:gap-4');
  });

  it('hides instructions on mobile (hidden lg:block)', () => {
    const { container } = render(
      <VerificationPageLayout
        scannerSection={<div>Scanner</div>}
        instructionsSection={<div>Instructions</div>}
      />
    );
    const instructionsDiv = container.querySelector('.hidden');
    expect(instructionsDiv).toHaveClass('hidden');
    expect(instructionsDiv).toHaveClass('lg:block');
  });

  it('renders without instructions section when not provided', () => {
    const { container } = render(
      <VerificationPageLayout
        scannerSection={<div>Scanner</div>}
      />
    );
    // Should not have the instructions wrapper div
    const instructionDivs = container.querySelectorAll('.hidden');
    expect(instructionDivs.length).toBe(0);
  });

  it('applies min-h-screen class for full viewport height', () => {
    const { container } = render(
      <VerificationPageLayout
        scannerSection={<div>Scanner</div>}
      />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('min-h-screen');
  });

  it('accepts and applies custom className', () => {
    const { container } = render(
      <VerificationPageLayout
        scannerSection={<div>Scanner</div>}
        className="custom-layout-class"
      />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-layout-class');
  });

  it('scanner section is full width on mobile', () => {
    const { container } = render(
      <VerificationPageLayout
        scannerSection={<div>Scanner</div>}
        instructionsSection={<div>Instructions</div>}
      />
    );
    const scannerDiv = container.querySelector('.max-md\\:w-full');
    expect(scannerDiv).toHaveClass('max-md:w-full');
  });
});
