import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, History, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalScans: 0,
    warningsFound: 0,
    healthyProducts: 0,
    recentScans: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/scan-history');
      const scans = response.data;
      
      const warningsFound = scans.reduce((count, scan) => {
        return count + (scan.analysis_result.warnings?.length || 0);
      }, 0);
      
      const healthyProducts = scans.filter(scan => 
        scan.analysis_result.overall_health_score > 70
      ).length;

      setStats({
        totalScans: scans.length,
        warningsFound,
        healthyProducts,
        recentScans: scans.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Scans',
      value: stats.totalScans,
      icon: Camera,
      color: 'primary',
      description: 'Products analyzed'
    },
    {
      title: 'Warnings Found',
      value: stats.warningsFound,
      icon: AlertTriangle,
      color: 'danger',
      description: 'Health alerts'
    },
    {
      title: 'Healthy Products',
      value: stats.healthyProducts,
      icon: CheckCircle,
      color: 'success',
      description: 'Safe for you'
    },
    {
      title: 'Health Score',
      value: stats.recentScans.length > 0 
        ? Math.round(stats.recentScans.reduce((sum, scan) => 
            sum + scan.analysis_result.overall_health_score, 0) / stats.recentScans.length)
        : 0,
      icon: TrendingUp,
      color: 'warning',
      description: 'Average score'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Track your food scanning activity and health insights
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/scanner"
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Camera className="w-5 h-5" />
              <span>Scan New Product</span>
            </Link>
            <Link
              to="/history"
              className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <History className="w-5 h-5" />
              <span>View Scan History</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Update Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            primary: 'bg-primary-100 text-primary-600',
            success: 'bg-success-100 text-success-600',
            warning: 'bg-warning-100 text-warning-600',
            danger: 'bg-danger-100 text-danger-600'
          };
          
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Scans */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Scans</h2>
        </div>
        <div className="p-6">
          {stats.recentScans.length === 0 ? (
            <div className="text-center py-8">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No scans yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by scanning your first product!
              </p>
              <div className="mt-6">
                <Link
                  to="/scanner"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Product
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        scan.analysis_result.overall_health_score > 70 
                          ? 'bg-success-500' 
                          : scan.analysis_result.overall_health_score > 40 
                          ? 'bg-warning-500' 
                          : 'bg-danger-500'
                      }`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {scan.product_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Health Score: {scan.analysis_result.overall_health_score}/100
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      {scan.analysis_result.warnings?.length || 0} warnings
                    </div>
                    <div className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {new Date(scan.scan_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;