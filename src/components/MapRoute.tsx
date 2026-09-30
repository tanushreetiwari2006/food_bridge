import { MapPin, Package, Navigation, Clock, Milestone, ExternalLink } from 'lucide-react';
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

  const padLat = 0.004;
  const padLon = 0.006;
  const minLat = Math.min(pickupLat, deliverLat) - padLat;
  const maxLat = Math.max(pickupLat, deliverLat) + padLat;
  const minLon = Math.min(pickupLon, deliverLon) - padLon;
  const maxLon = Math.max(pickupLon, deliverLon) + padLon;

  const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;
  const iframeUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${pickupLat},${pickupLon}`;
  const fullMapUrl = `https://www.openstreetmap.org/directions?from=${pickupLat},${pickupLon}&to=${deliverLat},${deliverLon}`;

  const rangeLon = maxLon - minLon;
  const rangeLat = maxLat - minLat;

  const pickupX = ((pickupLon - minLon) / rangeLon) * 100;
  const pickupY = ((maxLat - pickupLat) / rangeLat) * 100;
  const deliverX = ((deliverLon - minLon) / rangeLon) * 100;
  const deliverY = ((maxLat - deliverLat) / rangeLat) * 100;

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
          <a href={fullMapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-teal-500 hover:text-teal-700 dark:hover:text-teal-200 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" /> Open
          </a>
        </div>
      </div>

      <div className="relative w-full bg-teal-100 dark:bg-teal-800" style={{ height: '300px' }}>
        <iframe
          src={iframeUrl}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          title="Route map"
        />

        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrowhead" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <polygon points="0 0, 5 2.5, 0 5" fill="#f59e0b" />
              </marker>
            </defs>
            <line
              x1={pickupX} y1={pickupY}
              x2={deliverX} y2={deliverY}
              stroke="#f59e0b"
              strokeWidth="0.6"
              strokeDasharray="2,1.2"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
              opacity="0.9"
            />
          </svg>

          <div
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${pickupX}%`, top: `${pickupY}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg ring-2 ring-white dark:ring-teal-900">
                <MapPin className="h-5 w-5" fill="white" />
              </div>
              <div className="mt-1 rounded-md bg-white/95 dark:bg-teal-800/95 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:text-teal-100 shadow whitespace-nowrap">
                {t('volunteer_pickup_from')}
              </div>
            </div>
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${deliverX}%`, top: `${deliverY}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg ring-2 ring-white dark:ring-teal-900">
                <Package className="h-5 w-5" fill="white" />
              </div>
              <div className="mt-1 rounded-md bg-white/95 dark:bg-teal-800/95 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 shadow whitespace-nowrap">
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
