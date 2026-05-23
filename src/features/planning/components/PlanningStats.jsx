import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Sprout, 
  TrendingUp, 
  Users,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const PlanningStats = ({ data = [], loading = false }) => {
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
  const totalPlans = data.length;
  const totalSeedlings = data.reduce((sum, item) => sum + (item.jumlah_bibit || 0), 0);
  const uniqueLembaga = [...new Set(data.map(item => item.nama_perusahaan))].length;
  const uniqueLocations = [...new Set(data.map(item => item.lokasi))].length;
  
  // Status breakdown
  const statusCounts = data.reduce((acc, item) => {
    const status = item.status || 'planning';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Activity type breakdown
  const activityCounts = data.reduce((acc, item) => {
    const activity = item.jenis_kegiatan || 'Unknown';
    acc[activity] = (acc[activity] || 0) + 1;
    return acc;
  }, {});

  // Upcoming activities (next 30 days)
  const upcomingActivities = data.filter(item => {
    const activityDate = new Date(item.tanggal_pelaksanaan);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return activityDate >= new Date() && activityDate <= thirtyDaysFromNow;
  });

  const stats = [
    {
      title: 'Total Perencanaan',
      value: totalPlans.toLocaleString(),
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Bibit',
      value: totalSeedlings.toLocaleString(),
      icon: Sprout,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Lembaga',
      value: uniqueLembaga.toLocaleString(),
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Lokasi',
      value: uniqueLocations.toLocaleString(),
      icon: MapPin,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const statusStats = [
    {
      label: 'Planning',
      count: statusCounts.planning || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Implementation',
      count: statusCounts.implementation || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Completed',
      count: statusCounts.completed || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Status Perencanaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusStats.map((status, index) => (
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
            <CardTitle className="text-lg font-semibold">Jenis Kegiatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(activityCounts).map(([activity, count]) => (
                <div key={activity} className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">{activity}</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Activities Alert */}
      {upcomingActivities.length > 0 && (
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-semibold text-orange-800">Kegiatan Akan Datang</h4>
                <p className="text-sm text-orange-600">
                  {upcomingActivities.length} kegiatan akan dilaksanakan dalam 30 hari ke depan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanningStats;
