import { UtensilsCrossed, ShieldCheck, Truck, KeyRound, ArrowRight, Heart, Sparkles, Clock, Users, LogIn } from 'lucide-react';
import { useNav } from '@/context/NavContext';
import { useLang } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import ImpactCounter from '@/components/ImpactCounter';
import { mockImpact } from '@/data/mockData';

export default function HomePage() {
  const { navigate } = useNav();
  const { t, lang } = useLang();
  const { user } = useAuth();

  const steps = [
    { icon: UtensilsCrossed, title: t('home_step1_title'), desc: t('home_step1_desc') },
    { icon: ShieldCheck, title: t('home_step2_title'), desc: t('home_step2_desc') },
    { icon: KeyRound, title: t('home_step3_title'), desc: t('home_step3_desc') },
    { icon: Heart, title: t('home_step4_title'), desc: t('home_step4_desc') },
  ];

  const handleDonor = () => {
    if (user) navigate('donor', 'donor');
    else navigate('login');
  };

  const handleNgo = () => {
    if (user) navigate('ngo', 'ngo');
    else navigate('login');
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream-50 dark:bg-teal-950">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cream-50 to-amber-50 dark:from-teal-900 dark:via-teal-950 dark:to-teal-900 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 dark:bg-teal-800 px-4 py-1.5 text-sm font-semibold text-teal-700 dark:text-teal-200 mb-6">
              <Sparkles className="h-4 w-4" />
              {t('home_pilot_badge')}
            </div>
            <h1 className="font-display text-4xl font-bold text-teal-900 dark:text-teal-50 sm:text-5xl lg:text-6xl leading-tight mb-6">
              {t('home_hero_line1')}<br />
              <span className="text-amber-600 dark:text-amber-400">{t('home_hero_line2')}</span>
            </h1>
            <p className="text-lg text-teal-600 dark:text-teal-300 leading-relaxed max-w-2xl mx-auto mb-10">
              {t('home_hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleDonor} className="btn-primary text-lg">
                {t('home_btn_donor')} <ArrowRight className="h-5 w-5" />
              </button>
              <button onClick={handleNgo} className="btn-secondary text-lg">
                {t('home_btn_ngo')} <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => navigate('board')}
              className="mt-4 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 underline-offset-4 hover:underline"
            >
              {t('home_btn_board')} →
            </button>
          </div>
        </div>
      </section>

      {/* Impact counter */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="mb-4 text-center">
          <h2 className="font-display text-xl font-bold text-teal-800 dark:text-teal-100">{t('home_impact_title')}</h2>
        </div>
        <ImpactCounter stats={mockImpact} labels={{
          meals: t('home_impact_meals'),
          live: t('home_impact_live'),
          pickups: t('home_impact_pickups'),
          ngos: t('home_impact_ngos'),
        }} />
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-teal-900 dark:text-teal-50 mb-3">
            {t('home_how_title')}
          </h2>
          <p className="text-teal-600 dark:text-teal-300">{t('home_how_sub')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="card h-full hover:shadow-md transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-200 mb-4">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {lang === 'hi' ? `चरण ${i + 1}` : `Step ${i + 1}`}
                </div>
                <h3 className="font-display text-lg font-semibold text-teal-900 dark:text-teal-50 mb-2">{step.title}</h3>
                <p className="text-sm text-teal-600 dark:text-teal-300 leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 h-6 w-6 text-teal-300 dark:text-teal-700 -translate-y-1/2 z-10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Safety highlight */}
      <section className="bg-cream-100 dark:bg-teal-900/40 border-y border-cream-300 dark:border-teal-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-teal-900 dark:text-teal-50 mb-1">{t('home_safety_title')}</h3>
                <p className="text-sm text-teal-600 dark:text-teal-300">{t('home_safety_desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-teal-900 dark:text-teal-50 mb-1">{t('home_countdown_title')}</h3>
                <p className="text-sm text-teal-600 dark:text-teal-300">{t('home_countdown_desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-200">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-teal-900 dark:text-teal-50 mb-1">{t('home_verified_title')}</h3>
                <p className="text-sm text-teal-600 dark:text-teal-300">{t('home_verified_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="rounded-3xl bg-teal-800 dark:bg-teal-900 px-6 py-12 sm:px-12 sm:py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            {t('home_cta_title')}
          </h2>
          <p className="text-teal-100 dark:text-teal-200 mb-8 max-w-xl mx-auto">
            {t('home_cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <button onClick={() => navigate(user.role === 'ngo' ? 'ngo' : 'donor')} className="btn-secondary text-lg">
                {t('home_cta_donor')}
              </button>
            ) : (
              <button onClick={() => navigate('login')} className="btn-secondary text-lg">
                <LogIn className="h-5 w-5" /> {t('home_cta_donor')}
              </button>
            )}
            <button onClick={() => navigate('board')} className="btn-outline text-lg border-white text-white hover:bg-teal-700 dark:hover:bg-teal-800">
              {t('home_cta_board')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
