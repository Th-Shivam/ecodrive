export interface EnergyListing {
  id?: string;
  sellerId: string;
  sellerName: string;
  energyAmount: number; // in kWh
  pricePerKWh: number;
  totalPrice: number;
  location: string;
  createdAt: Date;
  status: 'available' | 'sold';
}

export interface Purchase {
  id?: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  energyAmount: number;
  pricePerKWh: number;
  totalPrice: number;
  purchaseDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
} 