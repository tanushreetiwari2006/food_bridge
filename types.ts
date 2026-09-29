export type Role = 'donor' | 'ngo' | 'admin' | 'volunteer';

export interface AuthUser {
  id: string;
  phone: string;
  role: Role;
  name: string;
  area: string;
  orgName?: string;
  orgType?: string;
  registrationNumber?: string;
  verified: boolean;
  joinedAt: string;
}

export interface Helper {
  id: string;
  name: string;
  phone: string;
  ownerId: string;
  ownerName: string;
  ownerRole: 'donor' | 'ngo';
}

export type FoodType = 'veg' | 'non-veg' | 'dry';

export type ListingStatus = 'forecast' | 'ready' | 'claimed' | 'completed' | 'expired' | 'no-show';

export type PickupMethod = 'ngo_pickup' | 'donor_drop' | 'helper_pickup';

export interface Donor {
  id: string;
  name: string;
  phone: string;
  area: string;
  type: string;
  reliabilityScore: number;
  mealsRescued: number;
  joinedDate: string;
}

export interface NGO {
  id: string;
  name: string;
  phone: string;
  area: string;
  type: string;
  registrationNumber: string;
  verified: boolean;
  reliabilityScore: number;
  peopleCount: number;
  foodPreference: FoodType[];
  pickupWindow: string;
  mealsReceived: number;
  joinedDate: string;
}

export interface Listing {
  id: string;
  donorId: string;
  donorName: string;
  donorArea: string;
  donorPhone: string;
  foodType: FoodType;
  foodDescription: string;
  quantityPeople: number;
  status: ListingStatus;
  safeTill: string;
  safeHours: number;
  area: string;
  pickupMethod: PickupMethod;
  pickupWindow: string;
  createdAt: string;
  claimedByNgoId?: string;
  claimedByNgoName?: string;
  claimedByNgoPhone?: string;
  handoverCode?: string;
  claimedAt?: string;
  assignedHelperId?: string;
  assignedHelperName?: string;
  disclaimerAccepted: boolean;
  freshnessConfirmed: boolean;
  storageConfirmed: boolean;
  matchedNgoIds?: string[];
}

export interface DailyNeed {
  id: string;
  ngoId: string;
  ngoName: string;
  peopleCount: number;
  foodType: FoodType;
  pickupWindow: string;
  area: string;
  date: string;
}

export interface ImpactStats {
  mealsRescued: number;
  liveListings: number;
  pickupsDone: number;
  ngosActive: number;
}
