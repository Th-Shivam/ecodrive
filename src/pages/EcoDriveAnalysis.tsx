import { useState } from 'react';
import {
  ChartBarIcon,
  BoltIcon,
  SparklesIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const EcoDriveAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Sample data - replace with real data from your backend
  const metrics = [
    {
      title: 'Average Speed',
      value: '45 km/h',
      change: '+5%',
      isPositive: true,
      icon: ChartBarIcon,
      description: 'Consistent speed maintenance'
    },
    {
      title: 'Energy Efficiency',
      value: '92%',
      change: '+8%',
      isPositive: true,
      icon: BoltIcon,
      description: 'Optimal energy usage'
    },
    {
      title: 'Smooth Driving Score',
      value: '88/100',
      change: '+12',
      isPositive: true,
      icon: SparklesIcon,
      description: 'Minimal harsh acceleration'
    },
    {
      title: 'Eco Impact',
      value: '-15kg CO₂',
      change: '-25%',
      isPositive: true,
      icon: LightBulbIcon,
      description: 'Reduced carbon footprint'
    }
  ];

  const recommendations = [
    {
      title: 'Acceleration Optimization',
      description: 'Maintain steady acceleration between 0-20 km/h for better efficiency',
      impact: 'High',
      icon: ArrowTrendingUpIcon
    },
    {
      title: 'Speed Management',
      description: 'Keep speed consistent on highways to reduce energy consumption',
      impact: 'Medium',
      icon: ChartBarIcon
    },
    {
      title: 'Braking Technique',
      description: 'Use regenerative braking more frequently to recover energy',
      impact: 'High',
      icon: BoltIcon
    }
  ];

  const timeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="analysis-container p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">EcoDrive Analysis</h1>
          <p className="text-gray-600 mt-1">Detailed insights into your driving efficiency</p>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="period" className="text-sm font-medium text-gray-700">
            Time Period:
          </label>
          <select
            id="period"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="form-select"
          >
            {timeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="stats-grid mb-8">
        {metrics.map((metric) => (
          <div key={metric.title} className="stat-card">
            <div className="stat-content">
              <div className="stat-icon">
                <metric.icon aria-hidden="true" />
              </div>
              <div className="stat-info">
                <div className="stat-label">{metric.title}</div>
                <div className="stat-value">
                  {metric.value}
                  <span className={`text-sm ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{metric.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircleIcon className="section-header-icon text-green-500" aria-hidden="true" />
          <h2 className="text-xl font-semibold">Driving Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <div key={rec.title} className="recommendation-card">
              <div className="flex items-start gap-3">
                <div className="recommendation-icon">
                  <rec.icon aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rec.impact === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rec.impact} Impact
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Efficiency Trends */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ArrowTrendingUpIcon className="section-header-icon text-blue-500" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Efficiency Trends</h2>
          </div>
          <div className="text-sm text-gray-500">Updated daily</div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          {/* Placeholder for charts - you can integrate your preferred charting library here */}
          <p className="text-gray-500">Efficiency trends visualization will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default EcoDriveAnalysis; 