import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, Eye, EyeOff, X, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (token: string, user: { username: string; email: string; role: string }) => void;
  logoUrl?: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
  logoUrl = '/assets/aistudio/WhatsApp_Image_2026-11-16_at_10.25.07_b5ed22ad.jpeg'
}) => {
  const { t } = useThemeLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg(
        t(
          'Veuillez renseigner votre identifiant (username ou email) et votre mot de passe.',
          'Please enter your username or email and password.'
        )
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password })
      });
      const result = (await response.json()) as {
        ok?: boolean;
        token?: string;
        user?: { username: string; email: string; role: string };
        error?: string;
      };

      if (!response.ok || !result.ok || !result.token || !result.user) {
        setErrorMsg(
          result.error ||
            t(
              'Identifiant ou mot de passe incorrect.',
              'Invalid username/email or password.'
            )
        );
        return;
      }

      setPassword('');
      onAuthenticated(result.token, result.user);
    } catch {
      setErrorMsg(
        t(
          'Impossible de contacter le serveur d’authentification.',
          'Unable to reach the authentication server.'
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-login-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md glass-panel-strong rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--glass-border)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t('Fermer', 'Close')}
              className="absolute top-4 right-4 w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <img
                src={logoUrl}
                alt="Tomy Creator"
                className="w-12 h-12 rounded-2xl object-cover border border-[var(--glass-border)]"
              />
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('ACCÈS PROPRIÉTAIRE · SANITY CMS', 'OWNER ACCESS · SANITY CMS')}</span>
                </div>
                <h2
                  id="admin-login-title"
                  className="text-xl font-bold text-[var(--text-primary)]"
                >
                  {t('Espace Administration', 'Admin Dashboard Login')}
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-identifier"
                  className="block text-xs font-semibold text-[var(--text-primary)]"
                >
                  {t('Nom d’utilisateur ou Email', 'Username or Email')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-identifier"
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="tomycreator ou tomycreator@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-[var(--text-primary)]"
                >
                  {t('Mot de passe', 'Password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword
                        ? t('Masquer le mot de passe', 'Hide password')
                        : t('Afficher le mot de passe', 'Show password')
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="p-3 rounded-2xl bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/50 text-xs text-[var(--accent-primary)] flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('Vérification en cours...', 'Verifying...')}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('Accéder au tableau de bord', 'Enter Admin Dashboard')}</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
