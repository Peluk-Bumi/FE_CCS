import React from 'react';
import StatusBadge from '@/shared/components/ui/badge/StatusBadge';
import { Badge } from '@/shared/components/ui/badge';
import PageTitle from '@/shared/components/common/PageTitle';
import { FiTag } from 'react-icons/fi';

const DemoBadges = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageTitle
        type="page"
        badge="UI Components"
        badgeIcon={FiTag}
        title="Badge System Showcase"
        description="Berbagai varian dan gaya badge yang tersedia dalam sistem Peluk Bumi."
      />

      {/* ── StatusBadge (Custom Dot Style) ─────────────────────────────────── */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Status Badge (Dot Style)</h2>
          <p className="text-sm text-gray-500">Gaya kustom dengan indikator titik tebal untuk status proses.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Variants */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Variants</h3>
            <div className="flex flex-wrap gap-3">
              <StatusBadge label="Default" variant="default" />
              <StatusBadge label="Primary" variant="primary" />
              <StatusBadge label="Success" variant="success" />
              <StatusBadge label="Warning" variant="warning" />
              <StatusBadge label="Error" variant="error" />
              <StatusBadge label="Info" variant="info" />
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <StatusBadge label="Small Badge" size="small" variant="success" />
              <StatusBadge label="Medium Badge" size="medium" variant="primary" />
              <StatusBadge label="Large Badge" size="large" variant="info" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Standard Badge (Shadcn Style) ─────────────────────────────────── */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Standard Badge (Shadcn Style)</h2>
          <p className="text-sm text-gray-500">Gaya standar berbasis Radix/Shadcn untuk label informasi umum.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      {/* ── Real World Examples ─────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Contoh Penggunaan Nyata</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-md">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold text-gray-900 dark:text-gray-100">Penanaman Mangrove #202</h4>
            <StatusBadge label="In Progress" variant="warning" size="small" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Lokasi: Pesisir Utara Jakarta</p>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px]">Mangrove</Badge>
            <Badge variant="outline" className="text-[10px]">CSR</Badge>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoBadges;
