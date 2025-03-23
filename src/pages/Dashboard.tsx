import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChartBarIcon, 
  BoltIcon, 
  CurrencyDollarIcon, 
  GlobeAltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface DrivingData {
  speed: number[];
  acceleration: number[];
  braking: number[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const [drivingData, setDrivingData] = useState<DrivingData>({
    speed: [],
    acceleration: [],
    braking: []
  });
  const [currentSpeed, setCurrentSpeed] = useState('');
  const [currentAcceleration, setCurrentAcceleration] = useState('');
  const [currentBraking, setCurrentBraking] = useState('');
  const [ecoScore, setEcoScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enhanced stats with more engaging descriptions
  const stats = [
    { 
      name: 'Total Distance', 
      value: '1,234 mi', 
      description: 'Miles driven eco-consciously',
      icon: ChartBarIcon 
    },
    { 
      name: 'Energy Saved', 
      value: '45 kWh', 
      description: 'Equivalent to 5 days of home power',
      icon: BoltIcon 
    },
    { 
      name: 'Cost Savings', 
      value: '$89', 
      description: 'Money saved through efficient driving',
      icon: CurrencyDollarIcon 
    },
    { 
      name: 'Environmental Impact', 
      value: '23 kg CO₂', 
      description: 'Carbon emissions reduced',
      icon: GlobeAltIcon 
    },
  ];

  const recentTrips = [
    { 
      date: '2024-03-15', 
      distance: '12.5 mi', 
      efficiency: '92%', 
      savings: '$2.50',
      ecoScore: 95
    },
    { 
      date: '2024-03-14', 
      distance: '8.3 mi', 
      efficiency: '88%', 
      savings: '$1.75',
      ecoScore: 88
    },
    { 
      date: '2024-03-13', 
      distance: '15.2 mi', 
      efficiency: '95%', 
      savings: '$3.25',
      ecoScore: 96
    },
  ];

  const addMeasurement = () => {
    const speed = parseFloat(currentSpeed);
    const acceleration = parseFloat(currentAcceleration);
    const braking = parseFloat(currentBraking);

    if (isNaN(speed) || isNaN(acceleration) || isNaN(braking)) {
      setError('Please enter valid numbers');
      return;
    }

    setDrivingData(prev => ({
      speed: [...prev.speed, speed],
      acceleration: [...prev.acceleration, acceleration],
      braking: [...prev.braking, braking]
    }));

    setCurrentSpeed('');
    setCurrentAcceleration('');
    setCurrentBraking('');
    setError(null);
  };

  const analyzeDriving = async () => {
    if (drivingData.speed.length === 0) {
      setError('Please add at least one measurement');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/analyze-driving', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...drivingData,
          timestamp: new Date().toISOString(),
          trip_id: `trip_${Date.now()}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze driving data');
      }

      const data = await response.json();
      setEcoScore(data.eco_score);
    } catch (err) {
      setError('Failed to analyze driving data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.displayName?.split(' ')[0]}</h1>
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-semibold">Your EcoDrive Dashboard</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.name} className="stat-card">
            <div className="stat-content">
              <div className="stat-icon">
                <stat.icon />
              </div>
              <div className="stat-info">
                <div className="stat-label">{stat.name}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Data Input Card */}
        <div className="card">
          <h2>Record Your Drive</h2>
          <div className="form-group">
            <label htmlFor="speed">Speed (km/h)</label>
            <input
              type="number"
              id="speed"
              value={currentSpeed}
              onChange={(e) => setCurrentSpeed(e.target.value)}
              placeholder="Enter current speed"
              min="0"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="acceleration">Acceleration (m/s²)</label>
            <input
              type="number"
              id="acceleration"
              value={currentAcceleration}
              onChange={(e) => setCurrentAcceleration(e.target.value)}
              placeholder="Enter acceleration rate"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="braking">Braking Force (m/s²)</label>
            <input
              type="number"
              id="braking"
              value={currentBraking}
              onChange={(e) => setCurrentBraking(e.target.value)}
              placeholder="Enter braking force"
              step="0.01"
            />
          </div>
          <button onClick={addMeasurement} className="btn btn-secondary w-full">
            Add Measurement
          </button>
        </div>

        {/* Current Drive Data */}
        <div className="card">
          <h2>Current Drive Data</h2>
          {drivingData.speed.length > 0 ? (
            <div className="measurements-list">
              {drivingData.speed.map((speed, index) => (
                <div key={index} className="measurement-item">
                  <span>Speed: {speed} km/h</span>
                  <span>Acceleration: {drivingData.acceleration[index]} m/s²</span>
                  <span>Braking: {drivingData.braking[index]} m/s²</span>
                </div>
              ))}
              <button 
                onClick={analyzeDriving} 
                className="btn btn-primary w-full mt-4"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Calculate Eco-Score'}
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <BoltIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No measurements recorded yet</p>
              <p className="text-sm mt-2">Add your first measurement to start tracking</p>
            </div>
          )}
        </div>

        {/* Eco-Score Display */}
        <div className="card">
          <h2>Your Eco-Score</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : ecoScore !== null ? (
            <div className="eco-score">
              <div className={`score-circle ${ecoScore >= 70 ? 'good' : ecoScore >= 50 ? 'average' : 'poor'}`}>
                {ecoScore}
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">
                  {ecoScore >= 70 ? 'Excellent!' : ecoScore >= 50 ? 'Good Progress' : 'Room for Improvement'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {ecoScore >= 70 
                    ? 'You\'re driving very efficiently!' 
                    : ecoScore >= 50 
                    ? 'Keep working on smooth acceleration' 
                    : 'Try to drive more smoothly'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <SparklesIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No eco-score calculated yet</p>
              <p className="text-sm mt-2">Add measurements and analyze your driving</p>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Recent Trips */}
      <div className="card mt-8">
        <h2>Recent Trips</h2>
        <div className="overflow-x-auto">
          <table className="recent-trips-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Distance</th>
                <th>Efficiency</th>
                <th>Savings</th>
                <th>Eco-Score</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip, index) => (
                <tr key={index}>
                  <td>{trip.date}</td>
                  <td>{trip.distance}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: trip.efficiency }}
                        ></div>
                      </div>
                      <span>{trip.efficiency}</span>
                    </div>
                  </td>
                  <td>{trip.savings}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      trip.ecoScore >= 90 ? 'bg-green-100 text-green-800' :
                      trip.ecoScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {trip.ecoScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 