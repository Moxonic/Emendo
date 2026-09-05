import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../auth/AuthContext';
import { useT, tEn, type MsgKey } from '../i18n';
import { UI_LANGS } from '../i18n/config';
import Wordmark from './Wordmark';
import Flag from './Flag';

// The pitch follows the flag you pick: having just said which language you
// speak, being told what the app does in that language is the point. Error
// messages below stay English on purpose — see tEn().
const STEP_KEYS: [MsgKey, MsgKey][] = [
  ['login.step1.name', 'login.step1.body'],
  ['login.step2.name', 'login.step2.body'],
  ['login.step3.name', 'login.step3.body'],
];

export default function Login({
  lang,
  onPickLang,
}: {
  lang: string;
  onPickLang: (code: string) => void;
}) {
  const { signInWithGoogle, configured, error } = useAuth();
  const t = useT();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-slate-50 px-9 py-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <Wordmark className="text-2xl font-medium uppercase tracking-[0.32em] text-slate-800" />

        {/* Your language, pickable before signing in: it becomes the mother tongue
            your mistakes get translated into, and seeds the menu language. */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            {t('login.yourLanguage')}
          </span>
          <div className="flex items-center gap-4">
            {UI_LANGS.map((l) => {
              const active = l.code === lang;
              return (
                <button
                  key={l.code}
                  onClick={() => onPickLang(l.code)}
                  title={l.english}
                  aria-label={l.english}
                  aria-pressed={active}
                  className={`border-b-2 pb-1.5 transition ${
                    active
                      ? 'border-slate-800 opacity-100'
                      : 'border-transparent opacity-45 hover:opacity-80'
                  }`}
                >
                  <Flag code={l.code} className="h-[19px] w-[28px] ring-1 ring-slate-300" />
                </button>
              );
            })}
          </div>
        </div>

        <span className="h-px w-10 bg-slate-300" />
        <p className="max-w-xs text-sm leading-relaxed text-slate-500">{t('login.tagline')}</p>
      </div>

      <ol className="flex max-w-xs flex-col gap-4 text-left text-sm leading-relaxed text-slate-600">
        {STEP_KEYS.map(([nameKey, bodyKey], i) => (
          <li key={nameKey} className="flex gap-3">
            <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center border border-slate-300 text-[11px] font-medium text-slate-500">
              {i + 1}
            </span>
            <span>
              <span className="font-semibold text-slate-800">{t(nameKey)}</span> — {t(bodyKey)}
            </span>
          </li>
        ))}
      </ol>

      <button
        onClick={signInWithGoogle}
        disabled={!configured}
        title={t('login.googleTitle')}
        className="flex items-center gap-3 rounded-none border border-slate-300 bg-white px-6 py-3 font-medium text-slate-800 shadow-sm transition active:scale-[0.98] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FcGoogle className="h-5 w-5" />
        {t('login.google')}
      </button>

      {!configured && <p className="max-w-xs text-sm text-red-700">{tEn('login.notConfigured')}</p>}
      {error && (
        <p className="max-w-xs text-sm text-red-700">
          {tEn('login.failed', { message: error.message })}
        </p>
      )}
    </div>
  );
}
