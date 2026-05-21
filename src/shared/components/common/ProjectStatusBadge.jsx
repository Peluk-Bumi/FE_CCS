import React from 'react';
import PropTypes from 'prop-types';

const ProjectStatusBadge = ({ status, size = 'medium', showLabel = true }) => {
  const getStatusConfig = (status) => {
    const configs = {
      planning: {
        label: 'Perencanaan',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
      },
      implementation: {
        label: 'Implementasi',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
      },
      monitoring_1: {
        label: 'Monitoring Bulan 1',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
      },
      monitoring_2: {
        label: 'Monitoring Bulan 2',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
      },
      monitoring_3: {
        label: 'Monitoring Bulan 3',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
      },
      monitoring_4: {
        label: 'Monitoring Bulan 4',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
      },
      monitoring_5: {
        label: 'Monitoring Bulan 5',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
      },
      monitoring_6: {
        label: 'Monitoring Bulan 6',
        color: 'purple',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-200',
      },
      evaluation: {
        label: 'Evaluasi',
        color: 'orange',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200',
      },
      completed: {
        label: 'Selesai',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200',
      },
    };

    return configs[status] || {
      label: status,
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
    };
  };

  const getSizeClasses = (size) => {
    const sizes = {
      small: 'px-2 py-1 text-xs',
      medium: 'px-3 py-1.5 text-sm',
      large: 'px-4 py-2 text-base',
    };
    return sizes[size] || sizes.medium;
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        border rounded-full font-medium
        ${sizeClasses}
        transition-all duration-200
        hover:shadow-sm
      `}
    >
      <span
        className={`
          w-2 h-2 rounded-full
          bg-current opacity-60
        `}
      />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

ProjectStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showLabel: PropTypes.bool,
};

export default ProjectStatusBadge;
