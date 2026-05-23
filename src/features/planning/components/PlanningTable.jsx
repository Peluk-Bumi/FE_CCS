import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Trash2, Edit, Eye, MapPin, Calendar, Building, Download } from 'lucide-react';
import ProjectStatusBadge from '@/shared/components/common/ProjectStatusBadge';
import { resolveProjectDisplay } from '@/shared/utils/projectDisplay';

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
            <table className="min-w-[980px] w-full border-separate border-spacing-0">
              <thead className="bg-gray-50/80 dark:bg-gray-800/60">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-medium">Status</th>
                  <th 
                    className="group px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => handleSort('nama_perusahaan')}
                  >
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>Nama Lembaga</span>
                      {sortField === 'nama_perusahaan' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium">Lokasi</th>
                  <th className="text-left p-3 font-medium">Kegiatan</th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
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
                  {hasActions && <th className="text-center p-3 font-medium">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/60">
                    {(() => {
                      const { company, location, status } = resolveProjectDisplay(item);

                      return (
                        <>
                          <td className="p-3 align-top">
                            <ProjectStatusBadge status={status} size="small" />
                          </td>
                          <td className="p-3 align-top">
                            <div className="font-medium text-gray-900 dark:text-gray-100">{company}</div>
                            <div className="text-sm text-gray-500">ID: {item.user_id}</div>
                          </td>
                          <td className="p-3 align-top">
                            <div className="flex items-start gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                              <span className="leading-5">{location}</span>
                            </div>
                          </td>
                          <td className="p-3 align-top">
                            <Badge variant="outline">
                              {item.jenis_kegiatan}
                            </Badge>
                          </td>
                          <td className="p-3 align-top">
                            <div className="text-sm">
                              {new Date(item.tanggal_pelaksanaan).toLocaleDateString('id-ID')}
                            </div>
                          </td>
                          <td className="p-3 align-top">
                            <div className="text-sm font-medium">{Number(item.jumlah_bibit || 0).toLocaleString('id-ID')}</div>
                            <div className="text-xs text-gray-500">{item.jenis_bibit}</div>
                          </td>
                        </>
                      );
                    })()}
                    {hasActions && (
                      <td className="p-3 align-top">
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
