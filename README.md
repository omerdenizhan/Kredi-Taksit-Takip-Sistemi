# Kredi & Taksit Takip Sistemi

Modern, güvenli ve kullanıcı dostu bir arayüze sahip olan **Kredi & Taksit Takip Sistemi**, bireysel kredi ve taksitli borçlarınızı kolayca yönetmenizi, analiz etmenizi ve ödeme takviminizi takip etmenizi sağlayan tek dosyalık ($index.html$) gelişmiş bir web uygulamasıdır.

---

## 🚀 Öne Çıkan Özellikler

- **Gelişmiş Finansal Hesaplama:** Net tutar, ek masraflar, aylık faiz oranı, BSMV ve KKDF oranlarına göre brüt faiz ve aylık taksit hesaplama.
- **Detaylı Ödeme Planı ve Takvimi:** Her bir borç için taksit takvimi, ödenen/ödenmeyen taksit takibi, güncel ay işareti ve dinamik taksit ödendi/geri al butonları.
- **Erken Kapama Analizi:** Güncel gün ve işlenen faizler dahil edilerek anlık erken kapama tutarlarını ve varsa erken kapama indirimlerini hesaplama.
- **Borç Tipi Yönetimi (Özelleştirilebilir Kategoriler):** Borçları kategorize etme, renk ve ikon özelleştirme, sürükle-bırak yöntemi ile sıralama.
- **İnteraktif Grafiksel Analizler (Chart.js):** Pasta grafikler, kayıt bazında detaylı barlar, kümülatif ödeme ve zaman çizelgesi grafikleri.
- **Güvenli Şifreleme ve Veritabanı:** Tarayıcı tarafında **AES-256-GCM** ve **PBKDF2** (100.000 tur SHA-256) algoritmaları ile şifrelenen veritabanı yedeği alma (`database.json`) ve geri yükleme.
- **Kişiselleştirme ve Gizlilik:** 
  - Koyu (Dark) ve Açık (Light) tema desteği.
  - Hassas finansal rakamları tek tuşla maskeleme (Gizleme/Gösterme).
  - Özelleştirilebilir para birimleri ($\text{TRY}$, $\text{USD}$, $\text{EUR}$).
- **Kullanıcı ve Hesap Merkezi:** Profil bilgileri, sosyal medya bağlantı adresleri, güvenlik soruları ile şifre kurtarma mekanizması.

---

## 🛠️ Kurulum Aşamaları

Uygulama **tek bir HTML dosyasından** ($index.html$) oluştuğu için kurulumu son derece basittir. Herhangi bir karmaşık derleme işlemine gerek yoktur.

### Yöntem 1: Doğrudan Tarayıcıda Çalıştırma (Lokal Depolama)
1. Proje klasöründeki `index.html` dosyasını bilgisayarınıza indirin.
2. Dosyaya çift tıklayarak herhangi bir modern web tarayıcısında (**Google Chrome**, **Mozilla Firefox**, **Microsoft Edge**, **Safari**) açın.
3. Varsayılan yönetici bilgileriyle giriş yapın:
   - **E-posta:** `admin@admin.local`
   - **Parola:** `admin123`

### Yöntem 2: Yerel Sunucu veya Node.js ile Çalıştırma
Eğer uygulamanın otomatik sunucu kaydı özelliklerini tam anlamıyla test etmek istiyorsanız:
1. Proje dizininde bir sunucu ortamı hazırlayın (Örn. Express.js tabanlı `/api/save` uç noktalarını destekleyen bir arka plan servisi).
2. `index.html` dosyasını kök dizine yerleştirin.
3. Projeyi yerel sunucunuz üzerinden başlatın ve tarayıcınızda görüntüleyin.

---

## ⚙️ İlk Kullanım ve Ayarlar

1. **Giriş Yapın:** Varsayılan hesap bilgileriyle sisteme giriş yaptıktan sonra üst menüden **Ayarlar** butonuna tıklayın.
2. **Kullanıcı Profilinizi Güncelleyin:** "Kullanıcı Profili ve Hesap Merkezi" sekmesinden adınızı, e-postanızı ve güvenlik sorularınızı güncelleyerek hesabınızı güvene alın.
3. **Borç Tiplerini Düzenleyin:** "Tanımlamalar" sekmesinden kendi borç türlerinizi (Konut, Taşıt vb.) ekleyin veya ikonlarını özelleştirin.
4. **Yeni Kayıt Ekleyin:** Ana ekrandaki **Yeni Kayıt** butonunu kullanarak ilk kredi veya taksitli borcunuzu sisteme ekleyin.

---

## 🔒 Güvenlik Notları
- Tüm hassas verileriniz tarayıcınızın `localStorage` alanında ve indirilen `database.json` yedeklerinde şifreli olarak saklanır.
- Şifrenizi unuttuğunuzda giriş ekranındaki **Şifremi Unuttum?** bağlantısını kullanarak belirlediğiniz güvenlik sorusuyla parolanızı sıfırlayabilirsiniz.

---
*© Ömer Denizhan — Kredi & Taksit Takip Sistemi*