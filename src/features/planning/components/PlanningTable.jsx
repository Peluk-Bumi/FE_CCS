import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Trash2, Edit, Eye, MapPin, Calendar, Building, Download } from 'lucide-react';
import { formatPlanningStatus } from '../utils/planningUtils';

const PlanningTable = ({ 
  data = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  onQrDownload,
  userRole = 'user' 
}) => {
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const hasActions = Boolean(onView || onEdit || onDelete || onQrDownload);

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'created_at' || sortField === 'tanggal_pelaksanaan') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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
        <CardTitle className="text-lg font-semibold">Daftar Perencanaan</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Belum ada data perencanaan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('nama_perusahaan')}
                  >
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      Perusahaan
                      {sortField === 'nama_perusahaan' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium">Kegiatan</th>
                  <th className="text-left p-3 font-medium">Lokasi</th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('tanggal_pelaksanaan')}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Tanggal
                      {sortField === 'tanggal_pelaksanaan' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium">Jumlah Bibit</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  {hasActions && <th className="text-center p-3 font-medium">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{item.nama_perusahaan}</div>
                      <div className="text-sm text-gray-500">ID: {item.user_id}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">
                        {item.jenis_kegiatan}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{item.lokasi}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        {new Date(item.tanggal_pelaksanaan).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm font-medium">{item.jumlah_bibit.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{item.jenis_bibit}</div>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={formatPlanningStatus(item.status)?.variant || 'default'}
                      >
                        {formatPlanningStatus(item.status)?.label || item.status}
                      </Badge>
                    </td>
                    {hasActions && (
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          {onView && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onView(item)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {onEdit && (userRole === 'admin' || item.user_id === parseInt(localStorage.getItem('userId'))) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (userRole === 'admin' || item.user_id === parseInt(localStorage.getItem('userId'))) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(item)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {onQrDownload && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onQrDownload(item)}
                              className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700"
                              title="Unduh QR"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanningTable;
