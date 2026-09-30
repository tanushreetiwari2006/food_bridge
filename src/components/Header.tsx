import { Sun, Moon, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useNav, type Page } from '@/context/NavContext';
import { useLang, type Language } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

const allNavItems: { labelKey: string; page: Page }[] = [
  { labelKey: 'nav_home', page: 'home' },
  { labelKey: 'nav_board', page: 'board' },
  { labelKey: 'nav_donor', page: 'donor' },
  { labelKey: 'nav_ngo', page: 'ngo' },
  { labelKey: 'nav_volunteer', page: 'volunteer' },
  { labelKey: 'nav_admin', page: 'admin' },
];

function getNavItems(role: string | undefined): { labelKey: string; page: Page }[] {
  const common = [
    { labelKey: 'nav_home', page: 'home' as Page },
    { labelKey: 'nav_board', page: 'board' as Page },
  ];
  if (!role) return [...common, ...allNavItems.filter((i) => i.page === 'donor' || i.page === 'ngo')];
  if (role === 'donor') return [...common, { labelKey: 'nav_donor', page: 'donor' as Page }, { labelKey: 'nav_volunteer', page: 'volunteer' as Page }];
  if (role === 'ngo') return [...common, { labelKey: 'nav_ngo', page: 'ngo' as Page }];
  if (role === 'volunteer') return [...common, { labelKey: 'nav_volunteer', page: 'volunteer' as Page }];
  if (role === 'admin') return [...common, { labelKey: 'nav_admin', page: 'admin' as Page }];
  return common;
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { page, navigate } = useNav();
  const { lang, setLang, t } = useLang();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = getNavItems(user?.role);

  const handleLogout = () => {
    logout();
    navigate('home');
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cream-300 bg-cream-50/95 backdrop-blur-md dark:bg-teal-950 dark:border-teal-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg"
        >
          <img src="/ChatGPT_Image_Sep_30,_2026,_09_08_03_AM.png" alt="Food Bridge" className="h-11 w-auto rounded-lg shadow-sm" />
          <div className="text-left">
            <span className="font-display text-lg font-bold text-teal-800 dark:text-teal-100">Food Bridge</span>
            <span className="hidden sm:block text-xs text-teal-500 dark:text-teal-400 -mt-0.5">{t('brand_tagline')}</span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                page === item.page
                  ? 'bg-teal-700 text-white'
                  : 'text-teal-700 hover:bg-teal-100 dark:text-teal-200 dark:hover:bg-teal-800'
              }`}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex items-center rounded-lg border border-cream-400 dark:border-teal-700 overflow-hidden">
            {(['en', 'hi'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1.5 text-xs font-bold transition-all ${
                  lang === l
                    ? 'bg-teal-700 text-white'
                    : 'text-teal-600 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-800'
                }`}
              >
                {l === 'en' ? 'EN' : 'हिं'}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-teal-700 transition-all hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-teal-200 dark:hover:bg-teal-800"
            aria-label={theme === 'light' ? t('theme_dark') : t('theme_light')}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* Login / User */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-teal-50 dark:bg-teal-800 px-3 py-1.5">
                <User className="h-4 w-4 text-teal-600 dark:text-teal-300" />
                <span className="text-sm font-semibold text-teal-800 dark:text-teal-200 max-w-[100px] truncate">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-teal-700 transition-all hover:bg-error-50 dark:text-teal-200 dark:hover:bg-error-900/20"
                aria-label={t('nav_logout')}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('login')}
              className="hidden md:flex btn-primary text-sm px-4 py-2"
            >
              <LogIn className="h-4 w-4" /> {t('login_title').split(' ')[0]}
            </button>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-teal-700 hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-teal-200 dark:hover:bg-teal-800"
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-cream-300 bg-cream-50 px-4 py-3 dark:bg-teal-950 dark:border-teal-800 animate-fade-in">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  navigate(item.page);
                  setMenuOpen(false);
                }}
                className={`rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-all ${
                  page === item.page
                    ? 'bg-teal-700 text-white'
                    : 'text-teal-700 hover:bg-teal-100 dark:text-teal-200 dark:hover:bg-teal-800'
                }`}
              >
                {t(item.labelKey)}
              </button>
            ))}
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2.5">
                  <User className="h-4 w-4 text-teal-600 dark:text-teal-300" />
                  <span className="text-sm font-semibold text-teal-800 dark:text-teal-200">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-4 py-2.5 text-left text-sm font-semibold text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20"
                >
                  <LogOut className="h-4 w-4 inline mr-1" /> {t('nav_logout')}
                </button>
              </>
            ) : (
              <button
                onClick={() => { navigate('login'); setMenuOpen(false); }}
                className="rounded-lg px-4 py-2.5 text-left text-sm font-semibold text-white bg-teal-700"
              >
                <LogIn className="h-4 w-4 inline mr-1" /> Login
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
