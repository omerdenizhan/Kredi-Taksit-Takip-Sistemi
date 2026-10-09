<div align="center">

# 💳 Kredi & Taksit Takip Sistemi

**Kredi, kart taksidi ve kişisel borçlarınızı tek ekrandan yönetin, analiz edin ve ödeme gününü kaçırmayın.**

![Node](https://img.shields.io/badge/Node.js-%E2%89%A5%2022.19-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)
![SQLite](https://img.shields.io/badge/SQLite-node%3Asqlite-003B57?logo=sqlite&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-grafikler-FF6384?logo=chartdotjs&logoColor=white)
![Sürüm](https://img.shields.io/badge/s%C3%BCr%C3%BCm-1.0.8-6366f1)
![Lisans](https://img.shields.io/badge/lisans-Unlicense-blue)

</div>

---

## 📑 İçindekiler

1. [Genel Bakış](#-genel-bakış)
2. [Özellikler](#-özellikler)
3. [Hızlı Başlangıç](#-hızlı-başlangıç)
4. [Çalışma Modları ve Depolama](#-çalışma-modları-ve-depolama)
5. [Kullanım Kılavuzu](#-kullanım-kılavuzu)
6. [Finansal Hesaplama Mantığı](#-finansal-hesaplama-mantığı)
7. [Uyarı ve Bildirim Sistemi](#-uyarı-ve-bildirim-sistemi)
8. [Ayarlar Rehberi](#-ayarlar-rehberi)
9. [Yedekleme ve Geri Yükleme](#-yedekleme-ve-geri-yükleme)
10. [Güvenlik ve Gizlilik](#-güvenlik-ve-gizlilik)
11. [Sunucu API'si](#-sunucu-apisi)
12. [Mimari ve Proje Yapısı](#-mimari-ve-proje-yapısı)
13. [Veri Modeli](#-veri-modeli)
14. [Harici Bağımlılıklar ve Ağ İstekleri](#-harici-bağımlılıklar-ve-ağ-istekleri)
15. [Sorun Giderme](#-sorun-giderme)
16. [Geliştirici Notları](#-geliştirici-notları)
17. [Lisans](#-lisans)

---

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

---

## ✨ Özellikler

### 📊 Ana Ekran (Dashboard)
- **Özet kartları:** Toplam Borç, Aylık Ödeme, Kalan Anapara, Bugün Kapatılırsa, Ödenen, Kalan Toplam Borç.
- **Borç Tipi Dağılımı** grafiği (Chart.js). Açıklamadaki bir tipe tıklayınca o tipe ait **teknik grafik penceresi** açılır; tek bir kayıt için de ayrı grafik görüntülenebilir.
- **Aktif Kredi & Taksit Listesi:** tablo (liste) veya kart görünümü, kart görünümünde satır başına 4 / 5 / 6 kart.
- **Borç tipi çipleri** ile listeyi tek tıkla filtreleme.
- Üst çubukta canlı **tarih/saat** ve (izin verilirse) **hava durumu**.
- Rakamları tek tuşla **gizle / göster** (ekran paylaşımı için).

### 🧮 Kredi Yönetimi
- Net tutar, ek masraf, aylık faiz, **BSMV** ve **KKDF** ile **brüt faiz oranı, aylık taksit ve toplam geri ödeme** canlı önizleme.
- Banka/kurum, ödeme günü, başlangıç tarihi, ödenen taksit sayısı ve not alanları.
- **Detaylı ödeme planı:** taksit no, vade tarihi, taksit, faiz, anapara, kalan anapara; güncel ay işaretli ve otomatik kaydırılır.
- **Taksit ödendi / geri al** tek tıkla.
- **Kısmi ödeme:** henüz ödenmemiş bir taksite taksitten düşük bir tutar girilebilir; plan yeniden hesaplanır.
- **Erken kapama analizi:** kalan anapara + işleyen faiz, varsa erken kapama indirimi.
- Kayıt ayrıntıları penceresi, düzenleme ve silme (onaylı).

### 🏷️ Borç Tipleri
- Varsayılan tipler: İhtiyaç Kredisi, Konut Kredisi, Taşıt Kredisi, Kredi Kartı Taksidi, Senet / Elden Borç, Diğer.
- Her tip için **ad, renk ve simge**; **sürükle-bırak** ile sıralama.
- **Otomatik simge kütüphanesi:** Font Awesome *Classic / Solid* simgeleri CSS'ten ayrıştırılıp veritabanına kaydedilir, sonraki açılışlarda yeniden indirilmez. Arama İngilizce simge adıyla yapılır (`house`, `car`, `bank`…).
- Kayıt formundan çıkmadan yeni tip ekleme (form durumu korunur).

### 🔔 Bildirimler
- Zil simgeli **bildirim merkezi**; ödeme günü ve bitişe yakın kredileri önem sırasına göre listeler.
- Listede ve kartlarda renkli uyarı etiketleri; bitişe yakın kayıtlar yanıp söner. ([Ayrıntılar](#-uyarı-ve-bildirim-sistemi))

### 🎨 Kişiselleştirme
- **Koyu / açık tema** (anahtar animasyonlu), tercih hatırlanır.
- **14 vurgu rengi** (İndigo, Turuncu, Zümrüt, Pembe, Gökyüzü, Kehribar, Mor, Petrol, Kırmızı, Limon Yeşili, Mavi, Eflatun, Camgöbeği, Gül Kırmızısı).
- **Arka plan baloncukları:** adet, boyut aralığı, hız, sürüklenme, opaklık, bulanıklık, parlama, karmaşıklık, çeşitlilik ve 6 renk; giriş ekranı ve panel için ayrı ayrı açılıp kapatılır.
- Cam efekti ve animasyonları kapatma seçenekleri.
- İsteğe bağlı **ödeme kutlaması:** taksit ödendiğinde havai fişek (süre ve hız ayarlı).
- Para birimi: **TRY ₺ / USD $ / EUR €**.

### 👤 Hesap ve Güvenlik
- Giriş ekranı, çıkış, **güvenlik sorusuyla parola sıfırlama**.
- Profil: ad soyad, kullanıcı adı, e-posta, parola, güvenlik sorusu/cevabı.
- Veriler tarayıcıda **AES-256-GCM** ile şifrelenerek saklanır.

---

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

> ⚠️ Girişten hemen sonra **Ayarlar → Kullanıcı Profili ve Hesap Merkezi** bölümünden e-posta, parola ve güvenlik sorusunu değiştirin.

---

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

---

## 🧭 Kullanım Kılavuzu

### 1. Yeni kredi / taksit ekleme

1. Ana ekrandaki **"Yeni Kayıt"** düğmesine tıklayın.
2. Alanları doldurun:

| Alan | Açıklama |
|---|---|
| Kayıt / Borç Adı | Örn. `180 Bin İhtiyaç Kredisi` |
| Borç Tipi | Listeden seçin ya da formdan yeni tip ekleyin |
| Banka / Kurum | İsteğe bağlı |
| Çekilen Net Tutar | Hesabınıza geçen tutar |
| Ek Masraf / Dosya M. | Tahsis, dosya masrafı vb. (anaparaya eklenir) |
| Aylık Faiz Oranı (%) | Örn. `3.89` |
| BSMV (%) / KKDF-Stopaj (%) | Varsayılan 15 / 15 (Tercihlerden değiştirilebilir) |
| Taksit Sayısı | 1–120 |
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
- **Kısmi ödeme:** ödenmemiş taksit için taksitten **düşük** bir tutar girin. Tutar taksite eşit/büyükse uygulama "Ödendi" kutusunu işaretlemenizi ister. Kısmi ödeme, kalan anaparayı ve sonraki faizleri yeniden hesaplar; son taksit kalan bakiyeyi kapatacak şekilde ayarlanır.

### 3. Erken kapama

Kayıt ayrıntılarında ve ana ekrandaki **"Bugün Kapatılırsa"** kartında, kredinin bugün kapatılması hâlinde ödenecek tahmini tutar gösterilir (bkz. [hesaplama mantığı](#-finansal-hesaplama-mantığı)).

### 4. Borç tipi yönetimi

**Ayarlar → Tanımlamalar:** tip ekleme, düzenleme (ad/renk/simge), silme ve sürükle-bırak sıralama. Toplam ve kullanımdaki tip sayıları üstte gösterilir.

### 5. Gizlilik modu

Üst çubuktaki göz simgesi tüm tutarları maskeler. Tercih tarayıcıda hatırlanır.

---

## 🧮 Finansal Hesaplama Mantığı

Tüm formüller `index.html` içindeki `calculateLoanDetails`, `calculateEarlyClosureDetails` ve `computePaymentSchedule` fonksiyonlarındadır.

### Brüt faiz oranı

```
brüt_oran = (aylık_faiz / 100) × (1 + BSMV/100 + KKDF/100)
```

Örnek: %3,89 faiz, %15 BSMV, %15 KKDF → `0,0389 × 1,30 = %5,057`

### Aylık taksit (eşit taksitli annüite)

```
anapara = net_tutar + ek_masraf
taksit  = anapara × [ r × (1+r)^n ] / [ (1+r)^n − 1 ]      (r = brüt_oran, n = taksit sayısı)
toplam  = taksit × n
```

### Ödeme planı satırı

Her taksit için: `faiz = kalan_anapara × r` → `anapara_payı = taksit − faiz` → `kalan = kalan − anapara_payı`.
Faiz oranı girilmemiş ama anapara girilmişse, faiz toplam farkından **düz (doğrusal)** dağıtılır; anapara hiç girilmemişse toplam tutar eşit bölünür.

### Erken kapama

```
kalan_anapara = ödenen taksit kadar amortisman uygulanmış bakiye (kısmi ödemeler dahil)
işleyen_faiz  = kalan_anapara × (r / 30) × son_ödemeden_bugüne_geçen_gün
kapama        = (kalan_anapara + işleyen_faiz) × (1 − erken_kapama_indirimi/100)
```

Faiz/anapara bilgisi yoksa: `kalan = toplam − (toplam/n × ödenen)` basit yöntemi kullanılır.

### Ana ekran kartları

| Kart | Hesap |
|---|---|
| Toplam Borç | Tüm kayıtların toplam geri ödemesi |
| Aylık Ödeme | Bitmemiş kredilerin taksit toplamı |
| Kalan Anapara | Bitmemiş kredilerin kalan anaparası |
| Bugün Kapatılırsa | Bitmemiş kredilerin güncel kapama tutarı toplamı |
| Ödenen | Ödenen taksitler + kısmi ödemeler |
| Kalan Toplam Borç | Toplam Borç − Ödenen |

> ⚠️ Sonuçlar **tahmindir**. Bankaların gün sayımı, faiz yuvarlaması, sigorta ve masraf kalemleri farklı olabilir; bağlayıcı rakam için banka dökümünüzü esas alın. Bu yazılım finansal tavsiye değildir.

---

## 🚦 Uyarı ve Bildirim Sistemi

Uyarılar **Ayarlar → Tercihler**'deki eşiklere göre hesaplanır (`highlightDue` açıksa).

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

---

## ⚙️ Ayarlar Rehberi

**Üst çubuk → Ayarlar** dört sekmeden oluşur:

### 1) Tanımlamalar
Borç tiplerini ekleme/düzenleme/silme, renk, simge ve sıralama.

### 2) Kullanıcı Profili ve Hesap Merkezi
Avatar, ad ve e-posta özeti; altında:
- **Profil Bilgileri** — ad soyad, kullanıcı adı
- **Güvenlik ve Parola** — e-posta (giriş adı), yeni parola, güvenlik sorusu ve cevabı
- **Tercihler** — aşağıdaki tablo

| Tercih | Varsayılan | Açıklama |
|---|---|---|
| Para birimi | TRY | TRY / USD / EUR |
| Varsayılan BSMV | 15 | Yeni kayıt formuna ön doldurulur |
| Varsayılan KKDF | 15 | Yeni kayıt formuna ön doldurulur |
| Ödeme uyarılarını vurgula | Açık | Tüm uyarıları aç/kapat |
| Yaklaşan ödeme günü | 7 | "Yaklaşıyor" eşiği |
| Kritik ödeme günü | 3 | "Kritik" eşiği |
| Bitiş uyarısı (taksit) | 2 | Kaç taksit kala "bitiyor" denir |
| Liste görünümü | Liste | Liste / Kart |
| Satır başına kart | 4 | 4 / 5 / 6 |

### 3) Görsel Ayarlar
- **Baloncuklar:** genel aç/kapa, giriş ekranı / panel için ayrı, adet (4–45), boyut (12–260), hız, sürüklenme, opaklık, bulanıklık, parlama, karmaşıklık, çeşitlilik, 6 renk.
- **Arayüz:** vurgu rengi, cam efekti, animasyonlar, ödeme havai fişeği (süre 2–10, hız 1–10).
- Tek tuşla varsayılana sıfırlama.

### 4) Veritabanı İşlemleri
Veritabanı dosyası adı (`database.db` veya `Local Storage`), dosya boyutu, şifreleme algoritması bilgisi; **yedekle**, **yükle/geri yükle**, **bütünlük doğrula**, **sıfırla ve sil**.

---

## 📦 Yedekleme ve Geri Yükleme

| İşlem | Nasıl |
|---|---|
| **Yedek al** | Ayarlar → Veritabanı İşlemleri → *Veritabanı Yedekle*. Şifreli `database-yedek.json` indirilir (her iki modda da aynı biçim). |
| **Geri yükle** | *Veritabanı Yükle* → dosyayı sürükleyin veya seçin → onaylayın. |
| **Dosya kopyası** | Sunucu modunda `database.db` dosyasını kopyalamak da yeterlidir (sunucu kapalıyken kopyalayın; `-wal`/`-shm` dosyalarını da alın). |
| **Bütünlük doğrulama** | Kullanıcı, borç tipleri ve kayıt dizilerinin varlığını (şema) kontrol eder. İçerik doğruluğunu denetlemez. |
| **Sıfırla** | Sunucu modunda `app_data` kaydını, yerel modda Local Storage verisini siler ve temiz başlangıç verisi oluşturur. **Geri alınamaz** — önce yedek alın. |

> 🔁 **Mod değiştirirken:** yerel moddan sunucu moduna geçecekseniz önce yedek alıp yeni modda *Yükle* ile içeri aktarın.

---

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

---

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

---

## 🏗️ Mimari ve Proje Yapısı

```
.
├── index.html        # Tüm arayüz (HTML + CSS) ve uygulama mantığı (JS) – ~11.4 bin satır
├── server.js         # Express + node:sqlite katmanı (≈115 satır)
├── package.json      # Betikler ve bağımlılıklar
├── package-lock.json
├── database.db       # (otomatik oluşur) şifreli SQLite veritabanı  ← .gitignore'da
├── LICENSE           # Unlicense (kamu malı)
└── README.md
```

### Teknoloji yığını

| Katman | Teknoloji |
|---|---|
| Arayüz | Vanilla JS, HTML5, CSS (CSS değişkenleriyle tema) |
| Grafik | [Chart.js](https://www.chartjs.org/) (CDN) |
| Simgeler | [Font Awesome 6.4](https://fontawesome.com/) (CDN) |
| Yazı tipi | Inter (Google Fonts) |
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
| Hesaplama | `calculateLoanDetails`, `calculateEarlyClosureDetails`, `computePaymentSchedule`, `getPartialAdjustedBalance` |
| Uyarılar | `getPaymentWarning`, `getEndingWarning`, `getRecordAlert`, `renderNotifications` |
| Şifreleme | `getCryptoKey`, `encryptData`, `decryptData` |
| Durum/depolama | `createInitialAppState`, `normalizeAppState`, `scanAndInitializeDataFile`, `autoSaveAllData`, `detectServerMode` |
| Kimlik | `handleLogin`, `handleLogout`, `handleForgotPassword*` |
| Veritabanı işlemleri | `handleDatabaseBackup`, `prepareDatabaseImport`, `applyDatabaseImport`, `deleteDatabase`, `verifyDatabaseIntegrity` |
| Borç tipleri/simge | `renderDebtTypeList`, `moveDebtType`, `loadIconLibrary`, `renderIconPickerGrid` |
| Kayıtlar | `handleAddOrEditRecord`, `incrementPaid`, `decrementPaid`, `setPartialPayment`, `renderPaymentPlanModal` |
| Görünüm | `renderStats`, `renderChart`, `renderTypeCharts`, `renderCards`, `renderTable` |
| Görsel ayarlar | `applyVisualSettings`, `renderAmbientBubbles`, `launchFireworks`, `applyAccentColor` |

`normalizeAppState()` eski veri biçimlerini (ör. `categories → debtTypes`) otomatik taşır ve ayar değerlerini geçerli aralıklara sabitler; böylece eski yedekler yeni sürümlerde de açılır.

---

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
    { "name": "Konut Kredisi", "color": "#10b981", "icon": "house" }
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

---

## 🌐 Harici Bağımlılıklar ve Ağ İstekleri

Arayüz aşağıdaki dış kaynaklara bağlanır. **Çevrimdışı çalışırsanız** ilgili parça devre dışı kalır, temel kredi takibi çalışmaya devam eder.

| Kaynak | Amaç | İnternet yoksa |
|---|---|---|
| `cdnjs.cloudflare.com` (Font Awesome) | Simgeler ve simge kütüphanesi | Simgeler görünmez |
| `cdn.jsdelivr.net` (Chart.js) | Grafikler | Grafik çizilmez |
| `fonts.googleapis.com` (Inter) | Yazı tipi | Sistem yazı tipi kullanılır |
| `esm.run` (fireworks-js) | Ödeme havai fişeği (isteğe bağlı) | Efekt çalışmaz |
| `api.open-meteo.com`, `api.bigdatacloud.net`, `ipwho.is` | Üst çubukta hava durumu ve konum | Hava durumu gösterilmez |
| `avatars.githubusercontent.com` | Geliştirici profil kartı avatarı | Yedek simge gösterilir |

> 🔒 **Gizlilik notu:** Hava durumu özelliği tarayıcı konum iznini kullanabilir; izin verilmezse yaklaşık konum için IP tabanlı servis (`ipwho.is`) denenir. Kredi verileriniz bu isteklere **dahil edilmez**. İsterseniz konum iznini reddedebilirsiniz.

---

## 🩺 Sorun Giderme

| Belirti | Olası neden / Çözüm |
|---|---|
| `Cannot find module 'node:sqlite'` / `ERR_UNKNOWN_BUILTIN_MODULE` | Node sürümü eski. `node --version` ≥ **22.19** olmalı. |
| "ExperimentalWarning: SQLite…" uyarısı | Normal. Node'un `node:sqlite` modülü deneysel olarak işaretlidir. |
| Port kullanımda (`EADDRINUSE`) | `PORT=3001 npm start` ile farklı port seçin. |
| Verilerim `file://` ile açınca görünmüyor | Yerel mod, sunucu modu verisini görmez. Yedek alıp yükleyin. |
| Tarayıcıyı değiştirince veri yok | Local Storage tarayıcıya özeldir; sunucu modunu kullanın veya yedek taşıyın. |
| Simge listesi boş / simgeler yok | Font Awesome CDN'ine ulaşılamıyor. İnterneti kontrol edin; Tanımlamalar'da simge kütüphanesi yeniden denenir. |
| Grafikler görünmüyor | Chart.js CDN'i engellenmiş olabilir (reklam/güvenlik eklentisi, çevrimdışı). |
| Parolamı unuttum | Giriş ekranında **Şifremi Unuttum?** → e-posta → güvenlik cevabı → yeni parola. |
| Her şey sıfırlandı | Tarayıcı site verisi temizlenmiş olabilir (yerel mod). Yedekten geri yükleyin. |
| Yedek yüklenmiyor | Dosya, uygulamanın ürettiği şifreli `database-yedek.json` olmalı (`salt`, `iv`, `data`). |
| Sağ tık "uyarı" penceresi açıyor | Beklenen davranış; uygulama bağlam menüsünü kapatır. |

**Sıfırdan başlamak için:** sunucuyu durdurun → `database.db*` dosyalarını silin → tarayıcıda site verilerini (Local Storage) temizleyin → yeniden başlatın.

---

## 🧑‍💻 Geliştirici Notları

- **Derleme yok:** `index.html` düzenlenip tarayıcıyı yenilemek yeterlidir. Statik dosyalar önbelleksiz değil; değişiklik görünmezse sert yenileme (`Ctrl+F5`) yapın.
- **Test:** Projede otomatik test yoktur (`npm test` yer tutucudur). Hesaplama fonksiyonları DOM'a bağımlı olduğundan test için önce saf fonksiyonlara ayrılmaları önerilir.
- **Yeni ayar eklemek:** `DEFAULT_PREFERENCES` / `DEFAULT_VISUAL_SETTINGS` içine varsayılanı ekleyin, `normalizeAppState()` içinde doğrulayın, ilgili formu `populate…Form` ve `handle…Update` fonksiyonlarına bağlayın.
- **Veri biçimi değişikliği:** eski yedeklerin açılabilmesi için `normalizeAppState()` içine **göç (migration)** kuralı yazın.
- **Para birimi eklemek:** `CURRENCY_OPTIONS` nesnesine sembol ve ad ekleyin.

### Bilinen küçük tutarsızlıklar (temizlik önerileri)
- `package.json` içinde **`undici`** bağımlılığı var ama `server.js` kullanmıyor; kaldırılabilir.
- `package.json` → `"main": "index.html"`; çalıştırılabilir giriş noktası `server.js`'tir.
- `.gitignore` içindeki `/node_modules/node_modules` satırı muhtemelen `node_modules/` olmalıdır; ayrıca kökte uzantısız bir `gitignore` dosyası bulunuyor.
- `package.json` lisansı `ISC`, `LICENSE` dosyası ise Unlicense (kamu malı) — birini diğerine uyumlu hâle getirin.
- Depoya `node_modules/` ve içinde veri bulunan `database.db` dahil edilmemelidir.

### Katkı
Hata bildirimi ve öneriler için issue açabilir, değişiklikler için pull request gönderebilirsiniz. Büyük değişikliklerde önce bir issue ile tartışmanız önerilir.

---

## 📄 Lisans

Bu proje [Unlicense](https://unlicense.org/) ile kamu malı olarak sunulmuştur; dilediğiniz gibi kullanabilir, değiştirebilir ve dağıtabilirsiniz. Ayrıntılar için [`LICENSE`](LICENSE) dosyasına bakın.

---


## 🕰️ Son Güncelleme
09 Ekim 2026

---

<p align="center">❤️ Made with Love ❤️</p>

---


<div align="center">

Geliştirici: **[Ömer Denizhan](https://github.com/omerdenizhan)**

Bu araç yalnızca takip ve bilgilendirme amaçlıdır; finansal tavsiye değildir.

</div>
