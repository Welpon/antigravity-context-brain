# Katkıda Bulunma (Contributing)

Pull Request'ler, hata bildirimleri ve özellik önerileri her zaman memnuniyetle karşılanır!

## Geliştirme Ortamı

1. Bu depoyu **Fork** edin ve yerel bilgisayarınıza klonlayın:
   ```bash
   git clone https://github.com/<KULLANICI_ADIN>/antigravity-context-window.git
   cd antigravity-context-window
   npm install
   ```
2. Yeni bir dal (branch) açın:
   ```bash
   git checkout -b feat/yeni-ozellik
   ```
3. Arayüz (`ui/app.js`, `ui/styles.css`) değişikliklerinden sonra tek dosya HTML çıktısını yeniden derleyin:
   ```bash
   npm run build:ui
   ```
4. Değişikliklerinizi test edin:
   - Eklenti klasörünü `~/.gemini/config/plugins/context-window` altında deneyebilirsiniz.
   - `server/` değişiklikleri için Antigravity **MCP Servers** ayarlarından `context-window` sunucusunu yeniden başlatın.
5. Değişikliklerinizi commit edip **Pull Request** açın:
   ```bash
   git add .
   git commit -m "feat: açıklayıcı özet"
   git push origin feat/yeni-ozellik
   ```

## Kurallar
- Kişisel dosya yolları, API anahtarları veya yerel kullanıcı adları eklemeyin (`os.homedir()` kullanın).
- Yeni arayüz metinleri için hem `tr` hem `en` çevirilerini `ui/app.js` içindeki `I18N` sözlüğüne ekleyin.
- `ui/` dosyalarını güncellediyseniz `npm run build:ui` ile güncellenmiş `server/app.html` dosyasını da PR'a dahil edin.
