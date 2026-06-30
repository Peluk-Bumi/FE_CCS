import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PagePaddingContainer from './PagePaddingContainer';

describe('PagePaddingContainer', () => {
  it('renders children correctly', () => {
    render(
      <PagePaddingContainer>
        <div>Page Content</div>
      </PagePaddingContainer>
    );
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('applies pb-20 class by default (mobile padding)', () => {
    const { container } = render(
      <PagePaddingContainer>
        <div>Content</div>
      </PagePaddingContainer>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('max-md:pb-20');
  });

  it('applies pb-24 class when hasFAB is true', () => {
    const { container } = render(
      <PagePaddingContainer hasFAB={true}>
        <div>Content</div>
      </PagePaddingContainer>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('max-md:pb-24');
  });

  it('applies extraPadding when provided', () => {
    const { container } = render(
      <PagePaddingContainer extraPadding="pt-10">
        <div>Content</div>
      </PagePaddingContainer>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('pt-10');
  });

  it('ignores hasFooter prop gracefully', () => {
    render(
      <PagePaddingContainer hasFooter={true}>
        <div>Content with Footer</div>
      </PagePaddingContainer>
    );
    expect(screen.getByText('Content with Footer')).toBeInTheDocument();
  });

  it('combines padding classes correctly', () => {
    const { container } = render(
      <PagePaddingContainer 
        hasFAB={true}
        extraPadding="pt-5"
      >
        <div>Content</div>
      </PagePaddingContainer>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('max-md:pb-20');
    expect(wrapper).toHaveClass('max-md:pb-24');
    expect(wrapper).toHaveClass('pt-5');
  });

  it('handles all props together', () => {
    render(
      <PagePaddingContainer 
        hasFooter={true}
        hasFAB={true}
        extraPadding="pt-10 px-4"
      >
        <div>Complete Page Layout</div>
      </PagePaddingContainer>
    );
    expect(screen.getByText('Complete Page Layout')).toBeInTheDocument();
  });

  it('applies empty extraPadding without error', () => {
    const { container } = render(
      <PagePaddingContainer extraPadding="">
        <div>Content</div>
      </PagePaddingContainer>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('max-md:pb-20');
  });
});
