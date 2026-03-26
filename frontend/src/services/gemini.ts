import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

export type GeminiAnalyzeInput = {
  query: string
}

export type GeminiAnalyzeResult = {
  text: string
}

const MODEL_NAME = 'gemini-1.5-pro'

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
Sen RailSafe AI’sın. Kullanıcının girdiği ETCS/ERTMS hata kodunu veya kısa teknik metni analiz et ve sahada uygulanabilir bir teşhis/aksiyon planı üret.

Gereksinimler:
- Cevap dili: Türkçe
- Çıkışı yapılandırılmış ver: 
  1) "Olası Nedenler" (madde madde)
  2) "Teşhis Adımları" (madde madde, kontrol listesi gibi)
  3) "Önerilen Çözüm / Aksiyonlar" (madde madde)
  4) "Düzenleyici / Standart Notlar" (genel referanslar: ETCS Level 2 / ERTMS spesifikasyonları; ayrıca kullanıcıya hangi doküman bölümünün aranacağını belirt)
- Eğer girdi yeterli değilse tahmin yapmanı kabul edebilirim ama en sonda "Gerekli Ek Bilgi" başlığı altında 3-5 net soru sor.
- Uydurma yapma: Dokümanların bölüm numarası gibi kesin bilgileri bilmiyorsan genelle, "Bölüm numarası için ilgili spesifikasyonda arama yap" şeklinde yönlendir.
- Güvenlik uyarısı: Yanlış teşhisin risk yaratabileceğini belirt ve her adımın standartlara ve saha prosedürlerine uygun teyit edilmesi gerektiğini vurgula.

Kullanıcının girdiği değer:
${input.query}
`.trim()

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return { text }
}

