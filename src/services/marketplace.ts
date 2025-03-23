import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { EnergyListing, Purchase } from '../types/marketplace';

const LISTINGS_COLLECTION = 'energyListings';
const PURCHASES_COLLECTION = 'energyPurchases';

export const createListing = async (listing: Omit<EnergyListing, 'id' | 'createdAt' | 'status'>) => {
  try {
    const docRef = await addDoc(collection(db, LISTINGS_COLLECTION), {
      ...listing,
      createdAt: serverTimestamp(),
      status: 'available'
    });
    
    // Get the created document to return the complete listing
    const docSnap = await getDoc(doc(db, LISTINGS_COLLECTION, docRef.id));
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as EnergyListing;
    }
    throw new Error('Failed to create listing');
  } catch (error) {
    console.error('Error creating listing:', error);
    throw new Error('Failed to create listing. Please try again.');
  }
};

export const getAvailableListings = async () => {
  try {
    console.log('Creating Firestore query...');
    const q = query(
      collection(db, LISTINGS_COLLECTION),
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc')
    );
    
    console.log('Executing Firestore query...');
    const querySnapshot = await getDocs(q);
    console.log('Query response:', querySnapshot);
    
    const listings = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
        totalPrice: data.energyAmount * data.pricePerKWh
      } as EnergyListing;
    });
    
    console.log('Processed listings:', listings);
    return listings;
  } catch (error) {
    console.error('Detailed error in getAvailableListings:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch listings: ${error.message}`);
    }
    throw new Error('Failed to fetch listings. Please try again.');
  }
};

export const purchaseEnergy = async (listingId: string, buyerId: string) => {
  try {
    // Get the listing
    const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
    const listingSnap = await getDoc(listingRef);
    
    if (!listingSnap.exists()) {
      throw new Error('Listing not found');
    }
    
    const listing = { id: listingSnap.id, ...listingSnap.data() } as EnergyListing;
    
    if (listing.status !== 'available') {
      throw new Error('This listing is no longer available');
    }
    
    if (listing.sellerId === buyerId) {
      throw new Error('You cannot purchase your own listing');
    }
    
    // Create purchase record
    const purchase: Omit<Purchase, 'id'> = {
      listingId,
      buyerId,
      sellerId: listing.sellerId,
      energyAmount: listing.energyAmount,
      pricePerKWh: listing.pricePerKWh,
      totalPrice: listing.totalPrice,
      purchaseDate: new Date(),
      status: 'completed'
    };
    
    // Add purchase record
    const purchaseRef = await addDoc(collection(db, PURCHASES_COLLECTION), purchase);
    
    // Update listing status
    await updateDoc(listingRef, {
      status: 'sold'
    });
    
    return {
      purchaseId: purchaseRef.id,
      ...purchase
    };
  } catch (error) {
    console.error('Error purchasing energy:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to complete purchase. Please try again.');
  }
};

export const getUserListings = async (userId: string) => {
  try {
    const q = query(
      collection(db, LISTINGS_COLLECTION),
      where('sellerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? (doc.data().createdAt as Timestamp).toDate() : new Date()
    })) as EnergyListing[];
  } catch (error) {
    console.error('Error getting user listings:', error);
    throw new Error('Failed to fetch your listings. Please try again.');
  }
};

export const getUserPurchases = async (userId: string) => {
  try {
    const q = query(
      collection(db, PURCHASES_COLLECTION),
      where('buyerId', '==', userId),
      orderBy('purchaseDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Purchase[];
  } catch (error) {
    console.error('Error getting user purchases:', error);
    throw new Error('Failed to fetch your purchases. Please try again.');
  }
}; 