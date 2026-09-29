import { useEffect, useState } from 'react';
import { useLang } from '@/context/LanguageContext';

interface Props {
  safeTill: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CountdownTimer({ safeTill, size = 'md' }: Props) {
  const { t } = useLang();
  const [remaining, setRemaining] = useState('');
  const [urgency, setUrgency] = useState<'safe' | 'warning' | 'critical' | 'expired'>('safe');

  useEffect(() => {
    const update = () => {
      const diff = new Date(safeTill).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining('00:00');
        setUrgency('expired');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setRemaining(`${hours}h ${minutes.toString().padStart(2, '0')}m`);
      } else {
        setRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }

      if (diff < 30 * 60 * 1000) setUrgency('critical');
      else if (diff < 60 * 60 * 1000) setUrgency('warning');
      else setUrgency('safe');
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [safeTill]);

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-base px-4 py-2 gap-2',
    lg: 'text-2xl px-6 py-3.5 gap-3',
  };

  const urgencyClasses = {
    safe: 'bg-success-100 text-success-700 border border-success-200 dark:bg-success-900/30 dark:text-success-500 dark:border-success-800',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    critical: 'bg-error-100 text-error-700 border border-error-200 dark:bg-error-900/30 dark:text-error-400 dark:border-error-800 animate-pulse-soft',
    expired: 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700',
  };

  const iconSize = size === 'lg' ? 'h-7 w-7' : size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div
      className={`inline-flex items-center rounded-full font-bold tabular-nums ${sizeClasses[size]} ${urgencyClasses[urgency]}`}
      role="timer"
      aria-label={`${t('safe_for')} ${remaining}`}
    >
      <svg className={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 12 16" />
      </svg>
      <span>{urgency === 'expired' ? t('time_khatam') : `${t('safe_for')} ${remaining}`}</span>
    </div>
  );
}
