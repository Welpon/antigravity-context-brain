# Antigravity Context Window & Hafıza Eklentisi

Google Antigravity için **Canlı Context Window İzleyici** ve **Taşınabilir Markdown Hafıza Kasası** (MCP App) eklentisi.

- **Sıfır ek maliyet (0 token / 0 harici API):** Tüm analiz, grafik, Türkçe/İngilizce arayüz ve arama tamamen yerel çalışır.
- **Yan Panel + Sol Menü + Sohbet İçi:** Antigravity'nin her yerinden tek tıkla açılır.
- **TR / EN Dil Desteği:** Tek tıkla tüm arayüz Türkçe ve İngilizce arasında geçiş yapar.

---

## Özellikler

### 1. İzleyici (Monitor)
- **Gerçek Token Telemetrisi:** Antigravity konuşma transkriptlerinden gerçek `input_tokens`, `cache_read_tokens` ve `output_tokens` verilerini okur.
- **Önbellek / Önbelleksiz Çift Renkli Bar:** Toplam doluluk yüzdesi, satır içi limit seçici (`128K`–`2M`), önbellek isabet oranı ve kalan token alanı.
- **Çift Çizgili Zaman Çizelgesi:** Yeşil çizgiyle toplam bağlam büyümesini, mavi çizgi/alanla önbellek kullanımını ve önbellek ıskalarını (cache miss) gösterir.
- **En Büyük Sıçramalar (Top Spikes):** Gerçek turdan tura token artışlarını (`+15.1B`) ve hangi araç/dosyalardan kaynaklandığını listeler; satıra tıklayınca o turda çalışan tüm araçları açar.
- **En Ağır Adımlar & Kategori Dağılımı:** En çok yer kaplayan 10 adımı sade özetlerle ve Sistem / Araçlar / Kullanıcı / Model / Düşünme dağılımıyla gösterir.

### 2. Hafıza (Memory)
Tüm kayıtlar düz `.md` dosyaları olarak `~/Antigravity-Beyin` klasöründe otomatik oluşturulur (Claude Code, Codex, Cursor, Obsidian ve Git ile tam uyumlu):
- **💾 Oturum Kaydet (`oturumlar/`):** Son işin sonucu, açık konular ve sonraki adımı kaydedip yeni oturumda tek tıkla devam edin.
- **✅ Görev Ekle (`gorevler/`):** Oturumlar arası yapılacaklar listesi ve tek tıkla tamamlama.
- **🧭 Karar Ekle (`kararlar/`):** Alınan kararları ve gerekçelerini saklayın.
- **⚡ Yakala (`gelen-kutusu/`):** Video, makale, dosya veya notları gelen kutusuna alın.
- **📦 Paket Ekle:** Birden fazla yerel proje dosyasını ve kuralı tek pakette gruplayıp tek tıkla sohbete ekleyin (`📎 Bağlama Ekle` / `↗ Gönder`).
- **🔍 Akıllı Arama & Dosya Açma:** Türkçe/İngilizce soru kalıplarını ayıklayarak arama yapar; **`📂 Dosyayı Aç`** ile notu doğrudan Antigravity yan panelinde açar.

---

## Kurulum

**Gereksinim:** Node.js 18+

### Windows (PowerShell)
```powershell
git clone https://github.com/<KULLANICI_ADIN>/antigravity-context-window.git "$env:USERPROFILE\.gemini\config\plugins\context-window"
cd "$env:USERPROFILE\.gemini\config\plugins\context-window"
npm install
```

### macOS / Linux
```bash
git clone https://github.com/<KULLANICI_ADIN>/antigravity-context-window.git ~/.gemini/config/plugins/context-window
cd ~/.gemini/config/plugins/context-window && npm install
```

### Git Kullanmadan (ZIP ile)
1. Bu sayfadan **Code → Download ZIP** seçeneğiyle indirin.
2. Arşivi `~/.gemini/config/plugins/context-window` klasörüne çıkarın.
3. Klasörde bir terminal açıp `npm install` çalıştırın.

Antigravity eklentiyi otomatik olarak tanır. **Yan Panel (`+` → Context Window)** veya **Sol Menü (Plugins → Context Window)** üzerinden hemen açabilirsiniz.

### Hafıza Klasörünü Özelleştirme (İsteğe Bağlı)
Eklenti ilk açılışta `~/Antigravity-Beyin` klasörünü otomatik oluşturur. Farklı bir klasör kullanmak için `ANTIGRAVITY_VAULT_DIR` ortam değişkenini tanımlayabilirsiniz.

---

## Katkıda Bulunma (Pull Request)
Katkılarınızı bekliyoruz! Ayrıntılar için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına göz atabilirsiniz.

## Lisans
[MIT](LICENSE)
