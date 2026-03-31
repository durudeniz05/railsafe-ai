import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "query alanı gereklidir." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
${query}
`.trim();

    const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Lovable AI error:", errText);
      return new Response(JSON.stringify({ error: "AI servisinden yanıt alınamadı." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: "Beklenmeyen bir hata oluştu." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
