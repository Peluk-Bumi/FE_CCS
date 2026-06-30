import React from 'react';
import { cn } from '@/shared/utils/utils';

/**
 * MainContainer
 * 
 * Komponen wrapper standar untuk semua halaman utama aplikasi.
 * Menjaga konsistensi lebar maksimal (max-w-7xl), padding horizontal,
 * dan padding vertikal di berbagai ukuran layar agar seragam.
 * 
 * @param {React.ReactNode} children - Isi halaman
 * @param {string} [className] - Class tambahan jika diperlukan
 */
export default function MainContainer({ children, className }) {
  return (
    <div className={cn("relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4 md:pt-8 md:pb-24", className)}>
      {children}
    </div>
  );
}
