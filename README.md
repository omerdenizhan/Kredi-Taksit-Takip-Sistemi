# Kredi & Taksit Takip Sistemi

Modern, güvenli ve kullanıcı dostu bir arayüze sahip olan **Kredi & Taksit Takip Sistemi**, bireysel kredi ve taksitli borçlarınızı kolayca yönetmenizi, analiz etmenizi ve ödeme takviminizi takip etmenizi sağlayan tek dosyalık (`index.html`) gelişmiş bir web uygulamasıdır.

## 🚀 Öne Çıkan Özellikler

* **Gelişmiş Finansal Hesaplama:** Net tutar, ek masraflar, aylık faiz oranı, BSMV ve KKDF oranlarına göre brüt faiz ve aylık taksit hesaplama.
* **Detaylı Ödeme Planı ve Takvimi:** Her bir borç için taksit takvimi, ödenen/ödenmeyen taksit takibi, güncel ay işareti ve dinamik taksit ödendi/geri al butonları.
* **Erken Kapama Analizi:** Güncel gün ve işlenen faizler dahil edilerek anlık erken kapama tutarlarını ve varsa erken kapama indirimlerini hesaplama.
* **Borç Tipi Yönetimi (Özelleştirilebilir Kategoriler):** Borçları kategorize etme, renk ve ikon özelleştirme, sürükle-bırak yöntemi ile sıralama.
* **İnteraktif Grafiksel Analizler (Chart.js):** Pasta grafikler, kayıt bazında detaylı barlar, kümülatif ödeme ve zaman çizelgesi grafikleri.
* **Güvenli Şifreleme ve Veritabanı:** Tarayıcı tarafında **AES-256-GCM** ve **PBKDF2** (100.000 tur SHA-256) algoritmaları ile şifrelenen veritabanı yedeği alma ve geri yükleme.
* **Kişiselleştirme ve Gizlilik:**
  * Koyu (`dark`) ve Açık (`light`) tema desteği.
  * Hassas finansal rakamları tek tuşla maskeleme (Gizleme/Gösterme).
  * Özelleştirilebilir para birimleri ($\text{TRY}$, $\text{USD}$, $\text{EUR}$).
* **Kullanıcı ve Hesap Merkezi:** Profil bilgileri, sosyal medya bağlantı adresleri, güvenlik soruları ile şifre kurtarma mekanizması.

---

## 💾 Depolama ve Çalışma Modları

Uygulama esnek bir mimariyle tasarlanmıştır ve iki farklı kullanım senaryosunu destekler:

1. **Lokal Depolama (LocalStorage) Modu:** Herhangi bir sunucu kurulumu gerektirmeden, doğrudan `index.html` dosyasını tarayıcınızda açarak kullanabilirsiniz. Tüm verileriniz tarayıcınızın `localStorage` alanında şifreli olarak saklanır.
2. **Node.js ve Sunucu (`database.json`) Modu:** Projeyi bir yerel sunucu ortamında çalıştırarak, verilerinizin otomatik olarak sunucu tarafındaki şifreli `database.json` dosyasına kaydedilmesini sağlayabilirsiniz.

---

## 🛠️ Kurulum Aşamaları

Projeyi yerel sunucu ortamında (`database.json` desteğiyle) çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### 1. Gereksinimlerin Yüklenmesi
Sistemin çalışabilmesi için bilgisayarınızda **Node.js** yüklü olmalıdır. Eğer yüklü değilse [Node.js Resmi Web Sitesi](https://nodejs.org/) üzerinden LTS sürümünü indirip kurun (Bu işlemle birlikte `npm` paket yöneticisi de otomatik olarak yüklenecektir).

### 2. Proje Klasörünün Hazırlanması
Proje dosyalarınızı (`index.html`, `favicon.ico` ve varsa sunucu betiği) bilgisayarınızda boş bir klasöre kopyalayın.

### 3. Bağımlılıkların Yüklenmesi (`npm install`)
Terminal veya komut satırını açarak proje klasörünün içine gidin ve gerekli paket yönetimi ayarlarını yapın:

```bash
# Proje dizininde paket tanımlama dosyasını oluşturun (veya mevcut package.json dosyasını kullanın)
npm init -y

# Gerekli sunucu paketlerini (Örn: Express) yükleyin
npm install express
```

### 4. Uygulamanın Başlatılması
Sunucu betiğinizi çalıştırarak uygulamayı ayağa kaldırın:

```bash
node server.js
```

Tarayıcınızı açarak `http://localhost:3000` (veya kullandığınız port adresi) üzerinden şifreli `database.json` entegrasyonuyla tam sürüm olarak uygulamayı kullanmaya başlayabilirsiniz.