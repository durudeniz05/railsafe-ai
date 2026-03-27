import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

export type GeminiAnalyzeInput = {
  query: string
}

export type GeminiAnalyzeResult = {
  text: string
}

const MODEL_NAME = 'gemini-2.5-flash'

function requireApiKey(): string {
  if (!apiKey) {
    throw new Error(
      'Gemini API anahtarı bulunamadı. Lütfen proje kökünde `.env` içine `VITE_GEMINI_API_KEY=...` ekleyin.'
    )
  }
  return apiKey
}

export async function analyzeEtcsErrorCode(
  input: GeminiAnalyzeInput
): Promise<GeminiAnalyzeResult> {
  const key = requireApiKey()

  const genAI = new GoogleGenerativeAI(key)
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const prompt = `
Sen bir 20 yıllık deneyimli Senior Railway Signaling & Safety Engineer'sın. Kullanıcının girdiği ETCS/ERTMS hata kodunu veya kısa teknik metni analiz et ve sahada uygulanabilir bir teşhis/aksiyon planı üret.

Gereksinimler:
- Cevap dili: Türkçe
- Çıkışı yapılandırılmış ver: 
  ## Olası Neden
  (madde madde, uluslararası demiryolu standartlarına dayalı)

  ## Güvenlik Protokolü
  (güvenlik önlemleri ve protokoller, sektör standartlarına uygun)

  ## Çözüm Adımları
  (madde madde, adım adım çözüm rehberi)

  ## Düzenleyici / Standart Notlar
  (UNISIG, ETCS Subset-026, ERTMS gibi uluslararası standartlara referans; kullanıcıya hangi doküman bölümünün aranacağını belirt)
- Eğer girdi yeterli değilse tahmin yapmanı kabul edebilirim ama en sonda "Gerekli Ek Bilgi" başlığı altında 3-5 net soru sor.
- Uydurma yapma: Dokümanların bölüm numarası gibi kesin bilgileri bilmiyorsan genelle, "Bölüm numarası için ilgili spesifikasyonda arama yap" şeklinde yönlendir.
- Güvenlik uyarısı: Yanlış teşhisin risk yaratabileceğini belirt ve her adımın uluslararası demiryolu standartlarına ve saha prosedürlerine uygun teyit edilmesi gerektiğini vurgula. Hiçbir marka ismi anmadan sektör standartları üzerinden devam et.

Kullanıcının girdiği değer:
${input.query}
`.trim()

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return { text }
}

