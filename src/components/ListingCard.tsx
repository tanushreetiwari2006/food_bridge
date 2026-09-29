import { MapPin, Phone, Users, Truck, Clock, ShieldCheck, KeyRound, AlertTriangle } from 'lucide-react';
import type { Listing, NGO } from '@/types';
import { foodTypeColor, foodTypeLabelT, statusLabelT, statusColor, getBestMatches } from '@/utils/helpers';
import { useLang } from '@/context/LanguageContext';
import CountdownTimer from './CountdownTimer';

interface Props {
  listing: Listing;
  ngos: NGO[];
  onClaim?: (listing: Listing) => void;
  onShowCode?: (listing: Listing) => void;
  isDonorView?: boolean;
  claimed?: boolean;
}

export default function ListingCard({ listing, ngos, onClaim, onShowCode, isDonorView, claimed }: Props) {
  const { t } = useLang();
  const matches = getBestMatches(listing, ngos).slice(0, 3);
  const isReady = listing.status === 'ready';
  const isForecast = listing.status === 'forecast';
  const isClaimed = listing.status === 'claimed';
  const isExpired = listing.status === 'expired' || listing.status === 'no-show';

  return (
    <div className="card hover:shadow-lg transition-all animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`tag ${foodTypeColor(listing.foodType)}`}>{foodTypeLabelT(listing.foodType, t)}</span>
          <span className={`tag ${statusColor(listing.status)}`}>{statusLabelT(listing.status, t)}</span>
        </div>
        {isReady && <CountdownTimer safeTill={listing.safeTill} size="sm" />}
      </div>

      {/* Description */}
      <p className="text-base text-teal-900 dark:text-teal-100 font-medium mb-3 leading-relaxed">
        {listing.foodDescription}
      </p>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2.5 mb-4 text-sm">
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
          <Users className="h-4 w-4 text-teal-500" />
          <span><strong className="font-semibold">{listing.quantityPeople}</strong> {t('people_ka')}</span>
        </div>
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
          <MapPin className="h-4 w-4 text-teal-500" />
          <span>{listing.area}</span>
        </div>
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
          {listing.pickupMethod === 'ngo_pickup' ? <Truck className="h-4 w-4 text-teal-500" /> : <MapPin className="h-4 w-4 text-teal-500" />}
          <span>{listing.pickupMethod === 'ngo_pickup' ? t('ngo_pickup') : t('donor_drop')}</span>
        </div>
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
          <Clock className="h-4 w-4 text-teal-500" />
          <span>{listing.pickupWindow}</span>
        </div>
      </div>

      {/* Donor info */}
      <div className="rounded-xl bg-cream-100 dark:bg-teal-900/40 px-3 py-2.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300">
          <ShieldCheck className="h-4 w-4 text-teal-500" />
          <span className="font-semibold">{listing.donorName}</span>
          <span className="text-teal-400">• {listing.donorArea}</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 px-3 py-2.5 mb-4">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{t('disclaimer')}</p>
      </div>

      {/* Claimed info */}
      {isClaimed && listing.claimedByNgoName && (
        <div className="rounded-xl bg-teal-50 dark:bg-teal-900/30 px-3 py-2.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-teal-800 dark:text-teal-200">
            <ShieldCheck className="h-4 w-4 text-teal-600" />
            <span>Claimed by <strong>{listing.claimedByNgoName}</strong></span>
          </div>
          {(isDonorView || claimed) && (
            <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300 mt-1.5">
              <Phone className="h-4 w-4 text-teal-500" />
              <span className="font-mono font-semibold">+91 {listing.claimedByNgoName === 'Sahyog Shelter' ? '9007654321' : 'XXXXXXXXXX'}</span>
            </div>
          )}
        </div>
      )}

      {/* Handover code — donor only */}
      {isDonorView && isClaimed && listing.handoverCode && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
            <KeyRound className="h-4 w-4" /> {t('donor_handover_code')}
          </div>
          <div className="font-display text-3xl font-bold tracking-[0.3em] text-amber-700 dark:text-amber-400">
            {listing.handoverCode}
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">{t('donor_handover_note')}</p>
        </div>
      )}

      {/* Match suggestions */}
      {(isReady || isForecast) && matches.length > 0 && !isDonorView && (
        <div className="rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 px-3 py-3 mb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-teal-800 dark:text-teal-200 mb-2">
            <ShieldCheck className="h-4 w-4 text-teal-600" /> {t('board_best_match')}
          </div>
          <div className="flex flex-wrap gap-2">
            {matches.map((ngo, i) => (
              <span
                key={ngo.id}
                className={`tag ${i === 0 ? 'bg-teal-700 text-white' : 'bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-200'}`}
              >
                {i === 0 ? '★ ' : ''}{ngo.name} ({ngo.reliabilityScore})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {isReady && !isClaimed && !isDonorView && onClaim && (
          <button onClick={() => onClaim(listing)} className="btn-primary flex-1 text-sm sm:text-base">
            {t('board_claim')}
          </button>
        )}
        {isForecast && !isDonorView && (
          <div className="w-full text-center text-sm text-amber-700 dark:text-amber-400 font-medium py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            {t('board_forecast_hint')}
          </div>
        )}
        {isExpired && (
          <div className="w-full text-center text-sm text-gray-500 font-medium py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800">
            {t('board_expired')}
          </div>
        )}
        {isDonorView && onShowCode && isClaimed && (
          <button onClick={() => onShowCode(listing)} className="btn-secondary flex-1 text-sm sm:text-base">
            {t('donor_show_code')}
          </button>
        )}
      </div>
    </div>
  );
}
