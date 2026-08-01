# CashControl – Bargeld Rationierer & Impulsschutz

Installierbare PWA (Progressive Web App). Läuft komplett lokal im Browser,
keine Server-Komponente nötig – GitHub Pages liefert nur die statischen Dateien.

## Warum GitHub Pages nötig ist

`localStorage` und die "Zum Startbildschirm hinzufügen"-Funktion von Android
funktionieren auf Dauer nur zuverlässig, wenn die Seite über eine echte
`https://`-Adresse (Origin) geladen wird – nicht als lokale Datei (`file://`).
GitHub Pages liefert genau das kostenlos.

## Einrichtung (einmalig)

1. Neues **öffentliches** GitHub-Repository anlegen, z. B. `cashcontrol`.
2. Diese vier Dateien/Ordner in das Repo hochladen (per Weboberfläche "Add file → Upload files" reicht, kein Terminal nötig):
   - `index.html`
   - `manifest.json`
   - `service-worker.js`
   - `icons/icon-192.png`, `icons/icon-512.png`
3. Im Repo: **Settings → Pages → Source: "Deploy from a branch"**, Branch `main`, Ordner `/ (root)` → Save.
4. Nach ca. 1 Minute ist die App erreichbar unter:
   `https://<dein-github-name>.github.io/cashcontrol/`

Alternativ per Git-Kommandozeile:
```bash
cd cashcontrol-pwa
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<dein-name>/cashcontrol.git
git push -u origin main
```

## Installation auf dem Samsung Galaxy S25

1. Die GitHub-Pages-URL im **Chrome** oder **Samsung Internet** Browser öffnen.
2. Es erscheint automatisch ein Banner "App installieren" – oder manuell über
   Browser-Menü (⋮) → **"App installieren"** bzw. **"Zum Startbildschirm hinzufügen"**.
3. App startet danach im Vollbild ohne Browserleiste, mit eigenem Icon.

## Wichtig: Datensicherung

Die Daten liegen ausschließlich lokal auf dem Gerät (`localStorage`), es gibt
**keine Cloud-Synchronisation**. Das heißt:

- Bei Reset des Handys, Deinstallation der App oder "Browserdaten löschen" gehen die Daten verloren.
- Nutze regelmäßig den **Export**-Button oben rechts, um ein JSON-Backup zu speichern (z. B. monatlich, oder automatisiert über Google Drive/Dateien-App-Backup).
- Mit **Import** lässt sich ein Backup jederzeit wiederherstellen – auch auf einem neuen Gerät.

## Änderungen gegenüber der ursprünglichen Version

- Bug: defekter `<script src="[...]">`-Tag für Tailwind CDN korrigiert (war als Markdown-Link eingefügt und hätte die Seite komplett leer/ungestyled geladen).
- PWA-Grundgerüst ergänzt: `manifest.json`, `service-worker.js`, Icons, Meta-Tags → installierbar & offline-fähig.
- Fehlende JavaScript-Funktionen ergänzt (`openModal`, `closeModal`, `formatEuro`, `handleAddExpense`, `handleAddIncome`, Warn-Dialog-Logik, `renderTransactions`-Ende) – im Originalcode war die Datei abgeschnitten.
- Neu: Ausgaben können jetzt einzeln gelöscht werden (falls ein Fehleintrag verbucht wird) – korrigiert den Bargeldbestand automatisch mit.
- Neu: Schutz gegen negativen Bargeldbestand (Ausgabe > Bestand löst jetzt eine Warnung aus, statt den Bestand unbemerkt ins Minus zu buchen).
- Neu: Monatsauswahl bei der Kategorien-Übersicht, damit auch vergangene Monate einsehbar bleiben (bisher nur "dieser Monat").
- Neu: JSON-Backup-Export/Import als Datensicherung, da keine Cloud-Anbindung existiert.
- Neu: Toast-Benachrichtigungen statt stiller Buchungen.
- Automatische Migration vorhandener Daten aus dem alten `localStorage`-Schlüssel, falls die Vorversion bereits genutzt wurde.
