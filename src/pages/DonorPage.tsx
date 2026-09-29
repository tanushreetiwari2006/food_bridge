import { useState } from 'react';
import { Sparkles, Mic, Send, CheckCircle2, KeyRound, AlertTriangle, Users, MapPin, Clock, Truck, Loader2, TrendingUp, UserPlus, Trash2, Phone } from 'lucide-react';
import type { Listing, FoodType, PickupMethod } from '@/types';
import { mockListings, mockDonors } from '@/data/mockData';
import { foodTypeLabelT, foodTypeColor, statusLabelT, statusColor } from '@/utils/helpers';
import { useLang } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import CountdownTimer from '@/components/CountdownTimer';

export default function DonorPage() {
  const { t } = useLang();
  const { helpers, addHelper, removeHelper } = useAuth();
  const [listings, setListings] = useState<Listing[]>(mockListings.filter((l) => l.donorId === 'd1'));
  const [quickText, setQuickText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showCodeFor, setShowCodeFor] = useState<string | null>(null);

  const [helperName, setHelperName] = useState('');
  const [helperPhone, setHelperPhone] = useState('');
  const [helperError, setHelperError] = useState('');
  const [helperSuccess, setHelperSuccess] = useState('');

  const [foodType, setFoodType] = useState<FoodType>('veg');
  const [foodDescription, setFoodDescription] = useState('');
  const [quantityPeople, setQuantityPeople] = useState('');
  const [status, setStatus] = useState<'forecast' | 'ready'>('forecast');
  const [safeHours, setSafeHours] = useState('3');
  const [area, setArea] = useState('Indirapuram');
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>('ngo_pickup');
  const [pickupWindow, setPickupWindow] = useState('');
  const [freshnessConfirmed, setFreshnessConfirmed] = useState(false);
  const [storageConfirmed, setStorageConfirmed] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const donor = mockDonors[0];

  const handleQuickListing = async () => {
    if (!quickText.trim()) return;
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const text = quickText.toLowerCase();
    if (text.includes('non-veg') || text.includes('chicken') || text.includes('mutton') || text.includes('fish') || text.includes('biryani')) setFoodType('non-veg');
    else if (text.includes('dry') || text.includes('biscuit') || text.includes('packed') || text.includes('packet')) setFoodType('dry');
    else setFoodType('veg');

    const qtyMatch = text.match(/(\d+)\s*log/);
    if (qtyMatch) setQuantityPeople(qtyMatch[1]);

    const hoursMatch = text.match(/(\d+)\s*(?:ghante|ghanta|hour|hr)/);
    if (hoursMatch) setSafeHours(hoursMatch[1]);

    if (text.includes('ready') || text.includes('abhi')) setStatus('ready');
    else setStatus('forecast');

    const areas = ['indirapuram', 'vaishali', 'kaushambi', 'crossing republik', 'raj nagar', 'shipra'];
    const foundArea = areas.find((a) => text.includes(a));
    if (foundArea) setArea(foundArea.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));

    setFoodDescription(quickText);
    setAiLoading(false);
    setShowForm(true);
    setSuccessMsg(t('donor_ai_done'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!foodDescription.trim() || !quantityPeople || !area || !pickupWindow) {
      setFormError(t('donor_form_error'));
      return;
    }
    if (!freshnessConfirmed || !storageConfirmed) {
      setFormError(t('donor_safety_error'));
      return;
    }

    const qty = parseInt(quantityPeople);
    const hours = parseFloat(safeHours) || 3;
    const safeTill = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    const newListing: Listing = {
      id: `l${Date.now()}`,
      donorId: 'd1',
      donorName: donor.name,
      donorArea: donor.area,
      foodType,
      foodDescription,
      quantityPeople: qty,
      status,
      safeTill,
      safeHours: hours,
      area,
      pickupMethod,
      pickupWindow,
      createdAt: new Date().toISOString(),
      disclaimerAccepted: true,
      freshnessConfirmed,
      storageConfirmed,
    };

    setListings((prev) => [newListing, ...prev]);
    setSuccessMsg(t('donor_success'));
    setFoodDescription('');
    setQuantityPeople('');
    setPickupWindow('');
    setFreshnessConfirmed(false);
    setStorageConfirmed(false);
    setQuickText('');
  };

  const handleMarkReady = (id: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: 'ready', safeTill: new Date(Date.now() + l.safeHours * 60 * 60 * 1000).toISOString() } : l
      )
    );
  };

  const foodTypes: FoodType[] = ['veg', 'non-veg', 'dry'];

  const myHelpers = helpers.filter((h) => h.ownerRole === 'donor');

  const handleAddHelper = (e: React.FormEvent) => {
    e.preventDefault();
    setHelperError('');
    setHelperSuccess('');
    if (!helperName.trim() || helperPhone.replace(/\D/g, '').length !== 10) {
      setHelperError(t('login_invalid_phone'));
      return;
    }
    addHelper(helperName.trim(), helperPhone.replace(/\D/g, ''));
    setHelperSuccess(t('team_helper_added'));
    setHelperName('');
    setHelperPhone('');
    setTimeout(() => setHelperSuccess(''), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Donor header */}
      <div className="card mb-6 bg-gradient-to-br from-teal-700 to-teal-800 text-white border-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold mb-1">{donor.name}</h1>
            <p className="text-teal-100 text-sm">{donor.type} • {donor.area}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="font-display text-2xl font-bold">{donor.reliabilityScore}</div>
              <div className="text-xs text-teal-100">{t('donor_reliability')}</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold">{donor.mealsRescued}</div>
              <div className="text-xs text-teal-100">{t('donor_meals')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly summary */}
      <div className="card mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            {t('donor_monthly')} <strong>600 {t('donor_monthly2')}</strong>
          </p>
        </div>
      </div>

      {/* Quick Listing AI box */}
      <div className="card mb-6 border-teal-200 dark:border-teal-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-teal-900 dark:text-teal-50">{t('donor_quick_title')}</h2>
            <p className="text-xs text-teal-500 dark:text-teal-400">{t('donor_quick_sub')}</p>
          </div>
        </div>
        <textarea
          value={quickText}
          onChange={(e) => setQuickText(e.target.value)}
          placeholder={t('donor_quick_placeholder')}
          rows={3}
          className="input-field resize-none"
        />
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <button onClick={handleQuickListing} disabled={!quickText.trim() || aiLoading} className="btn-primary flex-1">
            {aiLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> {t('donor_quick_loading')}</> : <><Sparkles className="h-5 w-5" /> {t('donor_quick_btn')}</>}
          </button>
          <button className="btn-outline" disabled>
            <Mic className="h-5 w-5" /> {t('donor_quick_voice')}
          </button>
        </div>
        <p className="text-xs text-teal-400 mt-2">{t('donor_quick_note')}</p>
      </div>

      {successMsg && (
        <div className="rounded-xl bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800 px-4 py-3 mb-4 flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="h-5 w-5 text-success-600 dark:text-success-500" />
          <p className="text-sm font-medium text-success-700 dark:text-success-400">{successMsg}</p>
        </div>
      )}

      {formError && (
        <div className="rounded-xl bg-error-100 dark:bg-error-900/30 border border-error-200 dark:border-error-800 px-4 py-3 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-error-600 dark:text-error-400" />
          <p className="text-sm font-medium text-error-700 dark:text-error-400">{formError}</p>
        </div>
      )}

      {/* Posting form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6">
          <h2 className="font-display text-lg font-bold text-teal-900 dark:text-teal-50 mb-4">{t('donor_form_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label-text">{t('donor_food_type')}</label>
              <div className="flex gap-2">
                {foodTypes.map((ft) => (
                  <button key={ft} type="button" onClick={() => setFoodType(ft)}
                    className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                      foodType === ft ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-800 dark:text-teal-50' : 'border-cream-400 text-teal-500 dark:border-teal-700 dark:text-teal-400'
                    }`}>
                    {foodTypeLabelT(ft, t)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-text">{t('donor_qty')}</label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                <input type="number" value={quantityPeople} onChange={(e) => setQuantityPeople(e.target.value)} placeholder="80" className="input-field pl-11" min="1" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="label-text">{t('donor_food_desc')}</label>
              <textarea value={foodDescription} onChange={(e) => setFoodDescription(e.target.value)} placeholder={t('donor_food_desc_ph')} rows={2} className="input-field resize-none" />
            </div>
            <div>
              <label className="label-text">{t('donor_status')}</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStatus('forecast')}
                  className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                    status === 'forecast' ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'border-cream-400 text-teal-500 dark:border-teal-700 dark:text-teal-400'
                  }`}>
                  {t('donor_status_forecast')}
                </button>
                <button type="button" onClick={() => setStatus('ready')}
                  className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                    status === 'ready' ? 'border-success-500 bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' : 'border-cream-400 text-teal-500 dark:border-teal-700 dark:text-teal-400'
                  }`}>
                  {t('donor_status_ready')}
                </button>
              </div>
            </div>
            <div>
              <label className="label-text">{t('donor_safe_hours')}</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                <input type="number" value={safeHours} onChange={(e) => setSafeHours(e.target.value)} placeholder="3" className="input-field pl-11" min="0.5" step="0.5" />
              </div>
            </div>
            <div>
              <label className="label-text">{t('donor_area')}</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                <input type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Indirapuram" className="input-field pl-11" />
              </div>
            </div>
            <div>
              <label className="label-text">{t('donor_pickup_method')}</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPickupMethod('ngo_pickup')}
                  className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                    pickupMethod === 'ngo_pickup' ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-800 dark:text-teal-50' : 'border-cream-400 text-teal-500 dark:border-teal-700 dark:text-teal-400'
                  }`}>
                  {t('ngo_pickup')}
                </button>
                <button type="button" onClick={() => setPickupMethod('donor_drop')}
                  className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                    pickupMethod === 'donor_drop' ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-800 dark:text-teal-50' : 'border-cream-400 text-teal-500 dark:border-teal-700 dark:text-teal-400'
                  }`}>
                  {t('donor_drop')}
                </button>
              </div>
            </div>
            <div>
              <label className="label-text">{t('donor_pickup_window')}</label>
              <input type="text" value={pickupWindow} onChange={(e) => setPickupWindow(e.target.value)} placeholder={t('donor_pickup_window_ph')} className="input-field" />
            </div>
          </div>

          {/* Safety checkboxes */}
          <div className="rounded-xl bg-cream-100 dark:bg-teal-900/40 p-4 mb-4 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={freshnessConfirmed} onChange={(e) => setFreshnessConfirmed(e.target.checked)} className="mt-1 h-5 w-5 rounded text-teal-600 focus:ring-teal-500" />
              <span className="text-sm text-teal-800 dark:text-teal-200 leading-relaxed">{t('donor_check1')}</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={storageConfirmed} onChange={(e) => setStorageConfirmed(e.target.checked)} className="mt-1 h-5 w-5 rounded text-teal-600 focus:ring-teal-500" />
              <span className="text-sm text-teal-800 dark:text-teal-200 leading-relaxed">{t('donor_check2')}</span>
            </label>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 px-3 py-2.5 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{t('disclaimer')}</p>
          </div>

          <button type="submit" className="btn-primary w-full">
            <Send className="h-5 w-5" /> {t('donor_post')}
          </button>
        </form>
      )}

      {/* My Team / Helpers */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-200">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-teal-900 dark:text-teal-50">{t('team_title')}</h2>
            <p className="text-xs text-teal-500 dark:text-teal-400">{t('team_sub')}</p>
          </div>
        </div>
        <div className="card">
          <form onSubmit={handleAddHelper} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 mb-4">
            <div>
              <input type="text" value={helperName} onChange={(e) => setHelperName(e.target.value)} placeholder={t('team_helper_name')} className="input-field" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
              <input type="tel" value={helperPhone} onChange={(e) => setHelperPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder={t('team_helper_phone')} className="input-field pl-11" />
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap">
              <UserPlus className="h-5 w-5" /> {t('team_add')}
            </button>
          </form>
          {helperError && <p className="text-sm text-error-600 dark:text-error-400 mb-3">{helperError}</p>}
          {helperSuccess && (
            <div className="rounded-xl bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800 px-4 py-2.5 mb-3 flex items-center gap-2 animate-slide-up">
              <CheckCircle2 className="h-4 w-4 text-success-600 dark:text-success-500" />
              <p className="text-sm font-medium text-success-700 dark:text-success-400">{helperSuccess}</p>
            </div>
          )}
          {myHelpers.length === 0 ? (
            <p className="text-sm text-teal-500 dark:text-teal-400 text-center py-4">{t('team_no_helpers')}</p>
          ) : (
            <div className="space-y-2">
              {myHelpers.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-xl bg-cream-100 dark:bg-teal-900/40 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-200 dark:bg-teal-700 text-teal-700 dark:text-teal-200">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-teal-900 dark:text-teal-50 text-sm">{h.name}</p>
                      <p className="text-xs text-teal-500 dark:text-teal-400">+91 {h.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => removeHelper(h.id)} className="text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg p-2 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My listings */}
      <div>
        <h2 className="font-display text-xl font-bold text-teal-900 dark:text-teal-50 mb-4">{t('donor_my_listings')}</h2>
        {listings.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-teal-500 dark:text-teal-400">{t('donor_no_listings')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`tag ${foodTypeColor(listing.foodType)}`}>{foodTypeLabelT(listing.foodType, t)}</span>
                    <span className={`tag ${statusColor(listing.status)}`}>{statusLabelT(listing.status, t)}</span>
                  </div>
                  {(listing.status === 'ready' || listing.status === 'claimed') && <CountdownTimer safeTill={listing.safeTill} size="sm" />}
                </div>
                <p className="text-base text-teal-900 dark:text-teal-100 font-medium mb-3">{listing.foodDescription}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-sm mb-4">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300"><Users className="h-4 w-4 text-teal-500" /> {listing.quantityPeople} {t('people')}</div>
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300"><MapPin className="h-4 w-4 text-teal-500" /> {listing.area}</div>
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300"><Clock className="h-4 w-4 text-teal-500" /> {listing.pickupWindow}</div>
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300"><Truck className="h-4 w-4 text-teal-500" /> {listing.pickupMethod === 'ngo_pickup' ? t('ngo_pickup') : t('donor_drop')}</div>
                </div>
                {listing.status === 'claimed' && listing.claimedByNgoName && (
                  <div className="rounded-xl bg-teal-50 dark:bg-teal-900/30 px-3 py-2.5 mb-3">
                    <p className="text-sm text-teal-800 dark:text-teal-200">Claimed by <strong>{listing.claimedByNgoName}</strong> — +91 9007654321</p>
                  </div>
                )}
                {showCodeFor === listing.id && listing.handoverCode && (
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 mb-3 animate-slide-up">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                      <KeyRound className="h-4 w-4" /> {t('donor_handover_code')}
                    </div>
                    <div className="font-display text-3xl font-bold tracking-[0.3em] text-amber-700 dark:text-amber-400">{listing.handoverCode}</div>
                  </div>
                )}
                <div className="flex gap-2">
                  {listing.status === 'forecast' && (
                    <button onClick={() => handleMarkReady(listing.id)} className="btn-secondary flex-1 text-sm">{t('donor_mark_ready')}</button>
                  )}
                  {listing.status === 'claimed' && listing.handoverCode && (
                    <button onClick={() => setShowCodeFor(showCodeFor === listing.id ? null : listing.id)} className="btn-outline flex-1 text-sm">
                      {showCodeFor === listing.id ? t('donor_hide_code') : t('donor_show_code')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
