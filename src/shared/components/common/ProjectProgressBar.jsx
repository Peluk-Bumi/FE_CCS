import React from 'react';
import PropTypes from 'prop-types';
import ProjectStatusBadge from './ProjectStatusBadge';

const ProjectProgressBar = ({ 
  status, 
  progressPercentage, 
  showStatusBadge = true, 
  showPercentage = true,
  height = 'h-2',
  className = '',
}) => {
  const getProgressColor = (status) => {
    const colors = {
      planning: 'bg-blue-500',
      implementation: 'bg-yellow-500',
      monitoring_1: 'bg-green-500',
      monitoring_2: 'bg-green-500',
      monitoring_3: 'bg-green-500',
      monitoring_4: 'bg-green-500',
      monitoring_5: 'bg-green-500',
      monitoring_6: 'bg-purple-500',
      evaluation: 'bg-orange-500',
      completed: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPhaseInfo = (status) => {
    const phases = [
      'planning', 'implementation', 
      'monitoring_1', 'monitoring_2', 'monitoring_3', 
      'monitoring_4', 'monitoring_5', 'monitoring_6', 
      'completed'
    ];
    
    const currentIndex = phases.indexOf(status);
    const totalPhases = phases.length;
    
    return {
      currentPhase: currentIndex + 1,
      totalPhases,
      isCompleted: status === 'completed',
    };
  };

  const phaseInfo = getPhaseInfo(status);
  const progressColor = getProgressColor(status);

  return (
    <div className={`w-full ${className}`}>
      {/* Progress bar container */}
      <div className="relative">
        {/* Background track */}
        <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
          {/* Progress fill */}
          <div
            className={`
              ${height} ${progressColor} rounded-full
              transition-all duration-500 ease-out
              relative overflow-hidden
            `}
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Animated shimmer effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -translate-x-full animate-pulse"
              style={{
                animation: 'shimmer 2s infinite',
              }}
            />
          </div>
        </div>
        
        {/* Phase indicators */}
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {[...Array(phaseInfo.totalPhases)].map((_, index) => (
            <div
              key={index}
              className={`
                w-3 h-3 rounded-full border-2 bg-white
                ${index < phaseInfo.currentPhase - 1 
                  ? 'border-blue-500 bg-blue-500' 
                  : index === phaseInfo.currentPhase - 1
                  ? 'border-blue-500 bg-white'
                  : 'border-gray-300 bg-white'
                }
                transition-all duration-300
              `}
            />
          ))}
        </div>
      </div>

      {/* Status and progress info */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showStatusBadge && (
            <ProjectStatusBadge status={status} size="small" />
          )}
          <span className="text-sm text-gray-600">
            Phase {phaseInfo.currentPhase} of {phaseInfo.totalPhases}
          </span>
        </div>
        
        {showPercentage && (
          <div className="text-right">
            <span className="text-sm font-medium text-gray-900">
              {Math.round(progressPercentage)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">
              Complete
            </span>
          </div>
        )}
      </div>

      {/* Phase labels */}
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Planning</span>
        <span>Implementation</span>
        <span>Monitoring</span>
        <span>Evaluation</span>
        <span>Complete</span>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

ProjectProgressBar.propTypes = {
  status: PropTypes.string.isRequired,
  progressPercentage: PropTypes.number.isRequired,
  showStatusBadge: PropTypes.bool,
  showPercentage: PropTypes.bool,
  height: PropTypes.string,
  className: PropTypes.string,
};

export default ProjectProgressBar;
