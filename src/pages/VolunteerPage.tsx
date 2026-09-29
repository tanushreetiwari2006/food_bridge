import { Users, MapPin, Clock, Phone, Package, KeyRound, AlertTriangle, CheckCircle2, Truck, Navigation } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import type { Listing } from '@/types';
import { foodTypeLabelT, foodTypeColor, statusLabelT, statusColor } from '@/utils/helpers';
import CountdownTimer from '@/components/CountdownTimer';
import MapRoute from '@/components/MapRoute';

export default function VolunteerPage() {
  const { t } = useLang();
  const { user, helpers } = useAuth();
  const [handoverInput, setHandoverInput] = useState('');
  const [handoverStatus, setHandoverStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Find helper record for this volunteer
  const myHelperRecord = helpers.find((h) => h.phone === user?.phone);

  // Demo: simulate a task assigned to this volunteer
  const [tasks] = useState<Listing[]>([
    {
      id: 'task-demo',
      donorId: 'd1',
      donorName: 'Sharma Caterers',
      donorArea: 'Indirapuram',
      donorPhone: '9876543210',
      foodType: 'veg',
      foodDescription: 'Daal, chawal, sabzi, roti',
      quantityPeople: 80,
      status: 'claimed',
      safeTill: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
      safeHours: 2.5,
      area: 'Indirapuram',
      pickupMethod: 'helper_pickup',
      pickupWindow: 'Now — within 1.5 hours',
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      claimedByNgoId: 'n1',
      claimedByNgoName: 'Ashray Orphanage',
      claimedByNgoPhone: '9001234567',
      handoverCode: '4729',
      claimedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      assignedHelperName: myHelperRecord?.name || user?.name || 'Volunteer',
      disclaimerAccepted: true,
      freshnessConfirmed: true,
      storageConfirmed: true,
    },
  ]);

  const handleHandoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handoverInput.length !== 4) {
      setHandoverStatus('error');
      return;
    }
    if (tasks.some((task) => task.handoverCode === handoverInput)) {
      setHandoverStatus('success');
    } else {
      setHandoverStatus('error');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="card mb-6 bg-gradient-to-br from-teal-700 to-teal-800 text-white border-0">
        <div className="flex items-center gap-3">
          <Truck className="h-8 w-8" />
          <div>
            <h1 className="font-display text-2xl font-bold">{t('volunteer_dashboard')}</h1>
            <p className="text-teal-100 text-sm">{t('volunteer_sub')}</p>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="card text-center py-16">
          <Truck className="h-12 w-12 text-teal-300 mx-auto mb-3" />
          <p className="text-teal-600 dark:text-teal-300 text-lg font-medium">{t('volunteer_no_tasks')}</p>
          <p className="text-sm text-teal-400 mt-1">{t('volunteer_no_tasks_sub')}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {tasks.map((task) => (
            <div key={task.id} className="card">
              {/* Status & timer */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`tag ${foodTypeColor(task.foodType)}`}>{foodTypeLabelT(task.foodType, t)}</span>
                  <span className={`tag ${statusColor(task.status)}`}>{statusLabelT(task.status, t)}</span>
                  <span className="tag bg-teal-100 text-teal-700 border border-teal-200 dark:bg-teal-800 dark:text-teal-200 dark:border-teal-700">
                    {t('helper_pickup')}
                  </span>
                </div>
                {task.status === 'claimed' && <CountdownTimer safeTill={task.safeTill} size="sm" />}
              </div>

              {/* Food description */}
              <p className="text-base text-teal-900 dark:text-teal-100 font-medium mb-3">{task.foodDescription}</p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2.5 text-sm mb-4">
                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300"><Users className="h-4 w-4 text-teal-500" /> {task.quantityPeople} {t('people')}</div>
                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300"><Clock className="h-4 w-4 text-teal-500" /> {task.pickupWindow}</div>
              </div>

              {/* Pickup & delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-cream-100 dark:bg-teal-900/40 px-3 py-3">
                  <div className="text-xs font-bold text-teal-500 dark:text-teal-400 mb-1">{t('volunteer_pickup_from')}</div>
                  <div className="flex items-center gap-2 text-sm text-teal-800 dark:text-teal-200">
                    <MapPin className="h-4 w-4 text-teal-500" />
                    <span className="font-semibold">{task.donorName}</span>
                  </div>
                  <div className="text-xs text-teal-500 dark:text-teal-400 mt-0.5">{task.donorArea}</div>
                  <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300 mt-1.5">
                    <Phone className="h-4 w-4 text-teal-500" />
                    <span className="font-mono font-semibold">+91 {task.donorPhone}</span>
                  </div>
                </div>
                <div className="rounded-xl bg-teal-50 dark:bg-teal-900/30 px-3 py-3">
                  <div className="text-xs font-bold text-teal-500 dark:text-teal-400 mb-1">{t('volunteer_deliver_to')}</div>
                  <div className="flex items-center gap-2 text-sm text-teal-800 dark:text-teal-200">
                    <Package className="h-4 w-4 text-teal-500" />
                    <span className="font-semibold">{task.claimedByNgoName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300 mt-1.5">
                    <Phone className="h-4 w-4 text-teal-500" />
                    <span className="font-mono font-semibold">+91 {task.claimedByNgoPhone}</span>
                  </div>
                </div>
              </div>

              {/* Route map */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-4 w-4 text-teal-600 dark:text-teal-300" />
                  <span className="text-sm font-bold text-teal-800 dark:text-teal-100">Route: Pickup to Delivery</span>
                </div>
                <MapRoute
                  pickupName={task.donorName}
                  pickupArea={task.donorArea}
                  deliverName={task.claimedByNgoName || ''}
                  deliverArea={task.area}
                  pickupLat={28.6428}
                  pickupLon={77.4967}
                  deliverLat={28.6353}
                  deliverLon={77.5048}
                />
              </div>

              {/* Handover confirm */}
              {task.status === 'claimed' && (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3">
                    <KeyRound className="h-4 w-4" /> {t('ngo_handover_title')}
                  </div>
                  <form onSubmit={handleHandoverSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={handoverInput}
                      onChange={(e) => { setHandoverInput(e.target.value.replace(/\D/g, '').slice(0, 4)); setHandoverStatus('idle'); }}
                      placeholder={t('ngo_handover_code_label')}
                      className="input-field text-center font-display text-xl tracking-[0.3em] font-bold flex-1"
                      maxLength={4}
                    />
                    <button type="submit" className="btn-secondary">
                      <CheckCircle2 className="h-5 w-5" /> {t('ngo_handover_confirm')}
                    </button>
                  </form>
                  {handoverStatus === 'success' && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-success-100 dark:bg-success-900/30 px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 text-success-600 dark:text-success-400" />
                      <p className="text-sm font-semibold text-success-700 dark:text-success-400">{t('ngo_handover_success')}</p>
                    </div>
                  )}
                  {handoverStatus === 'error' && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-error-100 dark:bg-error-900/30 px-3 py-2">
                      <AlertTriangle className="h-4 w-4 text-error-600 dark:text-error-400" />
                      <p className="text-sm font-semibold text-error-700 dark:text-error-400">{t('ngo_handover_error')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 px-3 py-2.5 mt-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{t('disclaimer')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
