import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { 
  Calendar, 
  Sprout, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Target
} from 'lucide-react';

const MonitoringStats = ({ 
  data = [], 
  loading = false, 
  maxMonths = 6,
  targetSurvivalRate = 85 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate statistics
  const completedMonths = data.length;
  const totalPlanted = data.reduce((sum, item) => sum + (item.jumlah_bibit_ditanam || 0), 0);
  const totalDead = data.reduce((sum, item) => sum + (item.jumlah_bibit_mati || 0), 0);
  const averageSurvivalRate = data.length > 0 
    ? data.reduce((sum, item) => sum + (item.survival_rate || 0), 0) / data.length 
    : 0;

  // Calculate growth metrics
  const growthData = data.map(item => item.tinggi_bibit).filter(Boolean);
  const averageHeight = growthData.length > 0 
    ? growthData.reduce((sum, height) => sum + height, 0) / growthData.length 
    : 0;

  const diameterData = data.map(item => item.diameter_batang).filter(Boolean);
  const averageDiameter = diameterData.length > 0 
    ? diameterData.reduce((sum, diameter) => sum + diameter, 0) / diameterData.length 
    : 0;

  // Health status breakdown
  const healthStatus = data.reduce((acc, item) => {
    const rate = item.survival_rate || 0;
    if (rate >= 90) acc.excellent = (acc.excellent || 0) + 1;
    else if (rate >= 75) acc.good = (acc.good || 0) + 1;
    else acc.poor = (acc.poor || 0) + 1;
    return acc;
  }, {});

  // Leaf condition analysis
  const leafConditions = data.reduce((acc, item) => {
    if (item.daun_mengering && item.daun_mengering !== '<25%') acc.dry = (acc.dry || 0) + 1;
    if (item.daun_layu && item.daun_layu !== '<25%') acc.wilted = (acc.wilted || 0) + 1;
    if (item.bercak_daun && item.bercak_daun !== '<25%') acc.spotted = (acc.spotted || 0) + 1;
    return acc;
  }, {});

  const mainStats = [
    {
      title: 'Progress Monitoring',
      value: `${completedMonths}/${maxMonths}`,
      subtitle: `${Math.round((completedMonths / maxMonths) * 100)}%`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      progress: (completedMonths / maxMonths) * 100
    },
    {
      title: 'Survival Rate Rata-rata',
      value: `${averageSurvivalRate.toFixed(1)}%`,
      subtitle: targetSurvivalRate ? `Target: ${targetSurvivalRate}%` : '',
      icon: TrendingUp,
      color: averageSurvivalRate >= targetSurvivalRate ? 'text-green-600' : 'text-yellow-600',
      bgColor: averageSurvivalRate >= targetSurvivalRate ? 'bg-green-100' : 'bg-yellow-100',
      progress: Math.min(averageSurvivalRate, 100)
    },
    {
      title: 'Total Bibit Ditanam',
      value: totalPlanted.toLocaleString(),
      subtitle: `Mati: ${totalDead.toLocaleString()}`,
      icon: Sprout,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Tinggi Rata-rata',
      value: `${averageHeight.toFixed(1)} cm`,
      subtitle: `Diameter: ${averageDiameter.toFixed(1)} cm`,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const healthStats = [
    {
      label: 'Sangat Baik (≥90%)',
      count: healthStatus.excellent || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Baik (75-89%)',
      count: healthStatus.good || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Kurang (<75%)',
      count: healthStatus.poor || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const leafStats = [
    { label: 'Mengering', count: leafConditions.dry || 0, color: 'text-orange-600' },
    { label: 'Layu', count: leafConditions.wilted || 0, color: 'text-yellow-600' },
    { label: 'Bercak', count: leafConditions.spotted || 0, color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              {stat.progress !== undefined && (
                <Progress value={stat.progress} className="w-full h-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Status and Leaf Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status Kesehatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthStats.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${status.bgColor}`}>
                      <status.icon className={`h-4 w-4 ${status.color}`} />
                    </div>
                    <span className="font-medium">{status.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {status.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Kondisi Daun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leafStats.map((condition, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">{condition.label}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-lg px-3 py-1 ${condition.color}`}
                  >
                    {condition.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target Achievement Alert */}
      {averageSurvivalRate >= targetSurvivalRate && data.length > 0 && (
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Target Tercapai!</h4>
                <p className="text-sm text-green-600">
                  Survival rate rata-rata {averageSurvivalRate.toFixed(1)}% melebihi target {targetSurvivalRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning Alert */}
      {averageSurvivalRate < targetSurvivalRate && data.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-yellow-800">Perlu Perhatian</h4>
                <p className="text-sm text-yellow-600">
                  Survival rate rata-rata {averageSurvivalRate.toFixed(1)}% di bawah target {targetSurvivalRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MonitoringStats;
