# Archivio Documentale Calatabiano — prototipo Android

Questa cartella conserva un contenitore **Android di prova** dell'Archivio Documentale Calatabiano (ADC). È distinta dall'app web installabile su Android, iOS, iPadOS, Windows, macOS e Linux, disponibile in `/adc/installa/`.

**Identità:** `it.michelebottino.adc`; nessun collegamento a opere o sezioni del sito personale. I quattro accessi puntano soltanto a `/adc/`.

Il prototipo Capacitor apre le sezioni ADC nel browser: non equivale a una app nativa completa e non comprende un archivio offline. Per la consultazione multi-dispositivo, usare la PWA dedicata con manifest `/adc/manifest.webmanifest` e service worker `/adc/sw.js`.

## Preparazione APK di test

Richiede Node.js, Android SDK e Java compatibili con Capacitor 8. Dalla cartella `app-android`:

```sh
npm install
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

La compilazione e il collaudo su telefono reale sono operazioni separate. Non memorizzare chiavi di firma nel repository. Non rivendicare l'avvenuta pubblicazione su uno store.
