import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMousePointer,
  FiGrid,
  FiType,
  FiTag,
  FiColumns,
  FiArrowRight,
  FiLayout,
} from 'react-icons/fi';
import PageTitle from '@/shared/components/common/PageTitle';
import { FiMonitor } from 'react-icons/fi';

const demos = [
  {
    key: 'buttons',
    title: 'Buttons',
    description: 'Semua tipe button, variant, dan floating action button.',
    icon: FiMousePointer,
    path: '/demo/buttons',
    accent: 'bg-blue-500',
  },
  {
    key: 'cards',
    title: 'Dashboard Cards',
    description: 'FieldDashboardCard, LocationStatus, TreeProgress, dll.',
    icon: FiGrid,
    path: '/demo/cards',
    accent: 'bg-emerald-500',
  },
  {
    key: 'inputs',
    title: 'Inputs',
    description: 'Text input, select, checkbox, radio, dan form controls.',
    icon: FiType,
    path: '/demo/inputs',
    accent: 'bg-purple-500',
  },
  {
    key: 'badges',
    title: 'Badges',
    description: 'Status badges, pill badges, dan icon badges.',
    icon: FiTag,
    path: '/demo/badges',
    accent: 'bg-amber-500',
  },
  {
    key: 'tabs',
    title: 'Page Tabs',
    description: 'Varian tabs untuk sub-navigasi halaman dan modal.',
    icon: FiColumns,
    path: '/demo/tabs',
    accent: 'bg-rose-500',
  },
  {
    key: 'accordion',
    title: 'Accordion',
    description: 'Collapsible panels dengan animasi smooth.',
    icon: FiLayout,
    path: '/demo/accordion',
    accent: 'bg-indigo-500',
  },
  {
    key: 'modals',
    title: 'Animated Modals',
    description: 'Custom framer-motion modals dengan berbagai variant.',
    icon: FiMonitor,
    path: '/demo/modals',
    accent: 'bg-cyan-500',
  },
];

export default function DemoIndexPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 pt-16 md:pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTitle
          type="page"
          badge="Developer"
          badgeIcon={FiLayout}
          title="Component Library"
          description="Kumpulan demo interaktif untuk semua komponen UI yang digunakan di aplikasi ini."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {demos.map((demo, index) => {
            const Icon = demo.icon;
            return (
              <motion.button
                key={demo.key}
                onClick={() => navigate(demo.path)}
                className="group relative flex flex-col items-start gap-4 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${demo.accent} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                    {demo.title}
                    <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {demo.description}
                  </p>
                </div>

                {/* Hover accent line */}
                <div className={`absolute bottom-0 left-6 right-6 h-1 ${demo.accent} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
              </motion.button>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Halaman ini hanya tersedia di mode development.
          </p>
        </div>
      </div>
    </div>
  );
}
