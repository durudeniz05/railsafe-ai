
🚅 Problem

Yüksek hızlı demiryolu ağları, binlerce sayfalık teknik dökümantasyon ve karmaşık hata kodları (ETCS/ERTMS) üzerinde çalışır. Bir saha teknisyeni kritik bir arıza ile karşılaştığında:

Dökümanlar arasında vakit kaybeder (Yüksek MTTR süreleri).

Manuel analiz sırasında insan hatası riski artar.

Ray üzerindeki fiziksel engellerin anlık tespiti için ek bir dijital göze ihtiyaç duyulur. 

✨ Çözüm

RailSafe AI, "Vibe Coding" yaklaşımıyla geliştirilmiş, iki ana modüle sahip bir karar destek sistemidir:

AI Tanı Merkezi (Diagnostic): Google Gemini API kullanılarak yapılandırılan "Kıdemli Sinyalizasyon Mühendisi" asistanı. Girilen ETCS hata kodlarını uluslararası standartlara göre saniyeler içinde analiz eder. 

Güvenlik İzleme (Security): Ray hattını dijital bir gözle tarayan YOLOv5 bilgisayarlı görü simülasyonu. Nesne tespiti durumunda gerçek zamanlı "OBSTACLE DETECTED" uyarısı verir. 

📺 Canlı Demo

Yayın Linki:https://railsafeai.lovable.app/

Demo Videosu (Loom):https://www.loom.com/share/c2be811a29a24e25bf86225dd6c9213a

🛠️ Kullanılan Teknolojiler (Tech Stack)
Frontend: React, Vite, Tailwind CSS (Modern ve endüstriyel UI). 

Yapay Zeka: Google Gemini 3.1 Pro (Senior Engineer Personası). 

Geliştirme Araçları: VS Code, GitHub Copilot, Lovable. 

Strateji: Vibe Coding ve Agentic AI İş Akışı. 

🚀 Nasıl Çalıştırılır?

Projeyi yerel bilgisayarınızda çalıştırmak için:

Depoyu klonlayın: git clone [repo-linkiniz]

Ana dizine gidin: cd RailSafe-AI

Bağımlılıkları kurun: npm install

.env dosyasına Gemini API anahtarınızı ekleyin: VITE_GEMINI_API_KEY=your_key

Uygulamayı başlatın: npm run devs
