import { useEffect, useMemo, useRef, useState } from 'react'

type BoundingBox = {
  x: number // %
  y: number // %
  w: number // %
  h: number // %
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function SecurityCameraSimulator() {
  const [scanning, setScanning] = useState(true)
  const [obstacleDetected, setObstacleDetected] = useState(false)
  const [box, setBox] = useState<BoundingBox>({
    x: 40,
    y: 45,
    w: 18,
    h: 14,
  })
  const [confidence, setConfidence] = useState(0.31)

  const clearTimeoutRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  const obstacleLabel = useMemo(() => {
    // Sahnede her tetiklenmede farklı ama anlamlı kısa metin.
    if (confidence >= 0.8) return 'HIGH CONFIDENCE'
    if (confidence >= 0.6) return 'MEDIUM CONFIDENCE'
    return 'LOW CONFIDENCE'
  }, [confidence])

  useEffect(() => {
    // Security sekmesi unmount olunca interval/timeout temizlenecek.
    intervalRef.current = window.setInterval(() => {
      if (!scanning) return

      // Simülasyon: 3-6 saniyede bir tespit penceresi.
      // (Tetikleme sıklığını interval mantığıyla kontrol etmek için rastgele olasılık.)
      const trigger = Math.random() < 0.45
      if (!trigger) return

      const w = clamp(randomBetween(14, 26), 10, 30)
      const h = clamp(randomBetween(10, 20), 8, 24)
      const x = clamp(randomBetween(18, 70), 0, 100 - w)
      const y = clamp(randomBetween(30, 70), 0, 100 - h)

      const c = clamp(randomBetween(0.48, 0.95), 0.1, 0.99)

      setBox({ x, y, w, h })
      setConfidence(c)
      setObstacleDetected(true)

      if (clearTimeoutRef.current) window.clearTimeout(clearTimeoutRef.current)
      clearTimeoutRef.current = window.setTimeout(() => {
        setObstacleDetected(false)
      }, 1400)
    }, 900)

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      if (clearTimeoutRef.current)
        window.clearTimeout(clearTimeoutRef.current)
    }
  }, [scanning])

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 rounded-2xl border border-rail-700/60 bg-gradient-to-r from-rail-900 via-rail-800/40 to-rail-900" />

      {/* Demiryolu temalı çizgiler / derinlik */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl border border-rail-700/60">
        <div className="absolute -left-16 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_20%_30%,rgba(45,125,255,0.25),transparent_55%)]" />
        <div className="absolute -right-24 top-0 h-full w-2/3 bg-[radial-gradient(circle_at_70%_20%,rgba(45,125,255,0.18),transparent_50%)]" />

        {/* Sahte “ray çizgileri” */}
        <div className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 opacity-70">
          <div className="absolute left-[35%] top-0 h-full w-[2px] bg-rail-500/60" />
          <div className="absolute left-[63%] top-0 h-full w-[2px] bg-rail-500/60" />
          <div
            className="rail-ray-glow absolute left-[35%] top-0 h-full w-[2px] bg-[linear-gradient(to_bottom,rgba(45,125,255,0.0),rgba(45,125,255,0.55),rgba(45,125,255,0.0))]"
          />
          <div
            className="rail-ray-glow absolute left-[63%] top-0 h-full w-[2px] bg-[linear-gradient(to_bottom,rgba(45,125,255,0.0),rgba(45,125,255,0.55),rgba(45,125,255,0.0))]"
          />
        </div>

        {/* Tarama efekti */}
        <div className="absolute inset-0">
          <div className="rail-scan-line" />
          <div className="rail-scan-status" aria-hidden="true">
            Tarama Yapılıyor...
          </div>
        </div>

        {/* YOLOv5 simülasyonu: bounding box */}
        {obstacleDetected && (
          <>
            <div
              className="obstacle-box"
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.w}%`,
                height: `${box.h}%`,
              }}
            />
            <div
              className="obstacle-label"
              style={{
                left: `${clamp(box.x, 0, 100)}%`,
                top: `${clamp(box.y - 6, 0, 100)}%`,
              }}
            >
              OBSTACLE DETECTED
              <div className="obstacle-sub">{obstacleLabel}</div>
            </div>
          </>
        )}
      </div>

      {/* Kontrol çubuğu */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
        <div className="rounded-xl border border-rail-700/60 bg-rail-900/40 px-3 py-2 text-xs font-semibold text-rail-200">
          Kamera: Junction-03
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-rail-700/60 bg-rail-900/40 px-3 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.7)]" />
          <span className="text-xs text-rail-200">
            Dönüyor: {scanning ? '24 FPS' : '0 FPS'}
          </span>
          <span className="text-xs text-rail-300/80">
            | conf: {confidence.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Kullanıcı toggle (simülasyon) */}
      <div className="absolute top-3 right-3">
        <button
          type="button"
          onClick={() => setScanning((s) => !s)}
          className="rounded-xl border border-rail-700/60 bg-rail-900/40 px-3 py-2 text-xs font-semibold text-rail-100 hover:bg-rail-900/60"
        >
          {scanning ? 'Tarama Durdur' : 'Tarama Başlat'}
        </button>
      </div>
    </div>
  )
}

