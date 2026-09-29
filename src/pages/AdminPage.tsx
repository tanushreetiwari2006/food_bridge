import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Users, Building2, Package, CheckCircle2, XCircle, RefreshCw, Phone, MapPin } from 'lucide-react';
import { mockDonors, mockNGOs, mockListings } from '@/data/mockData';
import type { NGO, Listing } from '@/types';
import { foodTypeLabelT, foodTypeColor, statusLabelT, statusColor } from '@/utils/helpers';
import { useLang } from '@/context/LanguageContext';
import CountdownTimer from '@/components/CountdownTimer';

type Tab = 'overview' | 'ngos' | 'donors' | 'listings';

export default function AdminPage() {
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>('overview');
  const [ngos, setNgos] = useState<NGO[]>(mockNGOs);
  const [listings, setListings] = useState<Listing[]>(mockListings);

  const pendingNgos = ngos.filter((n) => !n.verified);
  const verifiedNgos = ngos.filter((n) => n.verified);

  const handleApprove = (id: string) => {
    setNgos((prev) => prev.map((n) => (n.id === id ? { ...n, verified: true, reliabilityScore: 50 } : n)));
  };

  const handleReject = (id: string) => {
    setNgos((prev) => prev.filter((n) => n.id !== id));
  };

  const handleReassign = (id: string) => {
    setListings((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const nextNgo = verifiedNgos.find((n) => n.id !== l.claimedByNgoId);
        return { ...l, claimedByNgoId: nextNgo?.id, claimedByNgoName: nextNgo?.name, claimedAt: new Date().toISOString() };
      })
    );
  };

  const tabs: { value: Tab; labelKey: string; badge?: number }[] = [
    { value: 'overview', labelKey: 'admin_tab_overview' },
    { value: 'ngos', labelKey: 'admin_tab_ngos', badge: pendingNgos.length },
    { value: 'donors', labelKey: 'admin_tab_donors' },
    { value: 'listings', labelKey: 'admin_tab_listings' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="font-display text-3xl font-bold text-teal-900 dark:text-teal-50">{t('admin_title')}</h1>
        </div>
        <p className="text-teal-600 dark:text-teal-300">{t('admin_sub')}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.value}
            onClick={() => setTab(tabItem.value)}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              tab === tabItem.value ? 'bg-teal-700 text-white' : 'bg-cream-100 text-teal-700 hover:bg-cream-200 dark:bg-teal-900 dark:text-teal-200 dark:hover:bg-teal-800'
            }`}
          >
            {t(tabItem.labelKey)}
            {tabItem.badge !== undefined && tabItem.badge > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tab === tabItem.value ? 'bg-white/20' : 'bg-amber-500 text-white'}`}>{tabItem.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Building2, label: t('admin_total_donors'), value: mockDonors.length, color: 'text-teal-700 dark:text-teal-300' },
              { icon: Users, label: t('admin_total_ngos'), value: ngos.length, color: 'text-teal-700 dark:text-teal-300' },
              { icon: Package, label: t('admin_active'), value: listings.filter((l) => l.status === 'ready' || l.status === 'forecast').length, color: 'text-amber-600 dark:text-amber-400' },
              { icon: ShieldAlert, label: t('admin_pending'), value: pendingNgos.length, color: 'text-error-600 dark:text-error-400' },
            ].map((stat) => (
              <div key={stat.label} className="card flex flex-col items-center justify-center text-center py-5">
                <stat.icon className={`h-7 w-7 mb-2 ${stat.color}`} />
                <div className={`font-display text-3xl font-bold ${stat.color} tabular-nums`}>{stat.value}</div>
                <div className="text-xs text-teal-500 dark:text-teal-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {pendingNgos.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold text-teal-900 dark:text-teal-50 mb-3">{t('admin_queue')}</h2>
              <div className="space-y-3">
                {pendingNgos.map((ngo) => (
                  <div key={ngo.id} className="card flex items-center justify-between gap-4 border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-teal-900 dark:text-teal-50">{ngo.name}</p>
                        <p className="text-sm text-teal-500 dark:text-teal-400">{ngo.type} • {ngo.area} • {ngo.peopleCount} {t('people')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(ngo.id)} className="btn-ghost text-success-700 dark:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/20">
                        <CheckCircle2 className="h-5 w-5" /> {t('admin_approve')}
                      </button>
                      <button onClick={() => handleReject(ngo.id)} className="btn-ghost text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20">
                        <XCircle className="h-5 w-5" /> {t('admin_reject')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-lg font-bold text-teal-900 dark:text-teal-50 mb-3">{t('admin_recent')}</h2>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-300 dark:border-teal-800 text-left text-teal-500 dark:text-teal-400">
                    <th className="pb-3 font-semibold">Donor</th>
                    <th className="pb-3 font-semibold">Food</th>
                    <th className="pb-3 font-semibold">Qty</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Area</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr key={l.id} className="border-b border-cream-200 dark:border-teal-800/50 last:border-0">
                      <td className="py-3 text-teal-800 dark:text-teal-200 font-medium">{l.donorName}</td>
                      <td className="py-3"><span className={`tag ${foodTypeColor(l.foodType)}`}>{foodTypeLabelT(l.foodType, t)}</span></td>
                      <td className="py-3 text-teal-700 dark:text-teal-300">{l.quantityPeople}</td>
                      <td className="py-3"><span className={`tag ${statusColor(l.status)}`}>{statusLabelT(l.status, t)}</span></td>
                      <td className="py-3 text-teal-700 dark:text-teal-300">{l.area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NGOs */}
      {tab === 'ngos' && (
        <div className="space-y-4 animate-fade-in">
          {pendingNgos.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold text-amber-700 dark:text-amber-400 mb-3">{t('admin_pending_ver')}</h2>
              {pendingNgos.map((ngo) => (
                <div key={ngo.id} className="card mb-3 border-amber-200 dark:border-amber-800">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-teal-900 dark:text-teal-50">{ngo.name}</h3>
                        <span className="tag bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">Pending</span>
                      </div>
                      <div className="text-sm text-teal-600 dark:text-teal-300 space-y-1">
                        <p className="flex items-center gap-2"><Building2 className="h-4 w-4" /> {ngo.type}</p>
                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {ngo.area}</p>
                        <p className="flex items-center gap-2"><Users className="h-4 w-4" /> {ngo.peopleCount} {t('people')}</p>
                        <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 {ngo.phone}</p>
                        <p className="text-amber-700 dark:text-amber-400">Reg. No: {ngo.registrationNumber || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={() => handleApprove(ngo.id)} className="btn-primary flex-1 text-sm">
                        <CheckCircle2 className="h-5 w-5" /> {t('admin_approve')}
                      </button>
                      <button onClick={() => handleReject(ngo.id)} className="btn-ghost text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <h2 className="font-display text-lg font-bold text-teal-900 dark:text-teal-50 mb-3">{t('admin_verified_ngos')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verifiedNgos.map((ngo) => (
                <div key={ngo.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-teal-900 dark:text-teal-50">{ngo.name}</h3>
                        <span className="tag bg-success-100 text-success-700 border border-success-200 dark:bg-success-900/30 dark:text-success-400 dark:border-success-800">
                          <ShieldCheck className="h-3 w-3" /> {t('ngo_verified')}
                        </span>
                      </div>
                      <p className="text-sm text-teal-500 dark:text-teal-400 mt-0.5">{ngo.type} • {ngo.area}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg font-bold text-teal-700 dark:text-teal-300">{ngo.reliabilityScore}</div>
                      <div className="text-xs text-teal-400">{t('donor_reliability')}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center rounded-lg bg-cream-100 dark:bg-teal-900/40 py-2">
                      <div className="font-bold text-teal-800 dark:text-teal-200">{ngo.peopleCount}</div>
                      <div className="text-xs text-teal-400">{t('people')}</div>
                    </div>
                    <div className="text-center rounded-lg bg-cream-100 dark:bg-teal-900/40 py-2">
                      <div className="font-bold text-teal-800 dark:text-teal-200">{ngo.mealsReceived}</div>
                      <div className="text-xs text-teal-400">Meals</div>
                    </div>
                    <div className="text-center rounded-lg bg-cream-100 dark:bg-teal-900/40 py-2">
                      <div className="font-bold text-teal-800 dark:text-teal-200 text-xs">{ngo.foodPreference.map((f) => foodTypeLabelT(f, t)).join(', ')}</div>
                      <div className="text-xs text-teal-400">Food</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Donors */}
      {tab === 'donors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {mockDonors.map((donor) => (
            <div key={donor.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-teal-900 dark:text-teal-50">{donor.name}</h3>
                  <p className="text-sm text-teal-500 dark:text-teal-400">{donor.type} • {donor.area}</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-bold text-teal-700 dark:text-teal-300">{donor.reliabilityScore}</div>
                  <div className="text-xs text-teal-400">{t('donor_reliability')}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-cream-100 dark:bg-teal-900/40 py-2 text-center">
                  <div className="font-bold text-teal-800 dark:text-teal-200">{donor.mealsRescued}</div>
                  <div className="text-xs text-teal-400">{t('donor_meals')}</div>
                </div>
                <div className="rounded-lg bg-cream-100 dark:bg-teal-900/40 py-2 text-center">
                  <div className="font-bold text-teal-800 dark:text-teal-200 flex items-center justify-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {donor.phone.slice(-4)}
                  </div>
                  <div className="text-xs text-teal-400">Phone</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Listings */}
      {tab === 'listings' && (
        <div className="space-y-3 animate-fade-in">
          {listings.map((l) => (
            <div key={l.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`tag ${foodTypeColor(l.foodType)}`}>{foodTypeLabelT(l.foodType, t)}</span>
                  <span className={`tag ${statusColor(l.status)}`}>{statusLabelT(l.status, t)}</span>
                </div>
                {(l.status === 'ready' || l.status === 'claimed') && <CountdownTimer safeTill={l.safeTill} size="sm" />}
              </div>
              <p className="text-teal-900 dark:text-teal-100 font-medium mb-2">{l.foodDescription}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex flex-wrap gap-4 text-teal-600 dark:text-teal-300">
                  <span>{l.donorName}</span>
                  <span>{l.quantityPeople} {t('people')}</span>
                  <span>{l.area}</span>
                  {l.claimedByNgoName && <span className="text-teal-800 dark:text-teal-100 font-medium">→ {l.claimedByNgoName}</span>}
                </div>
                {l.status === 'claimed' && (
                  <button onClick={() => handleReassign(l.id)} className="btn-ghost text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm">
                    <RefreshCw className="h-4 w-4" /> {t('admin_reassign')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
