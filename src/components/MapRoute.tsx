import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Clock, Crosshair, ExternalLink, Loader2, MapPin, Milestone, Navigation, Package, Truck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLang } from '@/context/LanguageContext';

export interface MapLocation {
  name: string;
  area: string;
  lat: number;
  lon: number;
  phone?: string;
}

interface Props {
  pickup: MapLocation;
  delivery: MapLocation;
  helperName: string;
}

type MarkerKey = 'pickup' | 'delivery' | 'helper' | null;
type GeoStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'demo';
type Point = [number, number];

function distanceBetween(first: MapLocation, second: MapLocation): number {
  const latitudeDistance = (second.lat - first.lat) * 111;
  const longitudeDistance = (second.lon - first.lon) * 111 * Math.cos((first.lat * Math.PI) / 180);
  return Math.sqrt(latitudeDistance ** 2 + longitudeDistance ** 2);
}

function positionBetween(first: MapLocation, second: MapLocation, progress: number): Point {
  return [
    first.lat + (second.lat - first.lat) * progress,
    first.lon + (second.lon - first.lon) * progress,
  ];
}

export default function MapRoute({ pickup, delivery, helperName }: Props) {
  const { theme } = useTheme();
  const { t } = useLang();
  const [activeMarker, setActiveMarker] = useState<MarkerKey>(null);
  const [helperPos, setHelperPos] = useState<Point>(() => positionBetween(pickup, delivery, 0.42));
  const [helperUpdatedAt, setHelperUpdatedAt] = useState<Date | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const watchIdRef = useRef<number | null>(null);
  const simulationRef = useRef<number | null>(null);

  const routePoints = useMemo<Point[]>(() => {
    const midpoint = positionBetween(pickup, delivery, 0.5);
    const latitudeOffset = Math.abs(delivery.lon - pickup.lon) * 0.2;
    return [
      [pickup.lat, pickup.lon],
      positionBetween(pickup, delivery, 0.22),
      [midpoint[0] + latitudeOffset, midpoint[1]],
      positionBetween(pickup, delivery, 0.78),
      [delivery.lat, delivery.lon],
    ];
  }, [delivery, pickup]);

  const bounds = useMemo(() => {
    const points = [
      [pickup.lat, pickup.lon],
      [delivery.lat, delivery.lon],
      ...routePoints,
    ];
    const latitudes = points.map(([lat]) => lat);
    const longitudes = points.map(([, lon]) => lon);
    return {
      minLat: Math.min(...latitudes) - 0.001,
      maxLat: Math.max(...latitudes) + 0.001,
      minLon: Math.min(...longitudes) - 0.001,
      maxLon: Math.max(...longitudes) + 0.001,
    };
  }, [delivery, pickup, routePoints]);

  const toPercent = useCallback((point: Point): Point => {
    const x = ((point[1] - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * 100;
    const y = ((bounds.maxLat - point[0]) / (bounds.maxLat - bounds.minLat)) * 100;
    return [x, y];
  }, [bounds]);

  const routePercentages = routePoints.map(toPercent);
  const pickupPosition = toPercent([pickup.lat, pickup.lon]);
  const deliveryPosition = toPercent([delivery.lat, delivery.lon]);
  const helperPosition = toPercent(helperPos);
  const distanceKm = Math.round(distanceBetween(pickup, delivery) * 10) / 10;
  const etaMin = Math.max(5, Math.round(distanceKm * 3));
  const routePath = routePercentages.map(([x, y]) => `${x},${y}`).join(' ');

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (simulationRef.current !== null) {
      window.clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
  }, []);

  const startDemoTracking = useCallback(() => {
    let progress = 0.42;
    setGeoStatus('demo');
    setHelperPos(positionBetween(pickup, delivery, progress));
    setHelperUpdatedAt(new Date());
    simulationRef.current = window.setInterval(() => {
      progress = progress >= 0.9 ? 0.18 : progress + 0.03;
      setHelperPos(positionBetween(pickup, delivery, progress));
      setHelperUpdatedAt(new Date());
    }, 2500);
  }, [delivery, pickup]);

  const requestGeolocation = useCallback(() => {
    stopTracking();
    if (!('geolocation' in navigator)) {
      startDemoTracking();
      return;
    }

    setGeoStatus('requesting');
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setGeoStatus('granted');
        setHelperPos([position.coords.latitude, position.coords.longitude]);
        setHelperUpdatedAt(new Date());
      },
      () => startDemoTracking(),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  }, [startDemoTracking, stopTracking]);

  useEffect(() => stopTracking, [stopTracking]);

  const markerButton = (marker: MarkerKey, position: Point, className: string, label: string, icon: ReactNode) => (
    <button
      type="button"
      onClick={() => setActiveMarker(activeMarker === marker ? null : marker)}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${className}`}
      style={{ left: `${position[0]}%`, top: `${position[1]}%` }}
      aria-label={label}
    >
      <span className="flex h-9 w-9 items-center justify-center text-white">{icon}</span>
    </button>
  );

  return (
    <div className="rounded-2xl border border-cream-300 dark:border-teal-800 bg-white dark:bg-teal-900 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-cream-200 dark:border-teal-800">
        <Navigation className="h-5 w-5 text-teal-600 dark:text-teal-300" />
        <h3 className="font-display text-sm font-bold text-teal-900 dark:text-teal-50">Route Map</h3>
        <div className="ml-auto flex items-center gap-3 text-xs font-semibold text-teal-600 dark:text-teal-300">
          <span className="flex items-center gap-1"><Milestone className="h-3.5 w-3.5" /> {distanceKm} km</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{etaMin} min</span>
          <span className="hidden sm:flex items-center gap-1 text-teal-400"><ExternalLink className="h-3.5 w-3.5" /> Demo route</span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-teal-50 dark:bg-teal-800/50 border-b border-cream-200 dark:border-teal-800 text-xs">
        <span className="flex items-center gap-1.5 text-success-600 dark:text-success-400 font-semibold">
          <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse" /> Local tracking ready
        </span>
        {helperUpdatedAt && <span className="text-teal-400 dark:text-teal-500">Updated {helperUpdatedAt.toLocaleTimeString()}</span>}
        <div className="ml-auto">
          {geoStatus === 'idle' && (
            <button onClick={requestGeolocation} className="flex items-center gap-1 text-teal-600 dark:text-teal-300 font-semibold hover:text-teal-800 dark:hover:text-teal-100 transition-colors">
              <Crosshair className="h-3.5 w-3.5" /> Share my location
            </button>
          )}
          {geoStatus === 'requesting' && <span className="flex items-center gap-1 text-teal-500"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Requesting…</span>}
          {geoStatus === 'granted' && <span className="flex items-center gap-1 text-success-600 dark:text-success-400 font-semibold"><Crosshair className="h-3.5 w-3.5" /> Location shown locally</span>}
          {geoStatus === 'demo' && <span className="flex items-center gap-1 text-teal-600 dark:text-teal-300 font-semibold"><Truck className="h-3.5 w-3.5" /> Demo movement active</span>}
        </div>
      </div>

      <div className={`relative w-full overflow-hidden ${theme === 'dark' ? 'bg-teal-950' : 'bg-[#e7f1ee]'}`} style={{ height: '400px' }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-label="Local route preview">
          <defs>
            <pattern id="map-grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke={theme === 'dark' ? '#25645f' : '#c9ddd7'} strokeWidth="0.25" />
            </pattern>
            <filter id="route-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0.5" stdDeviation="0.6" floodOpacity="0.25" />
            </filter>
          </defs>
          <rect width="100" height="100" fill="url(#map-grid)" />
          <path d="M -5 78 C 25 65, 28 34, 58 41 S 84 62, 105 18" fill="none" stroke={theme === 'dark' ? '#1f5d59' : '#bfd4ce'} strokeWidth="7" />
          <path d="M -5 78 C 25 65, 28 34, 58 41 S 84 62, 105 18" fill="none" stroke={theme === 'dark' ? '#31736d' : '#ffffff'} strokeWidth="5.5" />
          <path d="M 8 0 C 25 20, 30 58, 48 100" fill="none" stroke={theme === 'dark' ? '#1f5d59' : '#bfd4ce'} strokeWidth="5" />
          <path d="M 8 0 C 25 20, 30 58, 48 100" fill="none" stroke={theme === 'dark' ? '#2d6b65' : '#ffffff'} strokeWidth="3.5" />
          <polyline points={routePath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" filter="url(#route-shadow)" />
        </svg>

        <div className="absolute inset-0">
          {markerButton('pickup', pickupPosition, 'bg-teal-600', t('volunteer_pickup_from'), <MapPin className="h-5 w-5" fill="white" />)}
          {markerButton('delivery', deliveryPosition, 'bg-amber-500', t('volunteer_deliver_to'), <Package className="h-5 w-5" fill="white" />)}
          {markerButton('helper', helperPosition, 'bg-blue-600', helperName, <Truck className="h-5 w-5" />)}

          {activeMarker === 'pickup' && (
            <div className="absolute left-4 top-4 max-w-[210px] rounded-xl bg-white/95 dark:bg-teal-900/95 px-3 py-2 text-xs shadow-lg ring-1 ring-teal-100 dark:ring-teal-700">
              <p className="font-bold text-teal-900 dark:text-teal-50">{t('volunteer_pickup_from')}</p>
              <p className="text-teal-700 dark:text-teal-200">{pickup.name}</p>
              <p className="text-teal-500 dark:text-teal-400">{pickup.area}</p>
              {pickup.phone && <p className="text-teal-500 dark:text-teal-400">+91 {pickup.phone}</p>}
            </div>
          )}
          {activeMarker === 'delivery' && (
            <div className="absolute right-4 top-4 max-w-[210px] rounded-xl bg-white/95 dark:bg-teal-900/95 px-3 py-2 text-xs shadow-lg ring-1 ring-amber-100 dark:ring-teal-700">
              <p className="font-bold text-teal-900 dark:text-teal-50">{t('volunteer_deliver_to')}</p>
              <p className="text-teal-700 dark:text-teal-200">{delivery.name}</p>
              <p className="text-teal-500 dark:text-teal-400">{delivery.area}</p>
            </div>
          )}
          {activeMarker === 'helper' && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-white/95 dark:bg-teal-900/95 px-3 py-2 text-xs shadow-lg ring-1 ring-blue-100 dark:ring-teal-700">
              <p className="font-bold text-teal-900 dark:text-teal-50">{helperName}</p>
              <p className="text-blue-600 dark:text-blue-300">Local helper position</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-cream-200 dark:border-teal-800">
        <div className="px-4 py-3 border-r border-cream-200 dark:border-teal-800">
          <div className="flex items-center gap-2 mb-0.5"><span className="flex h-2.5 w-2.5 rounded-full bg-teal-600" /><span className="text-[10px] font-bold uppercase tracking-wide text-teal-500 dark:text-teal-400">{t('volunteer_pickup_from')}</span></div>
          <p className="text-sm font-semibold text-teal-900 dark:text-teal-50">{pickup.name}</p>
          <p className="text-xs text-teal-500 dark:text-teal-400">{pickup.area}</p>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-0.5"><span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" /><span className="text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">{t('volunteer_deliver_to')}</span></div>
          <p className="text-sm font-semibold text-teal-900 dark:text-teal-50">{delivery.name}</p>
          <p className="text-xs text-teal-500 dark:text-teal-400">{delivery.area}</p>
        </div>
      </div>
    </div>
  );
}
