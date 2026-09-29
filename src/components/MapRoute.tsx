import { MapPin, Package, Navigation, Clock, Milestone } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

interface Props {
  pickupName: string;
  pickupArea: string;
  deliverName: string;
  deliverArea: string;
  pickupLat: number;
  pickupLon: number;
  deliverLat: number;
  deliverLon: number;
}

export default function MapRoute({ pickupName, pickupArea, deliverName, deliverArea, pickupLat, pickupLon, deliverLat, deliverLon }: Props) {
  const { t } = useLang();

  const minLat = Math.min(pickupLat, deliverLat) - 0.003;
  const maxLat = Math.max(pickupLat, deliverLat) + 0.003;
  const minLon = Math.min(pickupLon, deliverLon) - 0.003;
  const maxLon = Math.max(pickupLon, deliverLon) + 0.003;

  const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

  const pickupX = ((pickupLon - minLon) / (maxLon - minLon)) * 100;
  const pickupY = ((maxLat - pickupLat) / (maxLat - minLat)) * 100;
  const deliverX = ((deliverLon - minLon) / (maxLon - minLon)) * 100;
  const deliverY = ((maxLat - deliverLat) / (maxLat - minLat)) * 100;

  const distance = Math.round(Math.sqrt(Math.pow((deliverLat - pickupLat) * 111, 2) + Math.pow((deliverLon - pickupLon) * 111, 2)) * 10) / 10;
  const etaMin = Math.max(5, Math.round(distance * 3));

  return (
    <div className="rounded-2xl border border-cream-300 dark:border-teal-800 bg-white dark:bg-teal-900 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-cream-200 dark:border-teal-800">
        <Navigation className="h-5 w-5 text-teal-600 dark:text-teal-300" />
        <h3 className="font-display text-sm font-bold text-teal-900 dark:text-teal-50">Route Map</h3>
        <div className="ml-auto flex items-center gap-3 text-xs font-semibold text-teal-600 dark:text-teal-300">
          <span className="flex items-center gap-1"><Milestone className="h-3.5 w-3.5" /> {distance} km</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{etaMin} min</span>
        </div>
      </div>

      <div className="relative w-full" style={{ height: '280px' }}>
        <iframe
          src={mapUrl}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          title="Route map"
        />

        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#f59e0b" />
              </marker>
            </defs>
            <line
              x1={pickupX} y1={pickupY}
              x2={deliverX} y2={deliverY}
              stroke="#f59e0b"
              strokeWidth="0.8"
              strokeDasharray="2,1.5"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
            />
          </svg>

          <div
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${pickupX}%`, top: `${pickupY}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg ring-2 ring-white dark:ring-teal-900">
                <MapPin className="h-4 w-4" fill="white" />
              </div>
              <div className="mt-0.5 rounded-md bg-white/95 dark:bg-teal-800/95 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:text-teal-100 shadow whitespace-nowrap">
                {t('volunteer_pickup_from')}
              </div>
            </div>
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${deliverX}%`, top: `${deliverY}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg ring-2 ring-white dark:ring-teal-900">
                <Package className="h-4 w-4" fill="white" />
              </div>
              <div className="mt-0.5 rounded-md bg-white/95 dark:bg-teal-800/95 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 shadow whitespace-nowrap">
                {t('volunteer_deliver_to')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-cream-200 dark:border-teal-800">
        <div className="px-4 py-3 border-r border-cream-200 dark:border-teal-800">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-teal-600" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-teal-500 dark:text-teal-400">{t('volunteer_pickup_from')}</span>
          </div>
          <p className="text-sm font-semibold text-teal-900 dark:text-teal-50">{pickupName}</p>
          <p className="text-xs text-teal-500 dark:text-teal-400">{pickupArea}</p>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">{t('volunteer_deliver_to')}</span>
          </div>
          <p className="text-sm font-semibold text-teal-900 dark:text-teal-50">{deliverName}</p>
          <p className="text-xs text-teal-500 dark:text-teal-400">{deliverArea}</p>
        </div>
      </div>
    </div>
  );
}
