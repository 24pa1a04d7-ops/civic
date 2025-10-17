import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, TrendingUp, Search, Filter } from 'lucide-react';
import axios from 'axios';

function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      const response = await axios.get('/api/scan-history');
      setScans(response.data);
    } catch (error) {
      console.error('Error fetching scan history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 70) return 'text-success-600';
    if (score >= 40) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getHealthScoreBg = (score) => {
    if (score >= 70) return 'bg-success-100';
    if (score >= 40) return 'bg-warning-100';
    return 'bg-danger-100';
  };

  const getHealthScoreIcon = (score) => {
    if (score >= 70) return <CheckCircle className="w-4 h-4 text-success-500" />;
    if (score >= 40) return <TrendingUp className="w-4 h-4 text-warning-500" />;
    return <AlertTriangle className="w-4 h-4 text-danger-500" />;
  };

  const filteredScans = scans
    .filter(scan => {
      const matchesSearch = scan.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scan.ingredients.some(ingredient => 
                             ingredient.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      
      const matchesFilter = filterScore === 'all' ||
                           (filterScore === 'high' && scan.analysis_result.overall_health_score >= 70) ||
                           (filterScore === 'medium' && scan.analysis_result.overall_health_score >= 40 && scan.analysis_result.overall_health_score < 70) ||
                           (filterScore === 'low' && scan.analysis_result.overall_health_score < 40);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.analysis_result.overall_health_score - a.analysis_result.overall_health_score;
        case 'warnings':
          return (b.analysis_result.warnings?.length || 0) - (a.analysis_result.warnings?.length || 0);
        case 'date':
        default:
          return new Date(b.scan_date) - new Date(a.scan_date);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Scan History</h1>
        <p className="mt-2 text-gray-600">
          Review your past food scans and analysis results
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Health Score Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 appearance-none"
            >
              <option value="all">All Health Scores</option>
              <option value="high">High (70+)</option>
              <option value="medium">Medium (40-69)</option>
              <option value="low">Low (0-39)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Health Score</option>
              <option value="warnings">Sort by Warnings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Scans</p>
              <p className="text-2xl font-semibold text-gray-900">{scans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Healthy Products</p>
              <p className="text-2xl font-semibold text-gray-900">
                {scans.filter(scan => scan.analysis_result.overall_health_score >= 70).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-warning-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {scans.length > 0 
                  ? Math.round(scans.reduce((sum, scan) => sum + scan.analysis_result.overall_health_score, 0) / scans.length)
                  : 0
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-danger-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-danger-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Warnings</p>
              <p className="text-2xl font-semibold text-gray-900">
                {scans.reduce((sum, scan) => sum + (scan.analysis_result.warnings?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scan List */}
      <div className="space-y-4">
        {filteredScans.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No scans found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterScore !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start by scanning your first product!'
              }
            </p>
          </div>
        ) : (
          filteredScans.map((scan) => (
            <div key={scan.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {scan.product_name}
                      </h3>
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getHealthScoreBg(scan.analysis_result.overall_health_score)} ${getHealthScoreColor(scan.analysis_result.overall_health_score)}`}>
                        {getHealthScoreIcon(scan.analysis_result.overall_health_score)}
                        <span>{scan.analysis_result.overall_health_score}/100</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(scan.scan_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{scan.analysis_result.warnings?.length || 0} warnings</span>
                      </div>
                    </div>

                    {/* Ingredients Preview */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {scan.ingredients.slice(0, 8).map((ingredient, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {ingredient}
                          </span>
                        ))}
                        {scan.ingredients.length > 8 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{scan.ingredients.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Warnings Preview */}
                    {scan.analysis_result.warnings && scan.analysis_result.warnings.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Warnings:</p>
                        <div className="space-y-1">
                          {scan.analysis_result.warnings.slice(0, 3).map((warning, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <AlertTriangle className="w-3 h-3 text-danger-500 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-danger-700">
                                {warning.ingredient}: {warning.message}
                              </p>
                            </div>
                          ))}
                          {scan.analysis_result.warnings.length > 3 && (
                            <p className="text-xs text-gray-500">
                              +{scan.analysis_result.warnings.length - 3} more warnings
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Recommendations Preview */}
                    {scan.analysis_result.recommendations && scan.analysis_result.recommendations.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                        <ul className="space-y-1">
                          {scan.analysis_result.recommendations.slice(0, 2).map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-3 h-3 text-success-500 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-700">{rec}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ScanHistory;