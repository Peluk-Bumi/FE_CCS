import React from 'react';
import PropTypes from 'prop-types';
import StatusBadge from '@/shared/components/ui/badge/StatusBadge';

const ProjectStatusBadge = ({ status, size = 'medium', showLabel = true }) => {
  const getStatusConfig = (status) => {
    const configs = {
      planning: {
        label: 'Perencanaan',
        variant: 'info',
      },
      implementation: {
        label: 'Implementasi',
        variant: 'warning',
      },
      monitoring: { 
        label: 'Monitoring', 
        variant: 'success' 
      },
      evaluation: {
        label: 'Evaluasi',
        variant: 'warning',
      },
      completed: {
        label: 'Selesai',
        variant: 'default',
      },
    };

    return configs[status] || {
      label: status,
      variant: 'default',
    };
  };

  const config = getStatusConfig(status);

  return (
    <StatusBadge 
      variant={config.variant} 
      label={showLabel ? config.label : ''} 
      size={size} 
    />
  );
};

ProjectStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showLabel: PropTypes.bool,
};

export default ProjectStatusBadge;
