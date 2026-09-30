import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Clock, Milestone, ExternalLink, Crosshair, Loader2, WifiOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLang } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

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
  helperId: string;
  helperName: string;
  taskId: string;
}

function createDivIcon(html: string, className: string) {
  return L.divIcon({
    html,
    className,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

const pickupIcon = createDivIcon(
  '<div style="background:#0f766e;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:16px">📍</div>',
  'pickup-marker'
);

const deliveryIcon = createDivIcon(
  '<div style="background:#f59e0b;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:16px">📦</div>',
  'delivery-marker'
);

const helperIcon = createDivIcon(
  '<div style="background:#2563eb;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:16px">🚚</div>',
  'helper-marker'
);

const helperIconPulse = createDivIcon(
  '<div style="position:relative;width:32px;height:32px"><div style="position:absolute;inset:0;background:#2563eb;border-radius:50%;opacity:0.4;animation:pulse-ring 2s ease-out infinite"></div><div style="position:absolute;inset:0;background:#2563eb;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:16px">🚚</div></div>',
  'helper-marker-pulse'
);

function FitBounds({ pickup, delivery, helperPos }: { pickup: MapLocation; delivery: MapLocation; helperPos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    const points: [number, number][] = [
      [pickup.lat, pickup.lon],
      [delivery.lat, delivery.lon],
    ];
    if (helperPos) points.push(helperPos);
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, pickup, delivery, helperPos]);
  return null;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapRoute({ pickup, delivery, helperId, helperName, taskId }: Props) {
  const { theme } = useTheme();
  const { t } = useLang();

  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [routeLoading, setRouteLoading] = useState(true);
  const [routeError, setRouteError] = useState(false);
  const [helperPos, setHelperPos] = useState<[number, number] | null>(null);
  const [helperUpdatedAt, setHelperUpdatedAt] = useState<string | null>(null);
  const [liveConnected, setLiveConnected] = useState(false);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const watchIdRef = useRef<number | null>(null);

  const distance = routeCoords.length > 0
    ? routeCoords.reduce((acc, c, i) => (i === 0 ? 0 : acc + haversine(routeCoords[i - 1][0], routeCoords[i - 1][1], c[0], c[1])), 0)
    : haversine(pickup.lat, pickup.lon, delivery.lat, delivery.lon);
  const distanceKm = Math.round(distance * 10) / 10;
  const etaMin = Math.max(5, Math.round(distanceKm * 3));

  // Fetch OSRM route
  useEffect(() => {
    setRouteLoading(true);
    setRouteError(false);
    const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lon},${pickup.lat};${delivery.lon},${delivery.lat}?overview=full&geometries=geojson`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes[0]) {
          const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]]
          );
          setRouteCoords(coords);
        } else {
          setRouteError(true);
        }
      })
      .catch(() => setRouteError(true))
      .finally(() => setRouteLoading(false));
  }, [pickup, delivery]);

  // Subscribe to helper live position via Supabase Realtime
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    (async () => {
      // Try to load existing position
      const { data } = await supabase
        .from('helper_locations')
        .select('*')
        .eq('id', helperId)
        .maybeSingle();

      if (data) {
        setHelperPos([data.lat, data.lon]);
        setHelperUpdatedAt(data.updated_at);
      }

      channel = supabase
        .channel(`helper-location-${helperId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'helper_locations',
            filter: `id=eq.${helperId}`,
          },
          (payload) => {
            const row = payload.new as { lat: number; lon: number; updated_at: string } | null;
            if (row) {
              setHelperPos([row.lat, row.lon]);
              setHelperUpdatedAt(row.updated_at);
              setLiveConnected(true);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') setLiveConnected(true);
        });
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [helperId]);

  // Request browser geolocation and start uploading position
  const requestGeolocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('denied');
      return;
    }
    setGeoStatus('requesting');

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        setGeoStatus('granted');
        const { latitude, longitude, heading } = pos.coords;
        setHelperPos([latitude, longitude]);

        await supabase
          .from('helper_locations')
          .upsert({
            id: helperId,
            helper_name: helperName,
            task_id: taskId,
            lat: latitude,
            lon: longitude,
            heading: heading ?? 0,
            updated_at: new Date().toISOString(),
          });
      },
      () => setGeoStatus('denied'),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
  }, [helperId, helperName, taskId]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const fullMapUrl = `https://www.openstreetmap.org/directions?from=${pickup.lat},${pickup.lon}&to=${delivery.lat},${delivery.lon}`;

  const tileUrlLight = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileUrlDark = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const tileUrl = theme === 'dark' ? tileUrlDark : tileUrlLight;

  return (
    <div className="rounded-2xl border border-cream-300 dark:border-teal-800 bg-white dark:bg-teal-900 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-cream-200 dark:border-teal-800">
        <Navigation className="h-5 w-5 text-teal-600 dark:text-teal-300" />
        <h3 className="font-display text-sm font-bold text-teal-900 dark:text-teal-50">Route Map</h3>
        <div className="ml-auto flex items-center gap-3 text-xs font-semibold text-teal-600 dark:text-teal-300">
          <span className="flex items-center gap-1"><Milestone className="h-3.5 w-3.5" /> {distanceKm} km</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{etaMin} min</span>
          <a href={fullMapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-teal-500 hover:text-teal-700 dark:hover:text-teal-200 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" /> Open
          </a>
        </div>
      </div>

      {/* Live status bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-teal-50 dark:bg-teal-800/50 border-b border-cream-200 dark:border-teal-800 text-xs">
        <div className="flex items-center gap-1.5">
          {liveConnected ? (
            <span className="flex items-center gap-1 text-success-600 dark:text-success-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse" /> Live tracking on
            </span>
          ) : (
            <span className="flex items-center gap-1 text-teal-500 dark:text-teal-400">
              <WifiOff className="h-3.5 w-3.5" /> Connecting…
            </span>
          )}
        </div>
        {helperUpdatedAt && (
          <span className="text-teal-400 dark:text-teal-500">
            Updated {new Date(helperUpdatedAt).toLocaleTimeString()}
          </span>
        )}
        <div className="ml-auto">
          {geoStatus === 'idle' && (
            <button onClick={requestGeolocation} className="flex items-center gap-1 text-teal-600 dark:text-teal-300 font-semibold hover:text-teal-800 dark:hover:text-teal-100 transition-colors">
              <Crosshair className="h-3.5 w-3.5" /> Share my location
            </button>
          )}
          {geoStatus === 'requesting' && (
            <span className="flex items-center gap-1 text-teal-500 dark:text-teal-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Requesting…
            </span>
          )}
          {geoStatus === 'granted' && (
            <span className="flex items-center gap-1 text-success-600 dark:text-success-400 font-semibold">
              <Crosshair className="h-3.5 w-3.5" /> Location shared
            </span>
          )}
          {geoStatus === 'denied' && (
            <span className="text-error-500 dark:text-error-400">Location permission denied</span>
          )}
        </div>
      </div>

      <div className="relative w-full" style={{ height: '400px' }}>
        <MapContainer
          center={[pickup.lat, pickup.lon]}
          zoom={13}
          className="w-full h-full z-0"
          scrollWheelZoom={false}
        >
          <TileLayer
            url={tileUrl}
            attribution='&copy; OpenStreetMap, &copy; CARTO'
            maxZoom={19}
          />

          <FitBounds pickup={pickup} delivery={delivery} helperPos={helperPos} />

          {/* Pickup marker */}
          <Marker position={[pickup.lat, pickup.lon]} icon={pickupIcon}>
            <Popup>
              <div className="text-sm">
                <strong>{t('volunteer_pickup_from')}</strong>
                <br />
                {pickup.name}
                <br />
                <span className="text-teal-600">{pickup.area}</span>
                {pickup.phone && <br />}
                {pickup.phone && <span className="text-teal-600">+91 {pickup.phone}</span>}
              </div>
            </Popup>
          </Marker>

          {/* Delivery marker */}
          <Marker position={[delivery.lat, delivery.lon]} icon={deliveryIcon}>
            <Popup>
              <div className="text-sm">
                <strong>{t('volunteer_deliver_to')}</strong>
                <br />
                {delivery.name}
                <br />
                <span className="text-teal-600">{delivery.area}</span>
              </div>
            </Popup>
          </Marker>

          {/* OSRM route */}
          {routeCoords.length > 0 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: '#f59e0b', weight: 4, opacity: 0.8, dashArray: '8,6' }}
            />
          )}

          {/* Live helper marker */}
          {helperPos && (
            <Marker position={helperPos} icon={geoStatus === 'granted' ? helperIconPulse : helperIcon}>
              <Popup>
                <div className="text-sm">
                  <strong>{helperName}</strong>
                  <br />
                  <span className="text-blue-600">Live position</span>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {routeLoading && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] rounded-full bg-white/90 dark:bg-teal-800/90 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-200 shadow-md flex items-center gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching route…
          </div>
        )}

        {routeError && !routeLoading && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] rounded-full bg-amber-100 dark:bg-amber-900/40 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-md">
            Route unavailable — showing straight line
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 border-t border-cream-200 dark:border-teal-800">
        <div className="px-4 py-3 border-r border-cream-200 dark:border-teal-800">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-teal-600" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-teal-500 dark:text-teal-400">{t('volunteer_pickup_from')}</span>
          </div>
          <p className="text-sm font-semibold text-teal-900 dark:text-teal-50">{pickup.name}</p>
          <p className="text-xs text-teal-500 dark:text-teal-400">{pickup.area}</p>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">{t('volunteer_deliver_to')}</span>
          </div>
          <p className="text-sm font-semibold text-teal-900 dark:text-teal-50">{delivery.name}</p>
          <p className="text-xs text-teal-500 dark:text-teal-400">{delivery.area}</p>
        </div>
      </div>
    </div>
  );
}
