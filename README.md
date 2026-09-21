# Kredi & Taksit Takip Sistemi

Kredi, taksit ve borç kayıtlarını takip etmek için hazırlanmış Express tabanlı web uygulamasıdır. Uygulama; kredi kayıtlarını, ödeme ilerlemesini, kalan anaparayı, erken kapama tutarını ve kategori bazlı borç dağılımını tek bir dashboard üzerinde gösterir.

## Teknoloji

- HTML5, CSS3 ve vanilla JavaScript
- Node.js ve Express 5
- Chart.js ile kategori dağılım grafiği
- Font Awesome ikonları
- Plus Jakarta Sans yazı tipi
- Web Crypto API ile AES-GCM ve PBKDF2/SHA-256 şifreleme
- Tarayıcı `localStorage` alanı ve sunucu API'si ile veri saklama

Chart.js, Font Awesome ve Google Fonts CDN üzerinden yüklenir. Uygulamanın tam görsel deneyimi için internet bağlantısı önerilir.

## Gereksinimler

- Node.js 18 veya üzeri
- npm
- Güncel bir web tarayıcısı

Kurulumu kontrol etmek için:

```powershell
node --version
npm --version
```

## Kurulum ve Çalıştırma

Proje klasöründe PowerShell açın:

```powershell
cd C:\LARAGON\www\KrediTaksitTakip
npm install
node server.js
```

Ardından tarayıcıda şu adresi açın:

```text
http://localhost:3000
```

Uygulama `index.html` dosyasına çift tıklanarak değil, Node.js sunucusu üzerinden çalıştırılmalıdır. Kayıt, veritabanı silme ve yükleme işlemleri Express API endpoint'lerini kullanır.

## İlk Giriş

Temiz bir veritabanı oluşturulduğunda veya veritabanı silindiğinde varsayılan kullanıcı oluşturulur:

```text
E-posta: admin@admin.local
Parola: admin123
```

Giriş yaptıktan sonra **Kullanıcı Bilgileri** menüsünden e-posta ve parola değiştirilebilir.

## Özellikler

### Dashboard

- Üst bölümde uygulama adı, `Özet` etiketi ve ait olunan ay/yıl bilgisi gösterilir.
- Toplam borç
- Aylık ödeme
- Kalan anapara
- Bugün kapatılırsa erken kapama tutarı
- Ödenen toplam tutar
- Kalan toplam borç
- Kategori bazlı borç dağılımı grafiği
- Açık/koyu tema seçimi

### Kredi ve Taksit Kaydı

Yeni kayıt formu şu alanları içerir:

- Kayıt veya borç adı
- Kategori
- Net çekilen/alınan tutar
- Aylık faiz oranı
- BSMV oranı
- KKDF/stopaj oranı
- Taksit sayısı
- Toplam geri ödeme
- Ödenen taksit sayısı
- Başlangıç tarihi
- Notlar

Net tutar, faiz oranı ve taksit sayısı girildiğinde vergi dahil brüt faiz, hesaplanan aylık taksit ve toplam geri ödeme önizlemesi hesaplanır.

### Aktif Kredi ve Taksit Listesi

Tabloda her kredi için kayıt adı, kategori, aylık tutar, son ödenen ay, son ödenecek ay, taksit ilerlemesi, kalan anapara, erken kapama tutarı, durum ve işlem butonları gösterilir.

Bir kaydın mevcut ay içindeki bir sonraki taksiti ödenmemişse satır farklı renkte gösterilir ve `Bu ay ödeme bekliyor` uyarısı görünür. Taksit ödeme işlemi onay penceresiyle gerçekleştirilir.

### Kredi Ayrıntıları

Tablodaki herhangi bir satıra tıklanırsa ayrıntı frame'i açılır. İşlem butonlarına tıklamak satır ayrıntılarını açmaz.

Ayrıntı frame'inde kategori, aylık tutar, net tutar, toplam geri ödeme, faiz/BSMV/KKDF oranları, taksit sayıları, başlangıç tarihi, son ödenen ay, son taksit ayı, kalan anapara, erken kapama tutarı, durum, tamamlanma yüzdesi ve notlar gösterilir.

Ödeme bekleyen kayıtlar ayrıntı frame'inde ayrıca uyarı alır. Ayrıntı kartlarında farklı renklerde hover kenarlığı ve gölge bulunur.

### Kategori Yönetimi

Sidebar içindeki **Kategoriler** menüsünden yeni kategori eklenebilir, kategori adı değiştirilebilir, kategori silinebilir ve kategoriler sürükle-bırak veya yukarı/aşağı butonlarıyla sıralanabilir. Kategori silindiğinde ilgili kredi kayıtlarının kategori bilgisi güncellenir.

### Sidebar

- Sidebar sayfa açıldığında dar görünümde başlar.
- Toggle butonuyla genişletilip daraltılabilir.
- Açık sidebar genişliği sürüklenebilir.
- Sidebar genişliği uygulama verileriyle birlikte saklanır.
- Mobil ekranlarda sidebar içerik üzerinde konumlanır.

### Özel Sağ Tık Menüsü

Tarayıcının varsayılan sağ tık menüsü engellenir. Uygulama açıkken sağ tıklama yapıldığında imlecin yanında uygulamaya özel menü açılır.

Menü seçenekleri:

- Yeni Kayıt
- Kategoriler
- Kullanıcı Bilgileri
- Veritabanı İşlemleri

Menü ekran sınırlarına göre konumlanır ve dışarı tıklanınca, Escape tuşuna basılınca, sayfa kaydırılınca veya pencere boyutu değişince kapanır.

### Login ve Tema

- Login ekranı kullanıcı doğrulaması yapar.
- Başarılı girişte dashboard görünür.
- Oturum kapatıldığında login ekranına dönülür.
- Açık/koyu tema tercihi `localStorage` içinde saklanır.
- Login kartında hover sırasında hafif yükselme, accent kenarlık ve glow efekti bulunur.

## Veritabanı İşlemleri

Sidebar veya özel sağ tık menüsündeki **Veritabanı İşlemleri** frame'inde üç işlem bulunur.

### Veritabanı Yedekle

Mevcut veritabanını şifreli `.json` dosyası olarak indirir. İndirme öncesinde onay alınır.

### Veritabanı Yükle

Yükleme ayrı bir frame içinde yapılır. Dosya sürükle-bırak alanına bırakılabilir veya dosya seçici ile seçilebilir.

Dosyanın JSON yapısı ve şifreli içeriği doğrulanır. Geçersiz veya şifresi çözülemeyen dosyalar yüklenmez.

Onay metninde işlemin geri alınamayacağı, mevcut verilerin üzerine yazılacağı ve oturumun sonlandırılarak ilk oturum başlangıcına dönüleceği belirtilir.

Başarılı yüklemede şifreli dosya `database.json` olarak sunucuya kaydedilir, yerel veri güncellenir, oturum kapatılır ve login ekranı gösterilir. Başarısız yüklemede mevcut veriler korunur.

### Veritabanını Sil

Veritabanı silme işlemi üç ayrı onay ister. Onay tamamlandığında `database.json` silinir, kredi/taksit/kategori/kullanıcı verileri temizlenir, boş başlangıç durumu oluşturulur, `admin@admin.local / admin123` kullanıcısı hazırlanır ve login ekranı açılır.

Eski bir Node.js süreci yeni DELETE endpoint'ini yüklememişse istemci, temiz başlangıç verisini mevcut `POST /api/save` endpoint'i üzerinden kaydetmeyi dener.

## Veri Saklama ve Şifreleme

Veriler iki yerde tutulur:

1. Sunucu tarafındaki şifreli `database.json`
2. Tarayıcıdaki `localStorage` yedeği

Değişikliklerde veriler otomatik olarak şifrelenip sunucuya gönderilir. Şifreleme akışı AES-GCM, PBKDF2/SHA-256, yeni salt ve yeni IV kullanımına dayanır.

`database.json` doğrudan okunabilir kredi verileri değil, şifreli JSON payload içerir. Dosyayı elle düzenlemek yerine uygulamanın yedekleme ve yükleme işlemleri kullanılmalıdır.

> Güvenlik notu: Şifreleme anahtarı frontend JavaScript içinde bulunduğu için bu yaklaşım kişisel kullanım ve dosyanın doğrudan okunmasını zorlaştırma amacı taşır. Üretim veya çok kullanıcılı kullanım için kimlik doğrulama, yetkilendirme ve şifreleme sunucu tarafına taşınmalıdır.

## API Endpoint'leri

### `POST /api/save`

İstemciden gelen şifreli payload'ı `database.json` dosyasına yazar.

### `DELETE /api/database`

`database.json` dosyasını siler. Dosya bulunmuyorsa da başarılı yanıt verir.

### Statik dosya sunumu

Express, proje klasöründeki HTML, JavaScript, CSS ve JSON dosyalarını statik olarak sunar.

## Proje Dosyaları

```text
KrediTaksitTakip/
├── index.html        Arayüz, formlar, tablolar ve modal frame'ler
├── script.js         Hesaplamalar, kayıt işlemleri ve UI olayları
├── style.css         Tema, responsive düzen ve hover stilleri
├── server.js         Express sunucu ve veritabanı API'leri
├── package.json      Node.js proje bilgileri ve bağımlılıklar
├── package-lock.json npm bağımlılık kilit dosyası
├── database.json     Şifreli veritabanı payload'ı
└── README.md         Kurulum ve kullanım dokümantasyonu
```

## Responsive Kullanım

- Dashboard kartları dar ekranlarda alt alta dizilir.
- Tablo yatay kaydırılabilir.
- Sidebar mobil ekranlarda içerik üzerinde konumlanır.
- Form satırları mobilde tek sütuna düşer.
- Kredi ayrıntı kartları mobil ekranlarda iki veya tek sütuna iner.

## Doğrulama

```powershell
node --check script.js
node --check server.js
```

Projede otomatik test script'i tanımlı değildir. `npm test`, package.json içindeki varsayılan test bulunamadı mesajını döndürür.

## Sorun Giderme

### Port 3000 kullanımda

Başka bir işlem 3000 portunu kullanıyorsa eski Node.js sürecini kapatın veya `server.js` içindeki portu değiştirin. Sonrasında uygulamayı yeni port üzerinden açın.

### `Veritabanı silinemedi` uyarısı

Sunucu kodu değiştirildiğinde eski Node.js süreci eski route'ları kullanabilir. Süreci durdurup yeniden başlatın:

```powershell
node server.js
```

### Veriler yüklenmiyor

- Uygulamayı `http://localhost:3000` üzerinden açtığınızı kontrol edin.
- `database.json` dosyasının proje klasöründe bulunduğunu kontrol edin.
- Yüklenen dosyanın uygulama tarafından oluşturulmuş geçerli şifreli yedek olduğundan emin olun.
- Tarayıcı konsolunda şifre çözme ve ağ hatalarını kontrol edin.

### Login ekranında kalma

```text
E-posta: admin@admin.local
Parola: admin123
```

## Lisans ve Üretim Notu

Proje, mevcut `package.json` bilgileriyle birlikte kullanılmak üzere hazırlanmıştır. Üretim ortamına almadan önce sunucu tarafı kimlik doğrulama, yetkilendirme, güvenli gizli anahtar yönetimi, HTTPS ve düzenli yedekleme politikaları yapılandırılmalıdır.
