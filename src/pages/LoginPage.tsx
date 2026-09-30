import { useState } from 'react';
import { ArrowRight, ArrowLeft, Phone, KeyRound, ShieldCheck, Building2, Users, Truck, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import { useNav } from '@/context/NavContext';
import type { Role, AuthUser } from '@/types';

type Step = 'role' | 'phone' | 'otp' | 'verify' | 'admin';

export default function LoginPage() {
  const { t } = useLang();
  const { login, setPendingRole, setPendingPhone, pendingRole, pendingPhone, isRegisteredHelper, helpers } = useAuth();
  const { navigate } = useNav();

  const [step, setStep] = useState<Step>('role');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  // Verification form state
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [verifyError, setVerifyError] = useState('');

  const roles: { role: Role; icon: typeof Truck; labelKey: string; descKey: string }[] = [
    { role: 'donor', icon: Building2, labelKey: 'login_donor', descKey: 'login_donor_desc' },
    { role: 'ngo', icon: Users, labelKey: 'login_ngo', descKey: 'login_ngo_desc' },
    { role: 'volunteer', icon: Truck, labelKey: 'login_volunteer', descKey: 'login_volunteer_desc' },
  ];

  const handleLogoDoubleClick = () => {
    setStep('admin');
    setPendingRole('admin');
    setPhone('');
    setOtp('');
    setOtpError('');
    setPhoneError('');
  };

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 2) {
      handleLogoDoubleClick();
      setLogoClicks(0);
    }
    setTimeout(() => setLogoClicks(0), 300);
  };

  const handleRoleSelect = (role: Role) => {
    setPendingRole(role);
    setStep('phone');
    setPhone('');
    setPhoneError('');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length !== 10) {
      setPhoneError(t('login_invalid_phone'));
      return;
    }

    // Volunteer: check if phone is registered as a helper
    if (pendingRole === 'volunteer') {
      if (!isRegisteredHelper(phone)) {
        setPhoneError(t('login_volunteer_not_added'));
        return;
      }
    }

    setPhoneError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPendingPhone(phone);
      setStep('otp');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const validOtp = pendingRole === 'admin' ? '1234' : '123456';
    if (otp !== validOtp) {
      setOtpError(pendingRole === 'admin' ? t('login_invalid_otp').replace('123456', '1234') : t('login_invalid_otp'));
      return;
    }
    setOtpError('');

    if (pendingRole === 'admin') {
      const adminUser: AuthUser = {
        id: 'admin',
        phone: pendingPhone || phone,
        role: 'admin',
        name: 'Admin',
        area: 'Ghaziabad',
        verified: true,
        joinedAt: new Date().toISOString(),
      };
      login(adminUser);
      navigate('admin', 'admin');
      return;
    }

    // Volunteer: no verification step needed, find helper info
    if (pendingRole === 'volunteer') {
      const helperRecord = helpers.find((h) => h.phone === (pendingPhone || phone));
      const volunteerUser: AuthUser = {
        id: `vol-${pendingPhone}`,
        phone: pendingPhone || phone,
        role: 'volunteer',
        name: helperRecord?.name || 'Volunteer',
        area: '',
        verified: true,
        joinedAt: new Date().toISOString(),
      };
      login(volunteerUser);
      navigate('volunteer', 'volunteer');
      return;
    }

    setStep('verify');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');

    if (!name.trim() || !area.trim()) {
      setVerifyError(t('login_invalid_phone'));
      return;
    }

    if (pendingRole === 'donor' && (!orgName.trim() || !orgType)) {
      setVerifyError(t('login_invalid_phone'));
      return;
    }
    if (pendingRole === 'ngo' && (!orgName.trim() || !orgType)) {
      setVerifyError(t('login_invalid_phone'));
      return;
    }

    const newUser: AuthUser = {
      id: `u${Date.now()}`,
      phone: pendingPhone || phone,
      role: pendingRole || 'donor',
      name,
      area,
      orgName: orgName || undefined,
      orgType: orgType || undefined,
      registrationNumber: pendingRole === 'ngo' ? regNumber : undefined,
      verified: pendingRole === 'donor',
      joinedAt: new Date().toISOString(),
    };

    login(newUser);
    if (newUser.role === 'donor') navigate('donor', 'donor');
    else if (newUser.role === 'ngo') navigate('ngo', 'ngo');
    else navigate('home');
  };

  const donorTypes = [
    { value: 'caterer', label: t('verify_donor_type_caterer') },
    { value: 'banquet', label: t('verify_donor_type_banquet') },
    { value: 'event', label: t('verify_donor_type_event') },
    { value: 'mess', label: t('verify_donor_type_mess') },
  ];

  const ngoTypes = [
    { value: 'orphanage', label: t('verify_ngo_type_orphanage') },
    { value: 'shelter', label: t('verify_ngo_type_shelter') },
    { value: 'foodbank', label: t('verify_ngo_type_foodbank') },
  ];

  const orgTypes = pendingRole === 'donor' ? donorTypes : ngoTypes;
  const isAdminStep = step === 'admin';
  const otpLength = isAdminStep ? 4 : 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-teal-50 to-amber-50 dark:from-teal-950 dark:via-teal-900 dark:to-teal-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo — double-click for admin */}
        <div className="text-center mb-6">
          <button
            onClick={handleLogoClick}
            className="inline-flex h-16 w-16 rounded-2xl shadow-lg mb-3 focus-visible:outline-none overflow-hidden"
            aria-label="Food Bridge logo"
          >
            <img src="/ChatGPT_Image_Sep_30,_2026,_09_08_03_AM.png" alt="Food Bridge" className="h-full w-full object-cover" />
          </button>
          <h1 className="font-display text-2xl font-bold text-teal-900 dark:text-teal-50">Food Bridge</h1>
          <p className="text-sm text-teal-500 dark:text-teal-400">{t('brand_tagline')}</p>
        </div>

        <div className="card animate-slide-up">
          {/* Step: Role selection */}
          {step === 'role' && (
            <div>
              <h2 className="font-display text-xl font-bold text-teal-900 dark:text-teal-50 mb-1">{t('login_title')}</h2>
              <p className="text-sm text-teal-500 dark:text-teal-400 mb-5">{t('login_subtitle')}</p>
              <div className="space-y-3">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleRoleSelect(r.role)}
                    className="w-full flex items-center gap-4 rounded-xl border-2 border-cream-300 p-4 text-left transition-all hover:border-teal-500 hover:bg-teal-50 dark:border-teal-700 dark:hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-200">
                      <r.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-teal-900 dark:text-teal-50">{t(r.labelKey)}</div>
                      <div className="text-xs text-teal-500 dark:text-teal-400">{t(r.descKey)}</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-teal-400" />
                  </button>
                ))}
              </div>
              {pendingRole === 'volunteer' && (
                <p className="mt-4 text-xs text-teal-400 px-2 leading-relaxed">
                  {t('login_volunteer_note')}
                </p>
              )}
            </div>
          )}

          {/* Step: Admin (phone + OTP combined) */}
          {isAdminStep && (
            <div>
              <button
                onClick={() => { setStep('role'); setPendingRole(null); }}
                className="flex items-center gap-1 text-sm font-semibold text-teal-600 dark:text-teal-400 mb-4 hover:text-teal-800 dark:hover:text-teal-200"
              >
                <ArrowLeft className="h-4 w-4" /> {t('login_back')}
              </button>
              <h2 className="font-display text-lg font-bold text-teal-900 dark:text-teal-50 mb-1">{t('nav_admin')}</h2>
              <p className="text-sm text-teal-500 dark:text-teal-400 mb-5">{t('login_step1')}</p>
              <form onSubmit={(e) => { e.preventDefault(); if (phone.length === 10) { setPendingPhone(phone); setStep('otp'); } }}>
                <div className="relative mb-4">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setPhoneError(''); }}
                    placeholder={t('login_phone_placeholder')}
                    className="input-field pl-11 text-lg tracking-wider"
                    autoFocus
                  />
                </div>
                {phoneError && <p className="text-sm text-error-600 dark:text-error-400 mb-3">{phoneError}</p>}
                <button type="submit" className="btn-primary w-full" disabled={phone.length !== 10}>
                  <Phone className="h-5 w-5" /> {t('login_send_otp')}
                </button>
              </form>
            </div>
          )}

          {/* Step: Phone number */}
          {step === 'phone' && (
            <div>
              <button
                onClick={() => setStep('role')}
                className="flex items-center gap-1 text-sm font-semibold text-teal-600 dark:text-teal-400 mb-4 hover:text-teal-800 dark:hover:text-teal-200"
              >
                <ArrowLeft className="h-4 w-4" /> {t('login_back')}
              </button>
              <h2 className="font-display text-lg font-bold text-teal-900 dark:text-teal-50 mb-1">{t('login_step1')}</h2>
              <p className="text-sm text-teal-500 dark:text-teal-400 mb-5">
                {pendingRole === 'donor' ? t('login_donor') : pendingRole === 'ngo' ? t('login_ngo') : t('login_volunteer')}
              </p>
              {pendingRole === 'volunteer' && (
                <p className="text-xs text-amber-700 dark:text-amber-400 mb-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-3 py-2.5 leading-relaxed">
                  {t('login_volunteer_note')}
                </p>
              )}
              <form onSubmit={handleSendOtp}>
                <div className="relative mb-4">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setPhoneError(''); }}
                    placeholder={t('login_phone_placeholder')}
                    className="input-field pl-11 text-lg tracking-wider"
                    autoFocus
                  />
                </div>
                {phoneError && <p className="text-sm text-error-600 dark:text-error-400 mb-3">{phoneError}</p>}
                <button type="submit" className="btn-primary w-full" disabled={loading || phone.length !== 10}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Phone className="h-5 w-5" /> {t('login_send_otp')}</>}
                </button>
              </form>
            </div>
          )}

          {/* Step: OTP */}
          {step === 'otp' && (
            <div>
              <button
                onClick={() => setStep(isAdminStep ? 'admin' : 'phone')}
                className="flex items-center gap-1 text-sm font-semibold text-teal-600 dark:text-teal-400 mb-4 hover:text-teal-800 dark:hover:text-teal-200"
              >
                <ArrowLeft className="h-4 w-4" /> {t('login_back')}
              </button>
              <h2 className="font-display text-lg font-bold text-teal-900 dark:text-teal-50 mb-1">{t('login_step2')}</h2>
              <p className="text-sm text-teal-500 dark:text-teal-400 mb-3">
                +91 {pendingPhone} • {isAdminStep ? t('login_admin_otp_hint') : t('login_otp_hint')}
              </p>
              <form onSubmit={handleVerifyOtp}>
                <div className="relative mb-4">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, otpLength)); setOtpError(''); }}
                    placeholder={`${otpLength}-digit OTP`}
                    className="input-field pl-11 text-center text-2xl font-bold tracking-[0.3em]"
                    autoFocus
                  />
                </div>
                {otpError && <p className="text-sm text-error-600 dark:text-error-400 mb-3">{otpError}</p>}
                <button type="submit" className="btn-primary w-full" disabled={otp.length !== otpLength}>
                  <ShieldCheck className="h-5 w-5" /> {t('login_verify')}
                </button>
                <button
                  type="button"
                  onClick={() => { setOtp(''); setOtpError(''); }}
                  className="mt-3 w-full text-center text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200"
                >
                  {t('login_resend_otp')}
                </button>
              </form>
            </div>
          )}

          {/* Step: Verification details */}
          {step === 'verify' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-success-600 dark:text-success-400" />
                <span className="text-sm font-semibold text-success-700 dark:text-success-400">OTP verified</span>
              </div>
              <h2 className="font-display text-lg font-bold text-teal-900 dark:text-teal-50 mb-1">{t('verify_title')}</h2>
              <p className="text-sm text-teal-500 dark:text-teal-400 mb-5">{t('verify_subtitle')}</p>
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label className="label-text">{t('verify_name')}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('verify_name_placeholder')} className="input-field" autoFocus />
                </div>
                <div>
                  <label className="label-text">{t('verify_area')}</label>
                  <input type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder={t('verify_area_placeholder')} className="input-field" />
                </div>
                <div>
                  <label className="label-text">{t('verify_org_name')}</label>
                  <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder={pendingRole === 'donor' ? 'Sharma Caterers' : 'Ashray Orphanage'} className="input-field" />
                </div>
                <div>
                  <label className="label-text">{t('verify_org_type')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {orgTypes.map((ot) => (
                      <button
                        key={ot.value}
                        type="button"
                        onClick={() => setOrgType(ot.value)}
                        className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                          orgType === ot.value ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-800 dark:text-teal-50' : 'border-cream-400 text-teal-500 dark:border-teal-700 dark:text-teal-400'
                        }`}
                      >
                        {ot.label}
                      </button>
                    ))}
                  </div>
                </div>
                {pendingRole === 'ngo' && (
                  <div>
                    <label className="label-text">{t('verify_reg_number')}</label>
                    <input type="text" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} placeholder="UP/GR/2025/XXXXX" className="input-field" />
                    <p className="text-xs text-teal-400 mt-1">{t('verify_reg_hint')}</p>
                  </div>
                )}
                {verifyError && <p className="text-sm text-error-600 dark:text-error-400">{verifyError}</p>}
                <button type="submit" className="btn-primary w-full">
                  <CheckCircle2 className="h-5 w-5" /> {t('verify_submit')}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-teal-400 mt-4 px-4">{t('disclaimer')}</p>
      </div>
    </div>
  );
}
