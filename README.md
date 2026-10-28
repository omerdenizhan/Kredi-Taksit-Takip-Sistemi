<h1 align="center">⭐ Kredi & Taksit Takip Sistemi ⭐</h1>

**Kredi, kart taksidi ve kişisel borçlarınızı tek ekrandan yönetin, analiz edin ve ödeme gününü kaçırmayın.**

![Node](https://img.shields.io/badge/Node.js-%E2%89%A5%2022.19-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)
![SQLite](https://img.shields.io/badge/SQLite-node%3Asqlite-003B57?logo=sqlite&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-grafikler-FF6384?logo=chartdotjs&logoColor=white)
![Sürüm](https://img.shields.io/badge/s%C3%BCr%C3%BCm-1.0.8-6366f1)
![Lisans](https://img.shields.io/badge/lisans-Unlicense-blue)

## 🔎 Genel Bakış

Bu proje, bireysel kredi ve taksitli borçları takip etmek için geliştirilmiş **tek sayfalık (`index.html`) bir web uygulamasıdır**. Derleme adımı, framework veya veritabanı sunucusu gerektirmez.

İki şekilde çalıştırılabilir:

| | Sunucu Modu | Yerel Mod |
|---|---|---|
| **Gereksinim** | Node.js ≥ 22.19 | Yalnızca bir tarayıcı |
| **Nasıl açılır** | `npm start` → `http://localhost:3000` | `index.html` dosyasına çift tıklayın |
| **Veri nerede** | `database.db` (SQLite) | Tarayıcı Local Storage |
| **Uygun senaryo** | Kalıcı, tarayıcıdan bağımsız kullanım | Hızlı deneme, kurulumsuz kullanım |

Mod, uygulama açılırken **otomatik** belirlenir; üst çubuktaki ve giriş ekranındaki rozet `Sunucu: Node Aktif` veya `Sunucu: Lokal Depolama` olarak gösterir.

## ✨ Özellikler

### 📊 Ana Ekran (Dashboard)
- **Özet kartları:** Toplam Borç, Aylık Ödeme, Kalan Anapara, Bugün Kapatılırsa, Ödenen, Kalan Toplam Borç.
- **Borç Tipi Dağılımı** grafiği (Chart.js). Açıklamadaki bir tipe tıklayınca o tipe ait **teknik grafik penceresi** açılır; tek bir kayıt için de ayrı grafik görüntülenebilir.
- **Aktif Kredi & Taksit Listesi:** tablo (liste) veya kompakt kart görünümü; görünüm, listenin başlığındaki seçim kutusundan değiştirilir, kart görünümünde satır başına 2 / 3 / 4 / 5 / 6 kart seçilebilir. Satırlar ve kartlar borç tipinin simgesini ve rengini gösterir.
- **PDF İndir:** liste (mevcut sıralama ve görünüme göre) veya tek bir kayıt (ödeme planı + teknik grafikler) metin tabanlı **PDF** olarak indirilir ([jsPDF](https://github.com/parallax/jsPDF)). Liste PDF'i yatay A4'tür; üstte ana sayfadakiyle **aynı sıralamada 3×2 özet kutuları** (Toplam Borç, Ödenen, Kalan Toplam Borç / Kalan Anapara, Aylık Ödeme, Bugün Kapatılırsa) ve sağda **Borç Tipi Dağılımı** dairesel grafik kutusu bulunur; kayıt PDF'i dikey A4'tür.
- **Menü:** logoya tıklayınca açılan **MENÜ** listesinden *Yeni Kayıt* ve *Ayarlar* açılır.
- **Borç tipi çipleri** ile listeyi tek tıkla filtreleme.
- **Borç Tipleri** kartında canlı **tarih/saat** ve (izin verilirse) konum ile **hava durumu**.
- Üst çubukta **bildirim merkezi**, sunucu/depolama rozeti (tıklayınca veritabanı özellikleri paneli), koyu/açık tema anahtarı ve çıkış düğmesi.
- **Mobil uyumlu:** dikey ve yatay ekranlar için ayrı yerleşimler (kaydırmalı pencereler, ızgara düzenleri).
- Rakamları tek tuşla **gizle / göster** (ekran paylaşımı için).

### 🧮 Kredi Yönetimi
- **Borç tipine göre uyarlanan kayıt formu:** formun en üstünde *Borç Tipi* seçilir; etiketler, varsayılan KKDF/BSMV ve gösterilen alanlar tipe göre değişir. Zorunlu/geçersiz alan varsa kayıt engellenir ve uyarı verilir. Düzenlerken borç tipi değiştirilemez; ekran başlığı yeni kayıtta *Yeni Borç Ekle*, düzenlemede *"<borç adı>" Bilgilerini Düzenle* olur.
- Net tutar, ek masraf, aylık faiz, **BSMV** ve **KKDF** ile **brüt faiz oranı, aylık taksit ve toplam geri ödeme** canlı önizleme.
- Banka/kurum, ödeme günü, başlangıç tarihi, ödenen taksit sayısı ve not alanları.
- **Detaylı ödeme planı:** taksit no, vade tarihi, taksit, faiz, anapara, kalan anapara; güncel ay işaretli ve otomatik kaydırılır.
- **Taksit ödendi / geri al** tek tıkla.
- **Kısmi ödeme:** henüz ödenmemiş bir taksite taksitten düşük bir tutar girilebilir; aradaki **fark bir sonraki ayın taksitine devredilir** (tabloda *devreden* etiketiyle görünür), plan yeniden hesaplanır. *Ödendi* onay penceresi farkın nereye aktarılacağını ve yeni taksit tutarını açıklar.
- **Erken kapama analizi:** sözleşme anaparası + (varsa) kısmi ödemeden devreden fark + işleyen faiz; erken kapama indirimi yalnızca işleyen faize uygulanır. Tasarruf finansmanında (faizsiz) kalan taksit toplamı gösterilir.
- Kayıt ayrıntıları penceresi (Ödeme Planı, Düzenle, Sil, Grafik Göster, Kapat), düzenleme ve silme (onaylı). Ödeme planı, düzenleme ve grafik pencereleri ayrıntı penceresinin üstünde açılır; kapatınca ayrıntıya dönülür.
- Ödeme planı tabloları, ayrıntı penceresi ve PDF çıktısı **borç tipine ve girilen verilere göre** düzenlenir.
- **Teknik grafikler:** borç tipi dağılımı açıklamasından tip bazlı (taksit sayısı, taksit miktarı, aylık ödeme, yapılan ödeme) ve kayıt bazlı grafikler açılır.

### 🏷️ Borç Tipleri
Borç tipleri **kodla tanımlı ve sabittir**: ad değiştirilemez, tip silinemez veya yeni tip eklenemez. Yalnızca **sıra, renk ve simge** düzenlenebilir.

| Tip | Varsayılan KKDF / BSMV | Forma özel alanlar |
|---|---|---|
| İhtiyaç Kredisi | %15 / %15 | BDDK vade/tutar sınırı kontrolü (engelleyici) |
| Konut Kredisi | %0 / %15 | Konut/ekspertiz değeri, ilk konut (BSMV istisnası) |
| Taşıt Kredisi | %15 / %15 | Araç türü (içten yanmalı / elektrikli), fatura değeri, BDDK vade ve kredi oranı kontrolü |
| KOBİ Kredisi | %0 / %5 | Destek/teminat programı (KGF, KOSGEB, diğer), kredi amacı |
| Tasarruf Finansmanı | faiz, KKDF, BSMV yok | [Tasarruf Finansmanı](#-tasarruf-finansmanı) bölümüne bakın |
| Diğer | %0 / %0 | Faizsiz borçlarda toplam geri ödemeyi elle girme |

- Sürükle-bırak (veya yukarı/aşağı düğmeleriyle) **sıralama**; sıra tüm ekranlara yansır.
- **Otomatik simge kütüphanesi:** Font Awesome *Classic / Solid* simgeleri CSS'ten ayrıştırılıp veritabanına kaydedilir, sonraki açılışlarda yeniden indirilmez. Arama İngilizce simge adıyla yapılır (`house`, `car`, `bank`…).
- Eski sürümlerde/yedeklerde bulunan özel tipler açılışta `Diğer` tipine aktarılır; eski tip adı kaybolmasın diye kaydın notuna `[Eski borç tipi: …]` olarak eklenir.

### 🐖 Tasarruf Finansmanı
Faizsiz (katılım ilkeli) tasarruf finansmanı kayıtları için ayrı bir hesaplayıcı mantığı vardır:

- **Girdiler:** varlık tipi (Konut / Araba), finansman modeli (Çekilişsiz / Çekilişli), finansman tutarı, peşinat, taksit (ay), aylık ödeme, isteğe bağlı **artışlı ödeme planı** (artış oranı ve periyodu), **hizmet bedeli** (% veya ₺; peşin ya da ilk 4 taksite bölünmüş).
- **Aylık ödeme:** `(Finansman Tutarı − Peşinat) ÷ Taksit`; artışlı planda ilk dönem tutarı, toplamı finanse edilen tutara eşitleyecek şekilde bulunur. İstenirse elle değiştirilebilir.
- **Tahmini teslimat (çekilişsiz):** sözleşme tutarının en az **%45**'i (peşinat + taksitler) birikmiş olmalı ve asgari taksit süresi dolmalıdır (süre peşinat oranında kısalır, en az 6 taksit). Çekilişli modelde teslimat çekiliş sonucuna bağlı gösterilir.
- Sonuçlar, form doğrulaması geçtikten sonra hesaplama önizlemesinde görünür; ödeme planı tablosu ve PDF çıktısı bu veriye göre düzenlenir.

> ⚠️ Bu hesaplar **tahmindir**; sözleşmenizdeki şartlar ve şirket uygulamaları farklı olabilir.

### 🔔 Bildirimler
- Zil simgeli **bildirim merkezi**; ödeme günü ve bitişe yakın kredileri önem sırasına göre listeler.
- Listede ve kartlarda renkli uyarı etiketleri; bitişe yakın kayıtlar yanıp söner. ([Ayrıntılar](#-uyarı-ve-bildirim-sistemi))

### 🎨 Kişiselleştirme
- **Neumorphism UI teması (Themesberg Neumorphism UI v1.0.0)** — kabartma/çukur gölgeli arayüz; **koyu / açık mod** (anahtar animasyonlu, anında geçiş), tercih hatırlanır.
- **Giriş ekranı:** sol tarafta *"Önümüzdeki 12 ayda ne ödeyeceğinizi bugünden görün."* tanıtım alanı ve animasyonlu çubuklar; çubuklar açık modda **renkli**, koyu modda vurgu renginde görünür.
- **14 vurgu rengi** (İndigo, Turuncu, Zümrüt, Pembe, Gökyüzü, Kehribar, Mor, Petrol, Kırmızı, Limon Yeşili, Mavi, Eflatun, Camgöbeği, Gül Kırmızısı).
- **Arka plan baloncukları:** adet, boyut aralığı, hız, sürüklenme, opaklık, bulanıklık, parlama, karmaşıklık, çeşitlilik ve 6 renk; giriş ekranı ve panel için ayrı ayrı açılıp kapatılır.
- Cam efekti ve animasyonları kapatma seçenekleri.
- İsteğe bağlı **ödeme kutlaması:** *Taksit Ödeme Onayı*nda **"Evet, Onayla"** denince havai fişek (varsayılan kapalı; Görsellik Ayarları → Arayüz Efektleri'nden açılır, süre ve hız ayarlı).
- Para birimi: **TRY ₺ / USD $ / EUR €**.

### 👤 Hesap ve Güvenlik
- Giriş ekranı, çıkış, **güvenlik sorusuyla parola sıfırlama**.
- Profil: ad soyad, kullanıcı adı, e-posta, parola, güvenlik sorusu/cevabı (**Ayarlar → Hesap ve Güvenlik**).
- Sayfa yenilenirken giriş penceresi görünmeden *"Sayfa yenileniyor..."* ekranı gösterilir.
- Sağ tık menüsü kapalıdır; sağ tıklamada uyarı penceresi açılır.
- Veriler tarayıcıda **AES-256-GCM** ile şifrelenerek saklanır.

## 🚀 Hızlı Başlangıç

### Seçenek A — Sunucu Modu (önerilen)

**1. Gereksinim:** [Node.js](https://nodejs.org/) **22.19 veya üzeri**. SQLite desteği Node'un yerleşik `node:sqlite` modülünden gelir; ek veritabanı paketi kurulmaz. Node bu modül için "experimental" uyarısı yazdırabilir, bu normaldir.

```bash
node --version      # v22.19.0 veya üzeri olmalı
```

**2. Bağımlılıkları kurun:**

```bash
npm install
```

**3. Başlatın:**

```bash
npm start
```

**4. Tarayıcıda açın:** <http://localhost:3000>

Farklı port için:

```bash
# Linux / macOS
PORT=8080 npm start

# Windows PowerShell
$env:PORT=8080; npm start

# Windows CMD
set PORT=8080 && npm start
```

### Seçenek B — Yerel Mod (Node gerekmez)

`index.html` dosyasını tarayıcıda açmanız yeterlidir. Simgeler, grafikler ve yazı tipi CDN'den yüklendiği için **internet bağlantısı gerekir**.

### 🔑 İlk Giriş

İlk çalıştırmada varsayılan hesap oluşturulur:

| Alan | Değer |
|---|---|
| E-posta | `admin@admin.local` |
| Parola | `admin123` |
| Güvenlik sorusu | İlk okulunuzun adı nedir? → `Okul` |

> ⚠️ Girişten hemen sonra **Ayarlar → Hesap ve Güvenlik** bölümünden e-posta, parola ve güvenlik sorusunu değiştirin.

## 💾 Çalışma Modları ve Depolama

```
┌────────────────────────────── Tarayıcı ──────────────────────────────┐
│  appState (JSON)  ──►  AES-256-GCM şifrele  ──►  { salt, iv, data }  │
└───────────────┬───────────────────────────────────────┬──────────────┘
                │ Sunucu Modu                           │ Yerel Mod
                ▼                                       ▼
   POST /api/save  →  database.db (SQLite)       Local Storage anahtarı:
   tablo: app_data (tek satır, id = 1)           finans_takip_encrypted_data
```

### Açılışta veri yükleme sırası

1. `GET /api/database` denenir → başarılıysa veri **sunucudan** alınır (`database.db`), kopyası Local Storage'a da yazılır.
2. Sunucu yoksa/boşsa Local Storage'daki şifreli paket okunur.
3. İkisi de yoksa varsayılan veri yapısı oluşturulur.

Her değişiklikte veri otomatik olarak yeniden şifrelenip kaydedilir (**otomatik kayıt**; ayrı bir "Kaydet" düğmesi yoktur).

### Modlar arası notlar

- Local Storage verisi **tarayıcıya ve adrese özeldir**; `file://…/index.html` ile `http://localhost:3000` birbirinin verisini görmez, farklı tarayıcılar da görmez.
- Sunucu modunda veritabanı boşsa ve aynı tarayıcıda yerel veri varsa, ilk kayıtta bu veri `database.db` dosyasına yazılır.
- Modlar/cihazlar arası taşıma için **Veritabanı Yedekle → Yükle** kullanın.
- **Eski `database.json` göçü:** `database.db` yoksa/boşsa ve klasörde `database.json` bulunuyorsa sunucu, şifreli veriyi ilk başlatmada **otomatik** `database.db`'ye aktarır. `database.json` silinmez.

## 🧭 Kullanım Kılavuzu

### 1. Yeni kredi / taksit ekleme

1. Ana ekrandaki **"Yeni Kayıt"** düğmesine tıklayın.
2. Alanları doldurun:

| Alan | Açıklama |
|---|---|
| Kayıt / Borç Adı | Örn. `180 Bin İhtiyaç Kredisi` |
| Borç Tipi | 6 sabit tipten birini seçin; form alanları tipe göre değişir (bkz. [Borç Tipleri](#️-borç-tipleri)) |
| Banka / Kurum | İsteğe bağlı |
| Çekilen Net Tutar | Hesabınıza geçen tutar |
| Ek Masraf / Dosya M. | Tahsis, dosya masrafı vb. (anaparaya eklenir) |
| Aylık Faiz Oranı (%) | Örn. `3.89` |
| BSMV (%) / KKDF-Stopaj (%) | Varsayılan 15 / 15 (Tercihlerden değiştirilebilir) |
| Taksit Sayısı | 1–120 (tipe göre BDDK sınırı kontrol edilir) |
| Toplam Geri Ödeme | Hesaplanır, **elle düzeltilebilir** (banka kesin tutarına göre) |
| Erken Kapama İndirimi (%) | Bankanızın uyguladığı indirim varsa |
| Ödenen Taksit | Mevcut krediyi sonradan giriyorsanız |
| Başlangıç Tarihi / Ödeme Günü | Vade takvimi bunlardan üretilir |
| Notlar | Hesap no vb. |

3. Form altındaki **canlı önizleme** brüt faizi, aylık taksiti ve toplam geri ödemeyi gösterir.

> 💡 Para alanlarında **nokta tuşu virgüle çevrilir**, binlik ayracı otomatik eklenir; `180.000,00` biçiminde yazabilir veya yapıştırabilirsiniz.

### 2. Ödeme planı ve taksit takibi

- Kayıt satırındaki **ödeme planı** düğmesi taksit tablosunu açar.
- Bir taksit satırına tıklayarak **ödendi** işaretleyebilir, tekrar tıklayarak **geri alabilirsiniz**.
- Bu ayın taksiti vurgulanır; pencere açıldığında otomatik oraya kaydırılır.
- **Kısmi ödeme:** ödenmemiş taksit için taksitten **düşük** bir tutar girin. Tutar taksite eşit/büyükse uygulama "Ödendi" kutusunu işaretlemenizi ister. Taksitten eksik kalan tutar **bir sonraki taksite eklenir** (devreden tutar); kalan anapara ve sonraki faizler yeniden hesaplanır, son taksit kalan bakiyeyi kapatacak şekilde ayarlanır. Son taksitte eksik kalan tutar ödenmemiş bakiye olarak borçta kalır. Taksidi *Ödendi* olarak işaretlerken açılan onay penceresi bu aktarımı ve yeni taksit tutarını gösterir.

### 3. Erken kapama

Kayıt ayrıntılarında ve ana ekrandaki **"Bugün Kapatılırsa"** kartında, kredinin bugün kapatılması hâlinde ödenecek tahmini tutar gösterilir (bkz. [hesaplama mantığı](#-finansal-hesaplama-mantığı)).

### 4. Borç tipi yönetimi

**Ayarlar → Tercihler ve Tanımlamalar → Genel:** tiplerin sıralanması, rengi ve simgesi (*Borç Tipini Düzenle* penceresi; ad salt okunurdur). Toplam ve kullanımdaki tip sayıları üstte gösterilir.

### 5. Gizlilik modu

Üst çubuktaki göz simgesi tüm tutarları maskeler. Tercih tarayıcıda hatırlanır.

## 🧮 Finansal Hesaplama Mantığı

Tüm formüller `index.html` içindeki `calculateLoanDetails` (form önizlemesi), `getLoanAmortParams` / `solveGrossMonthlyRate` (amortisman parametreleri), `computeContractSchedule` (sözleşme planı), `computePaymentSchedule` (gerçek plan) ve `calculateEarlyClosureDetails` fonksiyonlarındadır.

### Brüt faiz oranı (form önizlemesi)

```
brüt_oran = (aylık_faiz / 100) × (1 + BSMV/100 + KKDF/100)
```

Örnek: %3,89 faiz, %15 BSMV, %15 KKDF → `0,0389 × 1,30 = %5,057`

> Kayıt kaydedildikten sonra ödeme planında kullanılan brüt oran, girilen faizden değil **bankanın gerçek taksitinden** (`toplam ÷ taksit sayısı`) ve anaparadan geriye doğru çözülür (`solveGrossMonthlyRate`). Böylece bankanın yuvarlaması veya elle düzeltilen toplam tutar plana yansır.

### Aylık taksit (eşit taksitli annüite)

```
anapara = net_tutar + ek_masraf
taksit  = anapara × [ r × (1+r)^n ] / [ (1+r)^n − 1 ]      (r = brüt_oran, n = taksit sayısı)
toplam  = taksit × n
```

### Ödeme planı satırı

Her taksit için: `faiz = kalan_anapara × r` → `anapara_payı = taksit − faiz` → `kalan = kalan − anapara_payı`. Kısmi ödeme varsa: `taksit = sabit_taksit + devreden`, `devreden_sonraki = taksit − kısmi_ödeme`.
Faiz oranı girilmemiş ama anapara girilmişse, faiz toplam farkından **düz (doğrusal)** dağıtılır; anapara hiç girilmemişse toplam tutar eşit bölünür.

### Erken kapama

```
kalan_anapara = sözleşme planına göre, ödenen taksit sayısı kadar amortisman uygulanmış bakiye
devreden_fark = gerçek plan bakiyesi − kalan_anapara          (kısmi ödemeden kalan eksik, yoksa 0)
işleyen_faiz  = kalan_anapara × (r / 30) × son_ödenen_vadeden_bugüne_geçen_gün
kapama        = kalan_anapara + devreden_fark + işleyen_faiz × (1 − erken_kapama_indirimi/100)
```

Faiz sayılmaya başlanan tarih, son ödenen taksitin vade tarihidir (hiç ödenmediyse ilk vadeden 1 ay öncesi). Anapara bilgisi yoksa: `kalan = toplam − (toplam/n × ödenen)` basit yöntemi kullanılır. Tasarruf finansmanında kapama tutarı `toplam − ödenen`dir.

### Ana ekran kartları

| Kart | Hesap |
|---|---|
| Toplam Borç | Tüm kayıtların toplam geri ödemesi |
| Aylık Ödeme | Bitmemiş kredilerin taksit toplamı |
| Kalan Anapara | Bitmemiş kredilerin sözleşmeye göre kalan anaparası |
| Bugün Kapatılırsa | Bitmemiş kredilerin güncel kapama tutarı toplamı (anapara + devreden fark + işleyen faiz) |
| Ödenen | Ödenen taksitler + kısmi ödemeler |
| Kalan Toplam Borç | Toplam Borç − Ödenen |

> ⚠️ Sonuçlar **tahmindir**. Bankaların gün sayımı, faiz yuvarlaması, sigorta ve masraf kalemleri farklı olabilir; bağlayıcı rakam için banka dökümünüzü esas alın. Bu yazılım finansal tavsiye değildir.

## 🚦 Uyarı ve Bildirim Sistemi

Uyarılar **Ayarlar → Tercihler ve Tanımlamalar → Genel → Ödeme Uyarıları**'ndaki eşiklere göre hesaplanır (`highlightDue` açıksa; seçenekler yalnızca onay kutusu işaretliyken görünür). Yaklaşan gün sayısı kritik gün sayısından büyük olmalıdır.

| Seviye | Koşul | Renk | Davranış |
|---|---|---|---|
| 🔴 **Gecikti / Bugün** | Bu ayın taksiti ödenmemiş ve ödeme günü geldi/geçti | `#ef4444` | En yüksek öncelik |
| 🟠 **Kritik** | Ödemeye ≤ *kritik gün* (varsayılan 3) kaldı | `#f97316` | |
| 🟡 **Yaklaşıyor** | Ödemeye ≤ *yaklaşan gün* (varsayılan 7) kaldı | `#eab308` | |
| 🟠 **Bitiyor** | Kalan taksit ≤ *bitiş eşiği* (varsayılan 2) | `#f97316` | Yanıp söner |
| 🟢 **Son taksit** | Tek taksit kaldı | `#22c55e` | Yanıp söner |

- Ödeme günü ayın son gününden büyükse (örn. 31) o ayın son gününe çekilir.
- Ödeme günü girilmemişse **başlangıç tarihinin günü** kullanılır.
- Bildirim merkezi, kayıtları önem sırasına, ardından ödeme gününe göre sıralar.

## ⚙️ Ayarlar Rehberi

**MENÜ → Ayarlar** dört sekmeden oluşur. Her sekmenin altında **Uygula** (kaydet, pencere açık kalır) ve **Kaydet** (kaydet ve kapat) düğmeleri bulunur.

### 1) Tercihler ve Tanımlamalar
İki alt sekmesi vardır:

**Genel**
- **Borç Tipleri:** toplam/kullanımdaki tip sayısı, sıralama, renk ve simge düzenleme (tipler sabittir).
- **Ödeme Uyarıları:** uyarı eşikleri (aşağıdaki tablo).

| Tercih | Varsayılan | Açıklama |
|---|---|---|
| Ödeme uyarılarını vurgula | Açık | Tüm uyarıları aç/kapat |
| Yaklaşan ödeme günü (sarı) | 7 | "Yaklaşıyor" eşiği (gün) |
| Kritik ödeme günü (turuncu) | 3 | "Kritik" eşiği (gün) |
| Ödeme bitimi yaklaşan (turuncu) | 2 | Kaç taksit kala "bitiyor" denir |
| Son taksit ödemesi (yeşil) | 1 (sabit) | Değiştirilemez |

Para birimi, varsayılan BSMV/KKDF, liste görünümü ve satır başına kart sayısı da `preferences` içinde saklanır; liste/kart seçimi ana ekrandaki liste başlığından yapılır.

**Kredi Tercihleri** — *Kredi Vade Bilgileri*: İhtiyaç, Konut, Taşıt ve KOBİ kredileri için BDDK kararlarından ve vergi mevzuatından derlenmiş vade/tutar sınırları ile KKDF-BSMV oranları (**bilgilendirme amaçlıdır**; sınırlar dönemsel olarak değişir, güncel tablo için bankanıza danışın).

### 2) Hesap ve Güvenlik
Avatar, ad ve e-posta özeti; altında **Profil Bilgileri** (ad soyad, kullanıcı adı, e-posta), **Parola Değişimi** ve **Şifre Kurtarma Seçenekleri** (güvenlik sorusu ve cevabı).

### 3) Görsellik Ayarları
- **Baloncuk Efektleri:** genel aç/kapa, giriş ekranı / panel için ayrı, adet (4–45), boyut (12–260), hız, sürüklenme, opaklık, bulanıklık, parlama, karmaşıklık, çeşitlilik, 6 renk.
- **Arayüz Efektleri:** vurgu rengi, cam efekti, animasyonlar, ödeme havai fişeği (süre 2–10, hız 1–10).
- Tek tuşla varsayılana sıfırlama.

### 4) Veritabanı İşlemleri
Veritabanı dosyası adı (`database.db` veya `Local Storage`), dosya boyutu, şifreleme algoritması bilgisi; **yedekle**, **yükle/geri yükle**, **bütünlük doğrula**, **sıfırla ve sil**. Aynı bilgi kutuları üst çubuktaki sunucu rozetine tıklayınca da açılır.

## 📦 Yedekleme ve Geri Yükleme

| İşlem | Nasıl |
|---|---|
| **Yedek al** | Ayarlar → Veritabanı İşlemleri → *Veritabanı Yedekle*. Şifreli `database-yedek.json` indirilir (her iki modda da aynı biçim). |
| **Geri yükle** | *Veritabanı Yükle* → dosyayı sürükleyin veya seçin → onaylayın. |
| **Dosya kopyası** | Sunucu modunda `database.db` dosyasını kopyalamak da yeterlidir (sunucu kapalıyken kopyalayın; `-wal`/`-shm` dosyalarını da alın). |
| **Bütünlük doğrulama** | Kullanıcı, borç tipleri ve kayıt dizilerinin varlığını (şema) kontrol eder. İçerik doğruluğunu denetlemez. |
| **Sıfırla** | Sunucu modunda `app_data` kaydını, yerel modda Local Storage verisini siler ve temiz başlangıç verisi oluşturur. **Geri alınamaz** — önce yedek alın. |

> 🔁 **Mod değiştirirken:** yerel moddan sunucu moduna geçecekseniz önce yedek alıp yeni modda *Yükle* ile içeri aktarın.

## 🔐 Güvenlik ve Gizlilik

### Nasıl çalışır
- Veri, kaydedilmeden önce tarayıcıda **AES-256-GCM** ile şifrelenir. Anahtar **PBKDF2 (SHA-256, 100.000 tur)** ile türetilir; her kayıtta rastgele **16 bayt salt** ve **12 bayt IV** üretilir.
- Sunucu yalnızca `{ salt, iv, data }` paketini `app_data` tablosuna yazar.
- `database.db`, `database.json` (ve `-wal`/`-shm`/`-journal` uzantıları) ile `server.js` HTTP üzerinden **indirilemez** (404 döner).
- Dışarıya veri gönderilmez; harici istekler yalnızca [aşağıdaki](#-harici-bağımlılıklar-ve-ağ-istekleri) arayüz kaynakları içindir.

### ⚠️ Bilmeniz gereken sınırlar

Bu uygulama **kişisel / yerel kullanım** içindir. Aşağıdaki noktaları bilerek kullanın:

1. **Şifreleme anahtarı kullanıcı parolasından türetilmez.** Anahtar, `index.html` içindeki sabit bir değerden (`MASTER_SECRET`) türetilir. Yani şifreleme, `database.db`/yedek dosyasını **başkasının doğrudan okumasına karşı bir engel** sağlar ancak uygulama kodunu da ele geçiren biri verileri çözebilir. Bu, kullanıcı parolasıyla korunan uçtan uca şifreleme **değildir**.
2. **Giriş ekranı istemci tarafındadır.** Parola kontrolü tarayıcıda, çözülmüş verideki kullanıcı kaydıyla yapılır; oturum bilgisi Local Storage'da tutulur. Bir erişim kontrolü katmanı değil, kullanım kolaylığı/gizlilik perdesidir.
3. **API kimlik doğrulaması yoktur** ve CORS tüm kaynaklara açıktır. Sunucuyu **internete açmayın**; yalnızca `localhost` veya güvenilir yerel ağda kullanın.
4. Sağ tıklama menüsü uygulamada kapatılmıştır (uyarı penceresi gösterir); bu bir güvenlik önlemi değil, arayüz tercihidir.
5. Parola kurtarma, güvenlik sorusu cevabıyla yapılır; cevabı tahmin edilebilir seçmeyin.

**Öneriler:** ilk girişte varsayılan parolayı değiştirin · düzenli yedek alın · `database.db` ve yedek dosyalarını sürüm kontrolüne eklemeyin · gerçek bir çok kullanıcılı/uzak kullanım gerekiyorsa parola kaynaklı anahtar türetme ve sunucu tarafı kimlik doğrulama ekleyin.

## 🔌 Sunucu API'si

Taban adres: `http://localhost:3000` · JSON gövde limiti: **10 MB**

| Yöntem | Adres | Açıklama | Yanıt |
|---|---|---|---|
| `GET` | `/api/database` | Şifreli paketi döndürür | `200` `{salt, iv, data}` · `404` veritabanı boşsa |
| `POST` | `/api/save` | Şifreli paketi kaydeder (upsert) | `200` · `400` geçersiz paket · `500` hata |
| `DELETE` | `/api/database` | Kaydı siler | `200` · `500` |
| `GET` | `/api/database/info` | Dosya adı ve boyutu | `200` `{fileName, size}` |

**İstek gövdesi (`POST /api/save`):** `salt`, `iv`, `data` alanları **boş olmayan bayt dizileri** (0–255 tamsayı) olmalıdır.

```bash
# Örnek: dosya bilgisi
curl http://localhost:3000/api/database/info
# {"fileName":"database.db","size":81920}
```

Statik dosyalar proje klasöründen servis edilir (`express.static`); uygulama `x-powered-by: Express` başlığıyla sunucu modunu algılar.

## 🏗️ Mimari ve Proje Yapısı

```
.
├── index.html        # Tüm arayüz (HTML + CSS) ve uygulama mantığı (JS) – ~13.7 bin satır
├── server.js         # Express + node:sqlite katmanı (≈110 satır)
├── package.json      # Betikler ve bağımlılıklar (lisans: Unlicense)
├── package-lock.json
├── database.db       # (otomatik oluşur) şifreli SQLite veritabanı  ← .gitignore'da
├── LICENSE           # Unlicense (kamu malı)
└── README.md
```

### Teknoloji yığını

| Katman | Teknoloji |
|---|---|
| Arayüz | Vanilla JS, HTML5, CSS (CSS değişkenleriyle tema, Neumorphism UI uyarlaması) |
| Grafik | [Chart.js](https://www.chartjs.org/) (CDN) |
| PDF | [jsPDF](https://github.com/parallax/jsPDF) 2.5.1 (CDN); Türkçe karakterler için Roboto yazı tipi indirilir |
| Simgeler | [Font Awesome 6.4](https://fontawesome.com/) (CDN) |
| Yazı tipi | Nunito Sans ve Inter (Google Fonts) |
| Efekt | [fireworks-js](https://github.com/crashmax-dev/fireworks-js) (isteğe bağlı, dinamik import) |
| Şifreleme | Web Crypto API (AES-GCM + PBKDF2) |
| Sunucu | Node.js, Express 4, CORS |
| Veritabanı | `node:sqlite` (`DatabaseSync`) |

### `server.js` özeti
- `app_data` tablosu **tek satırlıdır** (`id INTEGER PRIMARY KEY CHECK (id = 1)`); alanlar `salt`, `iv`, `data` (BLOB) ve `updated_at`.
- `INSERT … ON CONFLICT DO UPDATE` ile upsert yapılır.
- Eski `database.json` varsa ve veritabanı boşsa bir kez içe aktarılır.
- Veritabanı/sunucu dosyalarına doğrudan erişim ara katmanla engellenir.

### `index.html` bölümleri (başlıca fonksiyonlar)

| Alan | Örnek fonksiyonlar |
|---|---|
| Hesaplama | `calculateLoanDetails`, `getLoanAmortParams`, `solveGrossMonthlyRate`, `computeContractSchedule`, `computePaymentSchedule`, `getAmortPosition`, `calculateEarlyClosureDetails` |
| Uyarılar | `getPaymentWarning`, `getEndingWarning`, `getRecordAlert`, `renderNotifications` |
| Şifreleme | `getCryptoKey`, `encryptData`, `decryptData` |
| Durum/depolama | `createInitialAppState`, `normalizeAppState`, `scanAndInitializeDataFile`, `autoSaveAllData`, `detectServerMode` |
| Kimlik | `handleLogin`, `handleLogout`, `handleForgotPassword*` |
| Veritabanı işlemleri | `handleDatabaseBackup`, `prepareDatabaseImport`, `applyDatabaseImport`, `deleteDatabase`, `verifyDatabaseIntegrity` |
| Borç tipleri/simge | `renderDebtTypeList`, `moveDebtType`, `loadIconLibrary`, `renderIconPickerGrid`, `getLoanTypeKey`, `LOAN_TYPE_CONFIG` |
| Tasarruf finansmanı | `buildSavingsPlan`, `computeSavingsAutoMonthly`, `estimateSavingsDelivery`, `getSavingsDeliveryInfo` |
| BDDK kontrolleri | `evaluateBddkLimits`, `buildCreditTermsHtml`, `validateLoanForm` |
| PDF | `createPdfContext`, `drawPdfHeader`, `generateRecordsPdf` (liste), `generateRecordPdf` (kayıt), `drawRecordCostChart`, `drawRecordTechCharts` (PDF'ler jsPDF ile çizilir) |
| Kayıtlar | `handleAddOrEditRecord`, `incrementPaid`, `decrementPaid`, `setPartialPayment`, `renderPaymentPlanModal` |
| Görünüm | `renderStats`, `renderChart`, `renderTypeCharts`, `renderCards`, `renderTable` |
| Görsel ayarlar | `applyVisualSettings`, `renderAmbientBubbles`, `launchFireworks`, `applyAccentColor` |

`normalizeAppState()` eski veri biçimlerini (ör. `categories → debtTypes`) otomatik taşır ve ayar değerlerini geçerli aralıklara sabitler; böylece eski yedekler yeni sürümlerde de açılır.

## 🗄️ Veri Modeli

Şifrelenmeden önceki `appState` yapısı (özet):

```jsonc
{
  "user": {
    "email": "admin@admin.local",
    "password": "…",
    "securityQuestion": "…",
    "securityAnswer": "…",
    "fullName": "",
    "username": ""
  },
  "debtTypes": [
    { "name": "Konut Kredisi", "color": "#10b981", "icon": "house" }   // yalnızca 6 sabit tip
  ],
  "records": [
    {
      "id": "…",
      "title": "180 Bin İhtiyaç Kredisi",
      "debtType": "İhtiyaç Kredisi",
      "bankName": "…",
      "netAmount": 180000,
      "extraFee": 1500,
      "interestRate": 3.89,
      "bsmvRate": 15,
      "kkdfRate": 15,
      "installmentCount": 24,
      "totalAmount": 0,
      "earlyClosureDiscount": 0,
      "paidInstallments": 0,
      "startDate": "2026-01-15",
      "paymentDay": 15,
      "partialPayments": { "5": 4000.00 },
      "notes": "",
      "lastPaidMonth": "…",
      "finalPaymentMonth": "…"
      // Tipe özel isteğe bağlı alanlar: konutValue, konutFirstHome (Konut) · vehicleType, vehicleValue (Taşıt)
      // · kobiProgram, kobiPurpose (KOBİ) · downPayment, savAsset, savModel, savMonthly, savStepped,
      //   savStepRate, savStepPeriod, savFeeValue, savFeeUnit, savFeeInst (Tasarruf Finansmanı)
    }
  ],
  "preferences":    { "currency": "TRY", "defaultBsmv": 15, "defaultKkdf": 15, "…": "…" },
  "visualSettings": { "accent": "indigo", "bubblesEnabled": true, "…": "…" },
  "iconLibrary":    { "version": "…", "source": "…", "icons": ["house", "car", "…"] }
}
```

> Alan adları kod incelemesinden özetlenmiştir; kesin şema için `normalizeAppState()` ve `handleAddOrEditRecord()` fonksiyonlarına bakın.

**Tarayıcı Local Storage anahtarları:**

| Anahtar | İçerik |
|---|---|
| `finans_takip_encrypted_data` | Şifreli veri paketi (yerel mod) |
| `finans_takip_is_logged_in` | Oturum bayrağı |
| `finans_takip_theme` | Tema tercihi |
| `finans_takip_hide_numbers` | Rakam gizleme tercihi |

## 🌐 Harici Bağımlılıklar ve Ağ İstekleri

Arayüz aşağıdaki dış kaynaklara bağlanır. **Çevrimdışı çalışırsanız** ilgili parça devre dışı kalır, temel kredi takibi çalışmaya devam eder.

| Kaynak | Amaç | İnternet yoksa |
|---|---|---|
| `cdnjs.cloudflare.com` (Font Awesome) | Simgeler ve simge kütüphanesi | Simgeler görünmez |
| `cdn.jsdelivr.net` (Chart.js) | Grafikler | Grafik çizilmez |
| `fonts.googleapis.com` (Nunito Sans, Inter) | Yazı tipi | Sistem yazı tipi kullanılır |
| `cdnjs.cloudflare.com` (jsPDF) | PDF oluşturma | PDF indirilemez |
| `cdn.jsdelivr.net` / `unpkg.com` (Roboto yazı tipi) | PDF'te Türkçe karakterler | PDF'te bazı karakterler sadeleştirilir |
| `esm.run` (fireworks-js) | Ödeme havai fişeği (isteğe bağlı) | Efekt çalışmaz |
| `api.open-meteo.com`, `api.bigdatacloud.net`, `ipwho.is` | Üst çubukta hava durumu ve konum | Hava durumu gösterilmez |
| `avatars.githubusercontent.com` | Geliştirici profil kartı avatarı | Yedek simge gösterilir |

> 🔒 **Gizlilik notu:** Hava durumu özelliği tarayıcı konum iznini kullanabilir; izin verilmezse yaklaşık konum için IP tabanlı servis (`ipwho.is`) denenir. Kredi verileriniz bu isteklere **dahil edilmez**. İsterseniz konum iznini reddedebilirsiniz.

## 🩺 Sorun Giderme

| Belirti | Olası neden / Çözüm |
|---|---|
| `Cannot find module 'node:sqlite'` / `ERR_UNKNOWN_BUILTIN_MODULE` | Node sürümü eski. `node --version` ≥ **22.19** olmalı. |
| "ExperimentalWarning: SQLite…" uyarısı | Normal. Node'un `node:sqlite` modülü deneysel olarak işaretlidir. |
| Port kullanımda (`EADDRINUSE`) | `PORT=3001 npm start` ile farklı port seçin. |
| Verilerim `file://` ile açınca görünmüyor | Yerel mod, sunucu modu verisini görmez. Yedek alıp yükleyin. |
| Tarayıcıyı değiştirince veri yok | Local Storage tarayıcıya özeldir; sunucu modunu kullanın veya yedek taşıyın. |
| PDF indirilmiyor | jsPDF CDN'ine ulaşılamıyor olabilir; internet bağlantısını kontrol edin. |
| Simge listesi boş / simgeler yok | Font Awesome CDN'ine ulaşılamıyor. İnterneti kontrol edin; Tanımlamalar'da simge kütüphanesi yeniden denenir. |
| Grafikler görünmüyor | Chart.js CDN'i engellenmiş olabilir (reklam/güvenlik eklentisi, çevrimdışı). |
| Parolamı unuttum | Giriş ekranında **Şifremi Unuttum?** → e-posta → güvenlik cevabı → yeni parola. |
| Her şey sıfırlandı | Tarayıcı site verisi temizlenmiş olabilir (yerel mod). Yedekten geri yükleyin. |
| Yedek yüklenmiyor | Dosya, uygulamanın ürettiği şifreli `database-yedek.json` olmalı (`salt`, `iv`, `data`). |
| Sağ tık "uyarı" penceresi açıyor | Beklenen davranış; uygulama bağlam menüsünü kapatır. |

**Sıfırdan başlamak için:** sunucuyu durdurun → `database.db*` dosyalarını silin → tarayıcıda site verilerini (Local Storage) temizleyin → yeniden başlatın.

## 🧑‍💻 Geliştirici Notları

- **Derleme yok:** `index.html` düzenlenip tarayıcıyı yenilemek yeterlidir. Statik dosyalar önbelleksiz değil; değişiklik görünmezse sert yenileme (`Ctrl+F5`) yapın.
- **Test:** Projede otomatik test yoktur (`npm test` yer tutucudur). Hesaplama fonksiyonları DOM'a bağımlı olduğundan test için önce saf fonksiyonlara ayrılmaları önerilir.
- **Yeni ayar eklemek:** `DEFAULT_PREFERENCES` / `DEFAULT_VISUAL_SETTINGS` içine varsayılanı ekleyin, `normalizeAppState()` içinde doğrulayın, ilgili formu `populate…Form` ve `handle…Update` fonksiyonlarına bağlayın.
- **Veri biçimi değişikliği:** eski yedeklerin açılabilmesi için `normalizeAppState()` içine **göç (migration)** kuralı yazın.
- **Para birimi eklemek:** `CURRENCY_OPTIONS` nesnesine sembol ve ad ekleyin.

### Katkı
Hata bildirimi ve öneriler için issue açabilir, değişiklikler için pull request gönderebilirsiniz. Büyük değişikliklerde önce bir issue ile tartışmanız önerilir. Bu araç yalnızca takip ve bilgilendirme amaçlıdır; finansal tavsiye değildir.

## 📄 Lisans

Bu proje [Unlicense](https://unlicense.org/) ile kamu malı olarak sunulmuştur; dilediğiniz gibi kullanabilir, değiştirebilir ve dağıtabilirsiniz. Ayrıntılar için [`LICENSE`](LICENSE) dosyasına bakın.

## 🕰️ Son Güncelleme
28 Ekim 2026

---

<p align="center">❤️ Made with Love ❤️</p>

---
