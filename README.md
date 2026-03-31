🚅 PROBLEM
Yüksek hızlı demiryolu ağları, binlerce sayfalık teknik dökümantasyon ve karmaşık hata kodları (ETCS/ERTMS) üzerinde çalışır. Bir saha teknisyeni kritik bir arıza ile karşılaştığında dökümanlar arasında vakit kaybeder ve manuel analiz sırasında insan hatası riski artar. Bu durum operasyonel güvenliği ve sefer dakikliğini tehdit eder.

✨ ÇÖZÜM
RailSafe AI, "Vibe Coding" yaklaşımıyla geliştirilmiş iki ana modüle sahiptir:

AI Teşhis Merkezi (Diagnostic): Edge Function ve Lovable AI Gateway kullanılarak yapılandırılan "Kıdemli Mühendis" asistanı. Hata kodlarını UNISIG Subset-026 standartlarına göre saniyeler içinde analiz eder. 

Güvenlik İzleme (Security): Ray hattını dijital bir gözle tarayan YOLOv5 bilgisayarlı görü simülasyonu. Nesne tespiti durumunda gerçek zamanlı "OBSTACLE DETECTED" uyarısı verir. 

🛠️ KULLANILAN TEKNOLOJİLER
Stack: React, Vite, Tailwind CSS v4. 

AI Altyapısı: Google Gemini 3.1 Pro (Edge Function & Lovable AI Gateway ile güvenli entegrasyon). 

Dosya Yapısı: Briefing uyumlu features/ tabanlı kaynak kod mimarisi. 

📺 Canlı Demo

Yayın Linki:https://railsafeai.lovable.app/

Demo Videosu (Loom):https://www.loom.com/share/c2be811a29a24e25bf86225dd6c9213a

🚀 NASIL ÇALIŞTIRILIR?
Proje artık Lovable AI Gateway kullandığı için yerel kurulumda harici bir API anahtarı kurulumuna gerek duymaz.

Depoyu klonlayın: git clone

Ana dizine gidin: cd RailSafe-AI

Bağımlılıkları kurun: npm install

Uygulamayı başlatın: npm run dev