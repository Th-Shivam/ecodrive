import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  BoltIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

interface EnergyListing {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  price: number;
  status: 'available' | 'sold';
  createdAt: Date;
}

interface EnergyPurchase {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  price: number;
  purchaseDate: Date;
}

const EcoDriveMarketplace = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<EnergyListing[]>([]);
  const [purchases, setPurchases] = useState<EnergyPurchase[]>([]);
  const [selectedListing, setSelectedListing] = useState<EnergyListing | null>(null);
  const [newListing, setNewListing] = useState({ amount: '', price: '' });
  const [marketStats, setMarketStats] = useState({
    totalListings: 0,
    averagePrice: 0,
    totalEnergy: 0
  });

  useEffect(() => {
    // Subscribe to energy listings
    const listingsQuery = query(
      collection(db, 'energyListings'),
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeListings = onSnapshot(listingsQuery, (snapshot) => {
      const listingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as EnergyListing[];
      setListings(listingsData);
    });

    // Subscribe to energy purchases
    const purchasesQuery = query(
      collection(db, 'energyPurchases'),
      orderBy('purchaseDate', 'desc')
    );

    const unsubscribePurchases = onSnapshot(purchasesQuery, (snapshot) => {
      const purchasesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        purchaseDate: doc.data().purchaseDate?.toDate()
      })) as EnergyPurchase[];
      setPurchases(purchasesData);
    });

    return () => {
      unsubscribeListings();
      unsubscribePurchases();
    };
  }, []);

  useEffect(() => {
    // Calculate market statistics
    if (listings.length > 0) {
      const totalEnergy = listings.reduce((sum, listing) => sum + listing.amount, 0);
      const averagePrice = listings.reduce((sum, listing) => sum + listing.price, 0) / listings.length;
      
      setMarketStats({
        totalListings: listings.length,
        averagePrice,
        totalEnergy
      });
    }
  }, [listings]);

  const handleCreateListing = async () => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'energyListings'), {
        sellerId: user.uid,
        sellerName: user.displayName || 'Anonymous',
        amount: parseFloat(newListing.amount),
        price: parseFloat(newListing.price),
        status: 'available',
        createdAt: new Date()
      });

      setNewListing({ amount: '', price: '' });
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  const handlePurchase = async (listing: EnergyListing) => {
    if (!user) return;

    try {
      // Create purchase record
      await addDoc(collection(db, 'energyPurchases'), {
        listingId: listing.id,
        buyerId: user.uid,
        buyerName: user.displayName || 'Anonymous',
        amount: listing.amount,
        price: listing.price,
        purchaseDate: new Date()
      });

      // Update listing status
      await updateDoc(doc(db, 'energyListings', listing.id), {
        status: 'sold'
      });
    } catch (error) {
      console.error('Error purchasing energy:', error);
    }
  };

  return (
    <div className="marketplace-container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Energy Marketplace</h1>
          <p className="text-gray-600 mt-1">Buy and sell excess energy with other users</p>
        </div>
        <button
          onClick={() => setSelectedListing(null)}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Create New Listing
        </button>
      </div>

      <div className="marketplace-grid">
        <div>
          {selectedListing ? (
            <div className="seller-card selected">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Create New Listing</h3>
                  <p className="text-gray-600">List your excess energy for sale</p>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MinusIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (kWh)
                  </label>
                  <input
                    type="number"
                    value={newListing.amount}
                    onChange={(e) => setNewListing({ ...newListing, amount: e.target.value })}
                    className="form-group input"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per kWh ($)
                  </label>
                  <input
                    type="number"
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                    className="form-group input"
                    placeholder="Enter price"
                  />
                </div>
                <button
                  onClick={handleCreateListing}
                  className="btn btn-primary w-full"
                  disabled={!newListing.amount || !newListing.price}
                >
                  Create Listing
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="seller-card"
                  onClick={() => setSelectedListing(listing)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BoltIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{listing.sellerName}</h3>
                      <p className="text-sm text-gray-500">
                        {listing.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{listing.amount} kWh</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">${listing.price}/kWh</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">${(listing.amount * listing.price).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(listing);
                    }}
                    className="btn btn-primary w-full mt-4"
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Market Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Total Listings</span>
                </div>
                <span className="font-medium">{marketStats.totalListings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Average Price</span>
                </div>
                <span className="font-medium">${marketStats.averagePrice.toFixed(2)}/kWh</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BoltIcon className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600">Total Energy Available</span>
                </div>
                <span className="font-medium">{marketStats.totalEnergy} kWh</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Purchases</h2>
            <div className="space-y-4">
              {purchases.slice(0, 5).map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{purchase.buyerName}</p>
                    <p className="text-sm text-gray-500">
                      {purchase.purchaseDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{purchase.amount} kWh</p>
                    <p className="text-sm text-green-600">${(purchase.amount * purchase.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoDriveMarketplace; 