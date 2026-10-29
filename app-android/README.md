# Michele Bottino — prototipo Android
Questo progetto è separato dal sito GitHub Pages. È uno **scheletro Capacitor 8**, non ancora un APK né un'app pubblicata.

## Compilazione
Richiede Node.js compatibile con Capacitor 8, Android Studio e Android SDK. Dalla cartella app-android:

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

Per ottenere una build di debug usare Android Studio sul progetto generato. Non inserire chiavi di firma nel repository.

## Comportamento
Il contenitore mostra una schermata locale con quattro ingressi e apre il sito pubblico nel browser. Nessun archivio viene duplicato; i link online richiedono rete. Questo è un **prototipo tecnico**, non ancora la UX definitiva né un'app conforme ai criteri degli store.

## Passaggi mancanti
Generare e collaudare il progetto Android, integrare l'icona premium nelle risorse native, verificare navigazione/accessibilità/privacy, produrre APK di test e valutare la distribuzione.
