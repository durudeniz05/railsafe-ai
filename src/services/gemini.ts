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
Resmi, kurumsal ve şablonlu bir teknik analiz raporu üret. Üçüncü tekil şahıs dili kullan (örnek: "Saptanmıştır", "Gerekmektedir"). Selamlaşma ifadeleri veya hitapla başlamadan doğrudan teknik analiz yürüt.

Gereksinimler:
- Cevap dili: Türkçe
- Üslup: "Sektörel Teknik Analiz Raporu" ciddiyetinde.
- Depolanan veri ve varsayımlara göre kesin olmayan noktalar için "ilgili standarda doğrulama gerekmektedir" ifadesi kullan.
- Çıkışı yapılandırılmış veri olarak sadece aşağıdaki başlıkları doldur:
  ## Olası Neden
  ## Güvenlik Protokolü
  ## Çözüm Adımları
- Her bölümde UNISIG/Subset-026 ve ETCS/ERTMS teknik dokümantasyon referansları açıkça gösterilmeli (örnek: "Subset-026" veya "UNISIG").
- Girdi yetersizse ek bir başlık olarak "Gerekli Ek Bilgi" ekle; 3-5 hedef soru belirt.
- Mesajda "Sayın meslektaşım", "Merhaba", "İyi çalışmalar" gibi hitaplar kullanılmayacak.

Kullanıcının girdiği değer:
${input.query}
`.trim()

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return { text }
}

