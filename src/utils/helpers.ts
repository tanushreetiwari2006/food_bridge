import type { FoodType, ListingStatus, Listing, NGO } from '@/types';

export function formatTimeRemaining(safeTill: string): string {
  const now = Date.now();
  const end = new Date(safeTill).getTime();
  const diff = end - now;

  if (diff <= 0) return '00:00';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }
  return `${minutes.toString().padStart(2, '0')}m`;
}

export function getUrgencyLevel(safeTill: string): 'safe' | 'warning' | 'critical' | 'expired' {
  const diff = new Date(safeTill).getTime() - Date.now();
  if (diff <= 0) return 'expired';
  if (diff < 30 * 60 * 1000) return 'critical';
  if (diff < 60 * 60 * 1000) return 'warning';
  return 'safe';
}

export function foodTypeLabel(type: FoodType): string {
  switch (type) {
    case 'veg': return 'food_veg';
    case 'non-veg': return 'food_nonveg';
    case 'dry': return 'food_dry';
  }
}

export function foodTypeLabelT(type: FoodType, t: (k: string) => string): string {
  return t(foodTypeLabel(type));
}

export function foodTypeColor(type: FoodType): string {
  switch (type) {
    case 'veg': return 'bg-success-100 text-success-700 border border-success-200';
    case 'non-veg': return 'bg-error-100 text-error-700 border border-error-200';
    case 'dry': return 'bg-amber-100 text-amber-700 border border-amber-200';
  }
}

export function statusLabelKey(status: ListingStatus): string {
  switch (status) {
    case 'forecast': return 'status_forecast';
    case 'ready': return 'status_ready';
    case 'claimed': return 'status_claimed';
    case 'completed': return 'status_completed';
    case 'expired': return 'status_expired';
    case 'no-show': return 'status_noshow';
  }
}

export function statusLabelT(status: ListingStatus, t: (k: string) => string): string {
  return t(statusLabelKey(status));
}

export function statusColor(status: ListingStatus): string {
  switch (status) {
    case 'forecast': return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'ready': return 'bg-success-100 text-success-700 border border-success-200';
    case 'claimed': return 'bg-teal-100 text-teal-800 border border-teal-200';
    case 'completed': return 'bg-cream-200 text-teal-700 border border-cream-300';
    case 'expired': return 'bg-gray-100 text-gray-500 border border-gray-200';
    case 'no-show': return 'bg-error-100 text-error-700 border border-error-200';
  }
}

export function generateHandoverCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function matchScore(listing: Listing, ngo: NGO): number {
  let score = 0;

  // Food type match (most important)
  if (ngo.foodPreference.includes(listing.foodType)) {
    score += 40;
  } else {
    return -1; // Cannot use this food
  }

  // Quantity match
  if (listing.quantityPeople <= ngo.peopleCount) {
    score += 25;
  } else if (listing.quantityPeople <= ngo.peopleCount * 1.5) {
    score += 15;
  } else {
    score += 5;
  }

  // Area proximity (simplified — same area = best)
  if (ngo.area === listing.area) {
    score += 20;
  } else {
    score += 8;
  }

  // Reliability score
  score += Math.round(ngo.reliabilityScore * 0.15);

  return score;
}

export function getBestMatches(listing: Listing, ngos: NGO[]): NGO[] {
  return ngos
    .filter((n) => n.verified)
    .map((n) => ({ ngo: n, score: matchScore(listing, n) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.ngo);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
