import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CurrencyDollarIcon, BoltIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { EnergyListing } from '../types/marketplace';
import { createListing, getAvailableListings, purchaseEnergy, getUserListings } from '../services/marketplace';

const WattSwapMarketplace = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<EnergyListing[]>([]);
  const [userListings, setUserListings] = useState<EnergyListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // New listing form state
  const [newListing, setNewListing] = useState({
    energyAmount: '',
    pricePerKWh: '',
    location: ''
  });

  useEffect(() => {
    loadListings();
    if (user) {
      loadUserListings();
    }
  }, [user]);

  const loadListings = async () => {
    try {
      setLoading(true);
      console.log('Fetching available listings...');
      const availableListings = await getAvailableListings();
      console.log('Received listings:', availableListings);
      setListings(availableListings);
    } catch (err) {
      console.error('Error in loadListings:', err);
      if (err instanceof Error && err.message.includes('requires an index')) {
        setError('Database indexes are being created. Please wait a few minutes and try again.');
      } else {
        setError('Failed to load listings');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserListings = async () => {
    if (!user) return;
    try {
      const userListings = await getUserListings(user.uid);
      setUserListings(userListings);
    } catch (err) {
      console.error('Failed to load user listings:', err);
      if (err instanceof Error && err.message.includes('requires an index')) {
        console.log('Waiting for database indexes to be created...');
      }
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const energyAmount = parseFloat(newListing.energyAmount);
      const pricePerKWh = parseFloat(newListing.pricePerKWh);

      if (isNaN(energyAmount) || isNaN(pricePerKWh)) {
        setError('Please enter valid numbers');
        return;
      }

      await createListing({
        sellerId: user.uid,
        sellerName: user.displayName || 'Anonymous',
        energyAmount,
        pricePerKWh,
        totalPrice: energyAmount * pricePerKWh,
        location: newListing.location
      });

      setSuccess(true);
      setNewListing({ energyAmount: '', pricePerKWh: '', location: '' });
      loadListings();
      loadUserListings();
    } catch (err) {
      setError('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (listingId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      await purchaseEnergy(listingId, user.uid);
      setSuccess(true);
      loadListings();
    } catch (err) {
      setError('Failed to purchase energy');
    } finally {
      setLoading(false);
    }
  };

  // Market stats (could be calculated from actual data in a real app)
  const marketStats = [
    { name: 'Average Price', value: `$${(listings.reduce((acc, l) => acc + l.pricePerKWh, 0) / listings.length || 0).toFixed(2)}/kWh`, icon: CurrencyDollarIcon },
    { name: 'Available Energy', value: `${listings.reduce((acc, l) => acc + l.energyAmount, 0)} kWh`, icon: BoltIcon },
    { name: 'Active Sellers', value: new Set(listings.map(l => l.sellerId)).size.toString(), icon: ArrowTrendingUpIcon },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">WattSwap Marketplace</h1>

      {/* Market Stats */}
      <div className="stats-grid">
        {marketStats.map((stat) => (
          <div key={stat.name} className="stat-card">
            <div className="stat-content">
              <div className="stat-icon">
                <stat.icon />
              </div>
              <div className="stat-info">
                <div className="stat-label">{stat.name}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Listing Form */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Create New Listing</h2>
        <form onSubmit={handleCreateListing} className="space-y-4">
          <div className="form-group">
            <label htmlFor="energyAmount" className="form-label">Energy Amount (kWh)</label>
            <input
              type="number"
              id="energyAmount"
              className="form-input"
              value={newListing.energyAmount}
              onChange={(e) => setNewListing(prev => ({ ...prev, energyAmount: e.target.value }))}
              placeholder="Enter amount"
              min="0"
              step="0.1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pricePerKWh" className="form-label">Price per kWh ($)</label>
            <input
              type="number"
              id="pricePerKWh"
              className="form-input"
              value={newListing.pricePerKWh}
              onChange={(e) => setNewListing(prev => ({ ...prev, pricePerKWh: e.target.value }))}
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              id="location"
              className="form-input"
              value={newListing.location}
              onChange={(e) => setNewListing(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter your location"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>

      {/* Available Listings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Available Energy Credits</h2>
        {loading ? (
          <p>Loading listings...</p>
        ) : listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="seller-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{listing.sellerName}</h3>
                    <p className="text-sm text-gray-600">{listing.location}</p>
                  </div>
                  <button
                    onClick={() => handlePurchase(listing.id!)}
                    className="btn btn-primary"
                    disabled={loading || listing.sellerId === user?.uid}
                  >
                    {listing.sellerId === user?.uid ? 'Your Listing' : 'Buy Now'}
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold">{listing.energyAmount} kWh</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold">${listing.pricePerKWh}/kWh</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="font-semibold">${listing.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Listed</p>
                    <p className="font-semibold">{listing.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No listings available</p>
        )}
      </div>

      {/* User's Listings */}
      {user && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Your Listings</h2>
          {userListings.length > 0 ? (
            <div className="space-y-4">
              {userListings.map((listing) => (
                <div key={listing.id} className="seller-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">Your Listing</h3>
                      <p className="text-sm text-gray-600">{listing.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      listing.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold">{listing.energyAmount} kWh</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-semibold">${listing.pricePerKWh}/kWh</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't created any listings yet</p>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Operation completed successfully!
        </div>
      )}
    </div>
  );
};

export default WattSwapMarketplace; 