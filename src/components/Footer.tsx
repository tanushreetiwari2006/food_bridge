import { Phone, Mail, MapPin } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="mt-16 border-t border-cream-300 bg-cream-100 dark:bg-teal-950 dark:border-teal-800">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/photologo.jpeg" alt="Food Bridge" className="h-12 w-auto rounded-lg" />
              <span className="font-display text-lg font-bold text-teal-800 dark:text-teal-100">Food Bridge</span>
            </div>
            <p className="text-sm text-teal-600 dark:text-teal-300 max-w-md leading-relaxed">
              {t('footer_desc')}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-teal-800 dark:text-teal-100 mb-3">{t('footer_contact')}</h4>
            <ul className="space-y-2 text-sm text-teal-600 dark:text-teal-300">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@foodbridge.in</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Ghaziabad, UP</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-teal-800 dark:text-teal-100 mb-3">{t('footer_important')}</h4>
            <ul className="space-y-2 text-sm text-teal-600 dark:text-teal-300">
              <li>{t('footer_safety')}</li>
              <li>{t('footer_safety2')}</li>
              <li>{t('footer_sameday')}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-cream-300 dark:border-teal-800 pt-6 text-center">
          <p className="text-xs text-teal-500 dark:text-teal-400">
            {t('footer_made')}
          </p>
        </div>
      </div>
    </footer>
  );
}
