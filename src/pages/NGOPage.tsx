import { useState } from 'react';
import { Users, Clock, MapPin, KeyRound, ShieldCheck, AlertTriangle, CheckCircle2, Package, TrendingUp, Phone, UserPlus, Trash2 } from 'lucide-react';
import type { FoodType, Listing } from '@/types';
import { mockNGOs, mockListings } from '@/data/mockData';
import { foodTypeLabelT, foodTypeColor, statusLabelT, statusColor } from '@/utils/helpers';
import { useLang } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import CountdownTimer from '@/components/CountdownTimer';

export default function NGOPage() {
  const { t } = useLang();
  const { helpers, addHelper, removeHelper } = useAuth();
  const ngo = mockNGOs[0];
  const [peopleCount, setPeopleCount] = useState(String(ngo.peopleCount));
  const [foodPreference, setFoodPreference] = useState<FoodType[]>(ngo.foodPreference);
  const [pickupWindow, setPickupWindow] = useState('9 AM - 9 PM');
  const [successMsg, setSuccessMsg] = useState('');
  const [handoverInput, setHandoverInput] = useState('');
  const [handoverStatus, setHandoverStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [simulatedClaim, setSimulatedClaim] = useState<Listing | null>(null);
  const [helperName, setHelperName] = useState('');
  const [helperPhone, setHelperPhone] = useState('');
  const [helperError, setHelperError] = useState('');
  const [helperSuccess, setHelperSuccess] = useState('');

  const toggleFoodPref = (ft: FoodType) => {
    setFoodPreference((prev) => prev.includes(ft) ? prev.filter((x) => x !== ft) : [...prev, ft]);
  };

  const handleNeedsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(t('ngo_needs_done'));
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleHandoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handoverInput.length !== 4) { setHandoverStatus('error'); return; }
    if (simulatedClaim && handoverInput === simulatedClaim.handoverCode) {
      setHandoverStatus('success');
      setSimulatedClaim({ ...simulatedClaim, status: 'completed' });
    } else if (handoverInput === '4729') {
      setHandoverStatus('success');
    } else {
      setHandoverStatus('error');
    }
  };

  const demoClaim: Listing = simulatedClaim || {
    id: 'demo-claim',
    donorId: 'd2',
    donorName: 'Royal Banquet Hall',
    donorArea: 'Vaishali',
    foodType: 'non-veg',
    foodDescription: 'Chicken curry, biryani, raita — event ka surplus',
    quantityPeople: 50,
    status: 'claimed',
    safeTill: new Date(Date.now() + 1 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString(),
    safeHours: 2,
    area: 'Vaishali',
    pickupMethod: 'donor_drop',
    pickupWindow: 'Abhi se 1.5 ghante tak',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    claimedByNgoId: 'n1',
    claimedByNgoName: 'Ashray Orphanage',
    handoverCode: '4729',
    claimedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    disclaimerAccepted: true,
    freshnessConfirmed: true,
    storageConfirmed: true,
    matchedNgoIds: ['n1'],
  };

  const foodTypes: FoodType[] = ['veg', 'non-veg', 'dry'];

  const myHelpers = helpers.filter((h) => h.ownerRole === 'ngo');

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
      {/* NGO header */}
      <div className="card mb-6 bg-gradient-to-br from-teal-700 to-teal-800 text-white border-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {ngo.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success-500/20 px-2.5 py-0.5 text-xs font-bold text-success-300">
                  <ShieldCheck className="h-3.5 w-3.5" /> {t('ngo_verified')}
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl font-bold mb-1">{ngo.name}</h1>
            <p className="text-teal-100 text-sm">{ngo.type} • {ngo.area}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="font-display text-2xl font-bold">{ngo.reliabilityScore}</div>
              <div className="text-xs text-teal-100">{t('donor_reliability')}</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold">{ngo.mealsReceived}</div>
              <div className="text-xs text-teal-100">{t('ngo_meals_received')}</div>
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-xl bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800 px-4 py-3 mb-4 flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="h-5 w-5 text-success-600 dark:text-success-500" />
          <p className="text-sm font-medium text-success-700 dark:text-success-400">{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily needs form */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-200">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-teal-900 dark:text-teal-50">{t('ngo_needs_title')}</h2>
          </div>
          <form onSubmit={handleNeedsSubmit} className="space-y-4">
            <div>
              <label className="label-text">{t('ngo_needs_people')}</label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                <input type="number" value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} className="input-field pl-11" min="1" />
              </div>
            </div>
            <div>
              <label className="label-text">{t('ngo_food_pref')}</label>
              <div className="flex gap-2">
                {foodTypes.map((ft) => (
                  <button key={ft} type="button" onClick={() => toggleFoodPref(ft)}
                    className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                      foodPreference.includes(ft) ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-800 dark:text-teal-50' : 'border-cream-400 text-teal-500 dark:border-teal-700 dark:text-teal-400'
                    }`}>
                    {foodTypeLabelT(ft, t)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-text">{t('ngo_pickup_window')}</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                <input type="text" value={pickupWindow} onChange={(e) => setPickupWindow(e.target.value)} className="input-field pl-11" placeholder="9 AM - 9 PM" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">{t('ngo_needs_submit')}</button>
          </form>
        </div>

        {/* Handover code entry */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-teal-900 dark:text-teal-50">{t('ngo_handover_title')}</h2>
          </div>
          <p className="text-sm text-teal-600 dark:text-teal-300 mb-4">{t('ngo_handover_desc')}</p>
          <form onSubmit={handleHandoverSubmit} className="space-y-4">
            <div>
              <label className="label-text">{t('ngo_handover_code_label')}</label>
              <input type="text" value={handoverInput} onChange={(e) => setHandoverInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000" className="input-field text-center font-display text-2xl tracking-[0.5em] font-bold" maxLength={4} />
            </div>
            {handoverStatus === 'success' && (
              <div className="rounded-xl bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800 px-4 py-3 flex items-center gap-2 animate-slide-up">
                <CheckCircle2 className="h-5 w-5 text-success-600 dark:text-success-500" />
                <p className="text-sm font-semibold text-success-700 dark:text-success-400">{t('ngo_handover_success')}</p>
              </div>
            )}
            {handoverStatus === 'error' && (
              <div className="rounded-xl bg-error-100 dark:bg-error-900/30 border border-error-200 dark:border-error-800 px-4 py-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-error-600 dark:text-error-400" />
                <p className="text-sm font-semibold text-error-700 dark:text-error-400">{t('ngo_handover_error')}</p>
              </div>
            )}
            <button type="submit" className="btn-secondary w-full">
              <CheckCircle2 className="h-5 w-5" /> {t('ngo_handover_confirm')}
            </button>
          </form>
          <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 px-3 py-2.5 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300">{t('ngo_noshow_reminder')}</p>
          </div>
        </div>
      </div>

      {/* My Team / Helpers */}
      <div className="mt-8">
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

      {/* Claimed pickups */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-bold text-teal-900 dark:text-teal-50 mb-4">{t('ngo_claimed_title')}</h2>
        {demoClaim.status === 'claimed' || demoClaim.status === 'completed' ? (
          <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`tag ${foodTypeColor(demoClaim.foodType)}`}>{foodTypeLabelT(demoClaim.foodType, t)}</span>
                <span className={`tag ${statusColor(demoClaim.status)}`}>{statusLabelT(demoClaim.status, t)}</span>
              </div>
              {demoClaim.status === 'claimed' && <CountdownTimer safeTill={demoClaim.safeTill} size="sm" />}
            </div>
            <p className="text-base text-teal-900 dark:text-teal-100 font-medium mb-3">{demoClaim.foodDescription}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-sm mb-4">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300"><Users className="h-4 w-4 text-teal-500" /> {demoClaim.quantityPeople} {t('people')}</div>
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300"><MapPin className="h-4 w-4 text-teal-500" /> {demoClaim.area}</div>
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300"><Clock className="h-4 w-4 text-teal-500" /> {demoClaim.pickupWindow}</div>
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300"><Package className="h-4 w-4 text-teal-500" /> {demoClaim.pickupMethod === 'ngo_pickup' ? t('ngo_pickup') : t('donor_drop')}</div>
            </div>
            <div className="rounded-xl bg-teal-50 dark:bg-teal-900/30 px-3 py-2.5 mb-3">
              <div className="flex items-center gap-2 text-sm text-teal-800 dark:text-teal-200">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <span className="font-semibold">{demoClaim.donorName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300 mt-1.5">
                <Phone className="h-4 w-4 text-teal-500" />
                <span className="font-mono font-semibold">+91 9811122233</span>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 px-3 py-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{t('disclaimer')}</p>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-teal-500 dark:text-teal-400">{t('ngo_no_claims')}</p>
            <p className="text-sm text-teal-400 mt-1">{t('ngo_no_claims_sub')}</p>
          </div>
        )}
      </div>

      {/* Monthly impact */}
      <div className="card mt-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            {t('ngo_monthly')} <strong>520 {t('ngo_monthly2')}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
