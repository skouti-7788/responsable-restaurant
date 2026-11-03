import { useSelector } from 'react-redux'
import translations from '../../i18n/translations'
import { CONTENT_LANGUAGES } from '../../data/contentTranslations'

const TranslationFields = ({ value = {}, onChange, title }) => {
  const language = useSelector((state) => state.ui?.language || 'en')
  const t = translations?.[language] || translations.en || {}
  const update = (language, field, nextValue) => {
    onChange({
      ...value,
      [language]: {
        name: value?.[language]?.name || '',
        description: value?.[language]?.description || '',
        ...value?.[language],
        [field]: nextValue,
        dirty: true,
      },
    })
  }

  return (
    <section className="grid gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title || t.manualTranslations || 'Manual translations'}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t.leaveEmptyForAuto || 'Leave a language empty to use automatic translation.'}
        </p>
      </div>

      {CONTENT_LANGUAGES.map(({ code, label }) => (
        <div key={code} className="grid gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {label}
            </span>
            {value?.[code]?.is_manual && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                {t.manuallySaved || 'Manually saved'}
              </span>
            )}
          </div>

          <input
            type="text"
            dir={code === 'ar' ? 'rtl' : 'ltr'}
            value={value?.[code]?.name || ''}
            onChange={(event) => update(code, 'name', event.target.value)}
            placeholder={`${t.name || 'Name'} — ${label}`}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />

          <textarea
            dir={code === 'ar' ? 'rtl' : 'ltr'}
            rows={2}
            value={value?.[code]?.description || ''}
            onChange={(event) => update(code, 'description', event.target.value)}
            placeholder={`${t.description || 'Description'} — ${label}`}
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      ))}
    </section>
  )
}

export default TranslationFields
