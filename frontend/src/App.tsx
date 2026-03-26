import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { analyzeEtcsErrorCode } from './services/gemini'

type TabKey = 'dashboard' | 'diagnostic' | 'security'

function RailPill({
  tone,
  children,
}: {
  tone: 'success' | 'warning' | 'danger' | 'info'
  children: ReactNode
}) {
  const styles = useMemo(() => {
    switch (tone) {
      case 'success':
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
      case 'warning':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-200'
      case 'danger':
        return 'bg-rose-500/15 border-rose-500/40 text-rose-200'
      case 'info':
      default:
        return 'bg-blue-500/15 border-blue-500/40 text-blue-200'
    }
  }, [tone])

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}
    >
      {children}
    </span>
  )
}

function TabButton({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean
  onClick: () => void
  label: string
  hint: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group rounded-xl border px-4 py-2 text-left transition',
        'backdrop-blur supports-[backdrop-filter]:bg-rail-800/40',
        active
          ? 'border-rail-500/70 bg-rail-700/40 text-rail-100 shadow-rail'
          : 'border-rail-700/60 bg-rail-800/20 text-rail-200 hover:bg-rail-800/35',
      ].join(' ')}
      aria-current={active ? 'page' : undefined}
    >
      <div className="text-sm font-semibold">{label}</div>
      <div className="mt-0.5 text-xs text-rail-300/80 group-hover:text-rail-200/90">
        {hint}
      </div>
    </button>
  )
}

export default function App() {
  const [tab, setTab] = useState<TabKey>('dashboard')

  // Stage 1: sadece UI iskeleti (AI entegrasyonu Aşama 2'de).
  const [errorCode, setErrorCode] = useState('ETCS 102')
  const [analysis, setAnalysis] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const tabs: Array<{
    key: TabKey
    label: string
    hint: string
  }> = [
    { key: 'dashboard', label: 'Dashboard', hint: 'Sistem sağlığı ve özet' },
    { key: 'diagnostic', label: 'Diagnostic', hint: 'Hata kodu analizi' },
    { key: 'security', label: 'Security', hint: 'Güvenlik kameraları' },
  ]

  async function onAnalyze(e: FormEvent) {
    e.preventDefault()
    const query = errorCode.trim()
    if (!query) return

    setIsAnalyzing(true)
    setAnalysisError(null)
    setAnalysis('')

    try {
      const res = await analyzeEtcsErrorCode({ query })
      setAnalysis(res.text)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu.'
      setAnalysisError(message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_circle_at_20%_0%,rgba(45,125,255,0.18),transparent_50%),radial-gradient(900px_circle_at_90%_10%,rgba(45,125,255,0.10),transparent_55%),linear-gradient(180deg,#081024, #081024_40%, #0b1734)] px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl border border-rail-700/60 bg-rail-800/40 shadow-rail" />
              <div>
                <h1 className="text-lg font-semibold text-rail-100 sm:text-xl">
                  RailSafe AI
                </h1>
                <p className="text-xs text-rail-300/80">
                  ETCS/ERTMS için güvenlik odaklı teşhis asistanı
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <RailPill tone="success">Sistem: OK</RailPill>
            <RailPill tone="info">MTTR: -X% (hedef)</RailPill>
            <RailPill tone="warning">Aktif Alarm: 2</RailPill>
          </div>
        </header>

        <nav className="grid gap-3 sm:grid-cols-3">
          {tabs.map((t) => (
            <TabButton
              key={t.key}
              active={tab === t.key}
              onClick={() => setTab(t.key)}
              label={t.label}
              hint={t.hint}
            />
          ))}
        </nav>

        <main className="mt-6">
          {tab === 'dashboard' && (
            <section className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-rail-700/60 bg-rail-800/20 p-5 shadow-sm lg:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-rail-100">
                      System Status
                    </h2>
                    <p className="mt-1 text-sm text-rail-300/85">
                      Platform izleme ve tanı akışı için genel durum.
                    </p>
                  </div>
                  <RailPill tone="success">Veri Akışı: Online</RailPill>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-rail-700/60 bg-rail-900/40 p-4">
                    <div className="text-xs text-rail-300/80">
                      Active Alarms
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-rail-100">
                      2
                    </div>
                    <div className="mt-1 text-xs text-rail-300/80">
                      (ETCS/ERTMS)
                    </div>
                  </div>
                  <div className="rounded-xl border border-rail-700/60 bg-rail-900/40 p-4">
                    <div className="text-xs text-rail-300/80">
                      Last Diagnosis
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-rail-100">
                      14m
                    </div>
                    <div className="mt-1 text-xs text-rail-300/80">ago</div>
                  </div>
                  <div className="rounded-xl border border-rail-700/60 bg-rail-900/40 p-4">
                    <div className="text-xs text-rail-300/80">
                      Confidence
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-rail-100">
                      0.82
                    </div>
                    <div className="mt-1 text-xs text-rail-300/80">avg</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-rail-700/60 bg-rail-800/20 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-rail-100">
                  Active Alarms
                </h3>
                <ul className="mt-3 space-y-3">
                  <li className="rounded-xl border border-rail-700/60 bg-rail-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-rail-100">
                        ETCS 102
                      </div>
                      <RailPill tone="warning">High</RailPill>
                    </div>
                    <div className="mt-1 text-xs text-rail-300/85">
                      Sinyalizasyon anomalisi (simülasyon)
                    </div>
                  </li>
                  <li className="rounded-xl border border-rail-700/60 bg-rail-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-rail-100">
                        ETCS 210
                      </div>
                      <RailPill tone="info">Medium</RailPill>
                    </div>
                    <div className="mt-1 text-xs text-rail-300/85">
                      Hat devresi tutarsızlığı (simülasyon)
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-rail-700/60 bg-rail-800/20 p-5 shadow-sm lg:col-span-1">
                <h3 className="text-base font-semibold text-rail-100">
                  Recent Diagnostics
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-rail-700/60 bg-rail-900/40 px-4 py-3">
                    <div className="text-sm font-semibold text-rail-100">
                      ETCS 045
                    </div>
                    <div className="text-xs text-rail-300/85">6m ago</div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-rail-700/60 bg-rail-900/40 px-4 py-3">
                    <div className="text-sm font-semibold text-rail-100">
                      ERTMS 77
                    </div>
                    <div className="text-xs text-rail-300/85">23m ago</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tab === 'diagnostic' && (
            <section className="grid gap-4 lg:grid-cols-5">
              <div className="rounded-2xl border border-rail-700/60 bg-rail-800/20 p-5 shadow-sm lg:col-span-2">
                <h2 className="text-base font-semibold text-rail-100">
                  AI Tanı Merkezi
                </h2>
                <p className="mt-1 text-sm text-rail-300/85">
                  Hata kodu veya teknik metin girin. (Aşama 2: Gemini entegrasyonu)
                </p>

                <form className="mt-4 space-y-3" onSubmit={onAnalyze}>
                  <label className="block">
                    <div className="text-xs font-medium text-rail-200">
                      Hata Kodu / Metin
                    </div>
                    <input
                      value={errorCode}
                      onChange={(e) => setErrorCode(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-rail-700/60 bg-rail-900/40 px-3 py-2 text-sm text-rail-100 placeholder:text-rail-400/70 outline-none focus:ring-2 focus:ring-rail-500/50"
                      placeholder="örn: ETCS 102, Lost Balise..."
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rail-500 px-4 py-2 text-sm font-semibold text-white shadow-rail hover:bg-rail-400/90"
                    disabled={isAnalyzing}
                    aria-busy={isAnalyzing}
                  >
                    {isAnalyzing ? 'Analiz ediliyor...' : 'Analiz Et'}
                  </button>

                  <div className="rounded-xl border border-rail-700/60 bg-rail-900/30 p-3">
                    <div className="text-xs font-medium text-rail-200">
                      İpucu
                    </div>
                    <div className="mt-1 text-xs text-rail-300/85">
                      ETCS/ERTMS hata kodlarını doğrudan yazabilir veya teknik
                      açıklamayı yapıştırabilirsiniz.
                    </div>
                  </div>
                </form>
              </div>

              <div className="rounded-2xl border border-rail-700/60 bg-rail-800/20 p-5 shadow-sm lg:col-span-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-rail-100">
                      Önerilen Çözüm Taslağı
                    </h3>
                    <p className="mt-1 text-sm text-rail-300/85">
                      İlk sürümde placeholder çıktı; Aşama 2’de doküman tabanı
                      ile doldurulacak.
                    </p>
                  </div>
                  <RailPill tone="info">Stage 1</RailPill>
                </div>

                <div className="mt-4 rounded-2xl border border-rail-700/60 bg-rail-900/40 p-4">
                  {analysisError ? (
                    <div className="text-sm leading-relaxed text-rose-200">
                      {analysisError}
                    </div>
                  ) : analysis ? (
                    <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-rail-100">
                      {analysis}
                    </pre>
                  ) : (
                    <div className="text-sm text-rail-300/85">
                      “Analiz Et” butonuna tıklayarak Gemini’den çözüm önerisi
                      alabilirsiniz.
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {tab === 'security' && (
            <section className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-rail-700/60 bg-rail-800/20 p-5 shadow-sm lg:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-rail-100">
                      Canlı Görüntü Paneli
                    </h2>
                    <p className="mt-1 text-sm text-rail-300/85">
                      Ray üzerindeki nesne tespiti simülasyonu (Aşama 3: görüntü işleme).
                    </p>
                  </div>
                  <RailPill tone="success">Simülasyon</RailPill>
                </div>

                <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-rail-700/60 bg-gradient-to-r from-rail-900 via-rail-800/40 to-rail-900 p-0">
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="rounded-2xl border border-rail-700/60 bg-rail-900/40 px-4 py-2 text-xs font-semibold text-rail-200">
                      Kamera: Junction-03
                    </div>
                    <div className="text-sm text-rail-300/85">
                      (placeholder) Görüntü işleme motoru henüz bağlı değil.
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.7)]" />
                      <span className="text-xs text-rail-200">Dönüyor: 24 FPS</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-rail-700/60 bg-rail-800/20 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-rail-100">
                  Tespit Özeti
                </h3>
                <p className="mt-1 text-sm text-rail-300/85">
                  Nesne tespiti için yer tutucu metrikler.
                </p>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-rail-700/60 bg-rail-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-rail-100">
                        İnsan / Person
                      </div>
                      <RailPill tone="info">0.12</RailPill>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-rail-700/50">
                      <div className="h-full w-[18%] bg-blue-500/80" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-rail-700/60 bg-rail-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-rail-100">
                        Yabancı Nesne
                      </div>
                      <RailPill tone="warning">0.31</RailPill>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-rail-700/50">
                      <div className="h-full w-[42%] bg-amber-400/80" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        <footer className="mt-8 text-xs text-rail-300/80">
          Stage 1 iskelet: UI sekmeleri + Tailwind teması.
        </footer>
      </div>
    </div>
  )
}
