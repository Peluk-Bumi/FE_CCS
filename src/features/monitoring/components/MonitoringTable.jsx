import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { 
  Trash2, 
  Edit, 
  Eye, 
  Calendar, 
  Sprout, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import ProjectStatusBadge from '@/shared/components/common/ProjectStatusBadge';
import { resolveProjectDisplay } from '@/shared/utils/projectDisplay';

const MonitoringTable = ({ 
  data = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  userRole = 'user',
  maxMonths = 6 
}) => {
  const [sortField, setSortField] = useState('bulan_monitoring');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'created_at') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSurvivalRateColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSurvivalRateIcon = (rate) => {
    if (rate >= 90) return CheckCircle;
    if (rate >= 75) return TrendingUp;
    return AlertTriangle;
  };

  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Data Monitoring</CardTitle>
          <Badge variant="outline">
            {data.length}/{maxMonths} Bulan
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Belum ada data monitoring</p>
            <p className="text-sm mt-2">Monitoring dilakukan selama {maxMonths} bulan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full border-separate border-spacing-0">
              <thead className="bg-gray-50/80 dark:bg-gray-800/60">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Nama Lembaga</th>
                  <th className="text-left p-3 font-medium">Lokasi</th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('bulan_monitoring')}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Bulan
                      {sortField === 'bulan_monitoring' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium">Survival Rate</th>
                  <th className="text-left p-3 font-medium">Bibit Ditanam</th>
                  <th className="text-left p-3 font-medium">Bibit Mati</th>
                  <th className="text-left p-3 font-medium">Tinggi (cm)</th>
                  <th className="text-left p-3 font-medium">Diameter (cm)</th>
                  <th className="text-left p-3 font-medium">Kondisi Daun</th>
                  <th className="text-center p-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item) => {
                  const { company, location, status } = resolveProjectDisplay(item);
                  const survivalRateValue = Number(item.survival_rate || 0);
                  const SurvivalIcon = getSurvivalRateIcon(survivalRateValue);
                  const survivalColor = getSurvivalRateColor(survivalRateValue);
                  
                  return (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/60">
                      <td className="p-3 align-top">
                        <ProjectStatusBadge status={status} size="small" />
                      </td>
                      <td className="p-3 align-top">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{company}</div>
                        <div className="text-xs text-gray-500">Monitoring bulan {item.bulan_monitoring}</div>
                      </td>
                      <td className="p-3 align-top">
                        <div className="flex items-start gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          <span className="leading-5">{location}</span>
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        <div className="font-medium">Bulan {item.bulan_monitoring}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        <div className="flex items-center gap-2">
                          <SurvivalIcon className={`h-4 w-4 ${survivalColor}`} />
                          <div>
                            <div className={`font-medium ${survivalColor}`}>
                              {survivalRateValue.toFixed(1)}%
                            </div>
                            <Progress 
                              value={survivalRateValue} 
                              className="w-16 h-2"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        <div className="flex items-center gap-2">
                          <Sprout className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{Number(item.jumlah_bibit_ditanam || 0).toLocaleString('id-ID')}</span>
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-600">{Number(item.jumlah_bibit_mati || 0).toLocaleString('id-ID')}</span>
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        <span className="font-medium">{item.tinggi_bibit || '-'}</span>
                      </td>
                      <td className="p-3 align-top">
                        <span className="font-medium">{item.diameter_batang || '-'}</span>
                      </td>
                      <td className="p-3 align-top">
                        <div className="space-y-1">
                          {item.daun_mengering && (
                            <Badge variant="destructive" className="text-xs">
                              Mengering: {item.daun_mengering}
                            </Badge>
                          )}
                          {item.daun_layu && (
                            <Badge variant="secondary" className="text-xs">
                              Layu: {item.daun_layu}
                            </Badge>
                          )}
                          {item.bercak_daun && (
                            <Badge variant="outline" className="text-xs">
                              Bercak: {item.bercak_daun}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView?.(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(userRole === 'admin') && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit?.(item)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete?.(item)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Progress indicator for monitoring completion */}
        {data.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress Monitoring</span>
              <span className="text-sm text-gray-600">
                {data.length} dari {maxMonths} bulan selesai
              </span>
            </div>
            <Progress 
              value={(data.length / maxMonths) * 100} 
              className="w-full h-2"
            />
            {data.length >= maxMonths && (
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Monitoring periode {maxMonths} bulan selesai</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonitoringTable;
