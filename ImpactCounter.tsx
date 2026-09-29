import { useEffect, useRef, useState } from 'react';
import { UtensilsCrossed, Package, CheckCircle, Users } from 'lucide-react';
import type { ImpactStats } from '@/types';

interface Props {
  stats: ImpactStats;
  labels?: {
    meals: string;
    live: string;
    pickups: string;
    ngos: string;
  };
}

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const start = Date.now();
    const update = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(update);
      else setCount(target);
    };
    requestAnimationFrame(update);
  }, [target, duration]);

  return count;
}

export default function ImpactCounter({ stats, labels }: Props) {
  const meals = useCountUp(stats.mealsRescued);
  const pickups = useCountUp(stats.pickupsDone);
  const live = useCountUp(stats.liveListings);
  const ngos = useCountUp(stats.ngosActive);

  const items = [
    { icon: UtensilsCrossed, label: labels?.meals ?? 'Meals rescued', value: meals, color: 'text-teal-700 dark:text-teal-300' },
    { icon: Package, label: labels?.live ?? 'Live listings', value: live, color: 'text-amber-600 dark:text-amber-400' },
    { icon: CheckCircle, label: labels?.pickups ?? 'Pickups done', value: pickups, color: 'text-success-600 dark:text-success-500' },
    { icon: Users, label: labels?.ngos ?? 'Active NGOs', value: ngos, color: 'text-teal-700 dark:text-teal-300' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="card flex flex-col items-center justify-center text-center py-5 hover:shadow-md transition-all"
        >
          <item.icon className={`h-7 w-7 mb-2 ${item.color}`} />
          <div className={`font-display text-2xl font-bold sm:text-3xl ${item.color} tabular-nums`}>
            {item.value.toLocaleString('en-IN')}
          </div>
          <div className="text-xs sm:text-sm font-medium text-teal-500 dark:text-teal-400 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
