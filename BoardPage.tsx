import { useState, useMemo } from 'react';
import { Search, Filter, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { mockListings, mockNGOs } from '@/data/mockData';
import type { Listing, FoodType, ListingStatus } from '@/types';
import { generateHandoverCode } from '@/utils/helpers';
import { useLang } from '@/context/LanguageContext';

type FilterStatus = 'all' | ListingStatus;
type FilterFood = 'all' | FoodType;

export default function BoardPage() {
  const { t } = useLang();
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterFood, setFilterFood] = useState<FilterFood>('all');
  const [claimedId, setClaimedId] = useState<string | null>(null);
  const [showClaimModal, setShowClaimModal] = useState<Listing | null>(null);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (filterStatus !== 'all' && l.status !== filterStatus) return false;
      if (filterFood !== 'all' && l.foodType !== filterFood) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          l.foodDescription.toLowerCase().includes(q) ||
          l.area.toLowerCase().includes(q) ||
          l.donorName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [listings, search, filterStatus, filterFood]);

  const handleClaim = (listing: Listing) => setShowClaimModal(listing);

  const confirmClaim = () => {
    if (!showClaimModal) return;
    const code = generateHandoverCode();
    setListings((prev) =>
      prev.map((l) =>
        l.id === showClaimModal.id
          ? {
              ...l,
              status: 'claimed',
              claimedByNgoId: 'n1',
              claimedByNgoName: 'Ashray Orphanage',
              handoverCode: code,
              claimedAt: new Date().toISOString(),
            }
          : l
      )
    );
    setClaimedId(showClaimModal.id);
    setShowClaimModal(null);
  };

  const statusFilters: { value: FilterStatus; labelKey: string }[] = [
    { value: 'all', labelKey: 'board_filter_all' },
    { value: 'forecast', labelKey: 'board_filter_forecast' },
    { value: 'ready', labelKey: 'board_filter_ready' },
    { value: 'claimed', labelKey: 'board_filter_claimed' },
  ];

  const foodFilters: { value: FilterFood; labelKey: string }[] = [
    { value: 'all', labelKey: 'board_filter_all_food' },
    { value: 'veg', labelKey: 'food_veg' },
    { value: 'non-veg', labelKey: 'food_nonveg' },
    { value: 'dry', labelKey: 'food_dry' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-teal-900 dark:text-teal-50 mb-2">{t('board_title')}</h1>
        <p className="text-teal-600 dark:text-teal-300">{t('board_sub')}</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('board_search')}
              className="input-field pl-11"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-teal-500" />
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                    filterStatus === f.value
                      ? 'bg-teal-700 text-white'
                      : 'bg-cream-100 text-teal-700 hover:bg-cream-200 dark:bg-teal-900 dark:text-teal-200 dark:hover:bg-teal-800'
                  }`}
                >
                  {t(f.labelKey)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <UtensilsCrossed className="h-4 w-4 text-teal-500" />
              {foodFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterFood(f.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                    filterFood === f.value
                      ? 'bg-amber-500 text-white'
                      : 'bg-cream-100 text-teal-700 hover:bg-cream-200 dark:bg-teal-900 dark:text-teal-200 dark:hover:bg-teal-800'
                  }`}
                >
                  {t(f.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-teal-500 dark:text-teal-400 text-lg font-medium">{t('board_no_listings')}</p>
          <p className="text-sm text-teal-400 mt-1">{t('board_no_listings_sub')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              ngos={mockNGOs}
              onClaim={handleClaim}
              claimed={claimedId === listing.id}
            />
          ))}
        </div>
      )}

      {/* Claim confirmation modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowClaimModal(null)}>
          <div className="bg-white dark:bg-teal-900 rounded-2xl max-w-md w-full p-6 shadow-xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-200">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="font-display text-xl font-bold text-teal-900 dark:text-teal-50">{t('board_claim_confirm')}</h2>
            </div>
            <p className="text-teal-600 dark:text-teal-300 mb-4">
              {showClaimModal.foodDescription.substring(0, 50)}...
            </p>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 px-4 py-3 mb-4">
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">{t('board_claim_reminder')}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowClaimModal(null)} className="btn-ghost flex-1 text-teal-700 dark:text-teal-200">
                {t('board_claim_cancel')}
              </button>
              <button onClick={confirmClaim} className="btn-primary flex-1">
                {t('board_claim')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
