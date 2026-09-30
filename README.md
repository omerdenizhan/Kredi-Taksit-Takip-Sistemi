# Kredi & Taksit Takip Sistemi

Bireysel kredi ve taksitli borçlarınızı kolayca yönetmenizi, analiz etmenizi ve ödeme takviminizi takip etmenizi sağlayan, tek sayfalık (`index.html`) modern bir web uygulamasıdır. Verileriniz tarayıcıda **AES-256-GCM** ile şifrelenerek saklanır; sunucu modunda `database.db` (SQLite), sunucusuz modda tarayıcının **Local Storage** alanı kullanılır.

## 🚀 Öne Çıkan Özellikler

* **Gelişmiş Finansal Hesaplama:** Net tutar, ek masraflar, aylık faiz oranı, BSMV ve KKDF oranlarına göre brüt faiz ve aylık taksit hesaplama.
* **Detaylı Ödeme Planı:** Her borç için taksit takvimi, ödenen/ödenmeyen taksit takibi, güncel ay işareti ve taksit ödendi/geri al butonları.
* **Erken Kapama Analizi:** Güncel gün ve işlenen faizler dahil anlık erken kapama tutarı ve varsa erken kapama indirimi.
* **Borç Tipleri:** Borçları tiplere ayırma; her tip için ad, renk ve simge seçimi, sürükle-bırak ile sıralama. Seçilen simge borç listesinde borç adının yanında görünür.
* **Otomatik Simge Kütüphanesi:** "Simge Seç" listesi Font Awesome'ın ücretsiz **Classic / Solid** simge setinden otomatik çekilir ve veritabanına kaydedilir; sonraki açılışlarda yeniden indirilmez. Arama İngilizce simge adıyla yapılır (`house`, `car`, `bank`...).
* **Ana Ekran:** Toplam Borç, Aylık Ödeme, Kalan Anapara, Bugün Kapatılırsa, Ödenen ve Kalan Toplam Borç kartları; "Borç Tipi Dağılımı" grafiği ve grafik açıklamasındaki bir tipe tıklayınca açılan teknik grafik penceresi (Chart.js); "Aktif Kredi & Taksit Listesi".
* **Ayarlar Menüsü:** Tek menü altında üç sekme:
  * **Tanımlamalar** – borç tiplerini ekleme, düzenleme, renk ve simge belirleme, sıralama.
  * **Kullanıcı Profili ve Hesap Merkezi** – üstte avatar, ad ve e-posta özeti; altında Profil Bilgileri, Güvenlik ve Parola ve Tercihler (para birimi, varsayılan BSMV ve KKDF) sekmeleri.
  * **Veritabanı İşlemleri** – veritabanı bilgisi, yedekleme, geri yükleme, bütünlük doğrulama ve sıfırlama.
* **Güvenlik:** Giriş ekranı, güvenlik sorusuyla parola kurtarma ve şifreli veri saklama.
* **Kişiselleştirme ve Gizlilik:** Koyu/açık tema, rakamları tek tuşla gizleme/gösterme, TRY / USD / EUR para birimleri.

---

## 💾 Depolama ve Çalışma Modları

Uygulama iki farklı şekilde çalışır. Hangisinin kullanıldığı otomatik belirlenir ve **Ayarlar → Veritabanı İşlemleri** ekranında "Veritabanı Dosyası" alanında görülür.

| Mod | Nasıl açılır | Veritabanı |
| --- | --- | --- |
| **Sunucu modu** | `npm start` ile başlatıp `http://localhost:3000` adresinden | Proje klasöründeki **`database.db`** (SQLite) |
| **Yerel mod** | Node.js kurmadan `index.html` dosyasını tarayıcıda açarak | Tarayıcının **Local Storage** alanı |

### Şifreleme

* Veri, kaydedilmeden önce **tarayıcıda** AES-256-GCM ve PBKDF2 (SHA-256, 100.000 tur) ile şifrelenir.
* Sunucu yalnızca şifreli paketi (`salt`, `iv`, `data`) `database.db` içindeki `app_data` tablosuna yazar; verinin içeriğini göremez.
* Yerel modda aynı şifreli paket Local Storage'da saklanır.

### Modlar arası notlar

* Local Storage verisi tarayıcıya ve adrese (örneğin `file://` ile `http://localhost:3000`) özeldir; iki mod birbirinin verisini otomatik görmez. Sunucu modunda veritabanı boşsa ve aynı tarayıcıda yerel veri varsa ilk kayıtta bu veri `database.db` dosyasına yazılır.
* **Veritabanı Yedekle** her iki modda da şifreli bir `database-yedek.json` dosyası indirir. **Veritabanı Yükle / Geri Yükle** bu dosyayı iki modda da geri yükler; modlar arasında veri taşımak için bu yedeği kullanabilirsiniz.
* Sunucu modunda yedek almak için `database.db` dosyasını kopyalamak da yeterlidir.
* **Veritabanını Sıfırla ve Sil** sunucu modunda `database.db` içindeki kaydı, yerel modda Local Storage verisini silip temiz başlangıç verisi oluşturur.

### `database.json` kullanıyorsanız

Önceki sürümlerde veriler `database.json` dosyasında tutuluyordu. `database.db` yoksa ve klasörde `database.json` varsa, sunucu ilk başlatmada şifreli veriyi **otomatik olarak** `database.db` dosyasına aktarır (şifre ve veri değişmez). `database.json` dosyasına dokunulmaz; her şeyin çalıştığından emin olduktan sonra yedek olarak saklayabilir ya da silebilirsiniz.

---

## 🛠️ Kurulum (Sunucu Modu)

### 1. Gereksinimler

**Node.js 22.19 veya üzeri** gerekir. [nodejs.org](https://nodejs.org/) adresinden LTS sürümünü kurun; `npm` birlikte gelir. SQLite desteği Node.js'in yerleşik `node:sqlite` modülünden gelir, ek bir veritabanı paketi kurulmaz. Node.js bu modül için "deneysel" uyarısı yazdırabilir; bu normaldir.

### 2. Bağımlılıkları yükleme

Proje klasöründe:

```bash
npm install
```

### 3. Başlatma

```bash
npm start
```

Tarayıcıdan `http://localhost:3000` adresini açın. Başka bir port için `PORT` ortam değişkenini kullanabilirsiniz (Windows PowerShell: `$env:PORT=8080; npm start`).

İlk çalıştırmada `database.db` dosyası otomatik oluşturulur. Varsayılan giriş bilgileri `admin@admin.local` / `admin123` şeklindedir; girişten sonra **Ayarlar → Kullanıcı Profili ve Hesap Merkezi** bölümünden değiştirmeniz önerilir.

## 🖥️ Kurulum (Yerel Mod)

Node.js gerekmez. `index.html` dosyasını tarayıcıda açmanız yeterlidir. Simge listesi, grafikler ve yazı tipi için internet bağlantısı gerekir (Font Awesome, Chart.js ve Google Fonts CDN'den yüklenir).

---

## 🔌 Sunucu API'si

| Yöntem | Adres | Açıklama |
| --- | --- | --- |
| `GET` | `/api/database` | Şifreli paketi döndürür; veritabanı boşsa `404` |
| `POST` | `/api/save` | Şifreli paketi (`salt`, `iv`, `data`) `database.db` içine kaydeder |
| `DELETE` | `/api/database` | Kaydı siler |
| `GET` | `/api/database/info` | Dosya adı ve boyutu |

`database.db`, `database.json` ve `server.js` dosyaları tarayıcıdan doğrudan indirilemez.

## 📁 Proje Dosyaları

* `index.html` – tüm arayüz ve uygulama mantığı
* `server.js` – Express sunucusu ve SQLite (`database.db`) katmanı
* `package.json` – `npm start` ve bağımlılıklar
* `database.db` – sunucu modunda oluşan şifreli veritabanı (`.gitignore` içindedir)

## 📄 Lisans

Bu proje lisanssızdır; ayrıntılar için `LICENSE` dosyasına bakın.
