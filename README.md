# Kobalt

### Dein Forum. Deine Community. Dein Stil.

**Kobalt** ist ein Theme für Flarum 2 mit einer modernen Kartenansicht, weichen Rundungen und einer klaren Gestaltung rund um die Akzentfarbe **`#4d698e`**. Es verbindet Diskussionen, Softwareprojekte und Community-Funktionen zu einer gemeinsamen Oberfläche.

Im **Kobalt Studio** gestaltest du Navigation, Banner, Empfehlungen, Projektkarten und Layout direkt im Adminbereich. Persönliche Schnellzugriffe, ein Einstiegspfad und ein Lesemodus ergänzen das Forum für seine Besucher.

**Paket:** `el-choco/kobalt` · **Stand:** `0.1.0-alpha.14` · **Lizenz:** MIT

> Kobalt befindet sich in der Alpha-Phase. Die Composer-Befehle für Packagist gelten erst, sobald das Paket und die angegebene Version dort veröffentlicht sind. Bis dahin verwende die [Installation aus dem ZIP](#installation-aus-dem-zip).

![Kobalt – Desktop-Vorschau mit Beispieldaten](preview/desktop.png)

[Interaktive Vorschau](preview/index.html) · [Mobile Vorschau](preview/mobile.png) · [Lizenz](LICENSE)

Die Vorschau verwendet Beispieldaten. Im installierten Forum erscheinen deine Inhalte und die aktivierten Erweiterungen. Die HTML-Vorschau lässt sich nach dem Herunterladen lokal im Browser öffnen; GitHub zeigt sie als Quelldatei an.

## Inhalt

- [Funktionen](#funktionen)
- [Voraussetzungen](#voraussetzungen)
- [Installation mit Composer](#installation-mit-composer)
- [Installation aus dem ZIP](#installation-aus-dem-zip)
- [Kobalt Studio](#kobalt-studio)
- [Erweiterungen und Integrationen](#erweiterungen-und-integrationen)
- [Aktualisieren](#aktualisieren)
- [Datenspeicherung und Berechtigungen](#datenspeicherung-und-berechtigungen)
- [Häufige Fragen](#häufige-fragen)
- [Entwicklung](#entwicklung)

## Funktionen

### Eine neue Bühne für deine Community

- Abgerundete Diskussionskarten mit Autorenzeile, Datum und vorhandenen Beitragsauszügen.
- Konfigurierbare Akzentfarbe, Feedbreite, Rundung und Kartenabstände.
- Helle und dunkle Darstellung passend zum aktiven Flarum-Farbschema.
- Anpassbarer Startseitenbanner mit drei Hintergrundstilen und optionalem Glas-Look.
- Fokus-Karte für wichtige Inhalte direkt im Banner.
- Bis zu drei zentrale Orbit-Schnellzugriffe in der Kopfzeile.
- Widget-Leiste oberhalb des Feeds; auf kleinen Bildschirmen horizontal scrollbar.
- Konfigurierbarer Footer mit Infobereich, vier Linkspalten und Social-Links.
- Kompakter Bereich zum Starten einer Diskussion.
- Optionale Aktionsleiste für Antworten, Reaktionen und Teilen.
- Kategorienfarben als Kartenakzent und ein eigener roter Rand für Super-Sticky-Themen.

### Inhalte gezielt hervorheben

- Empfehlungskarte für eine vorhandene Diskussion oder eigene Inhalte mit Text, Bild und Link.
- Bis zu drei Software-Projektkarten mit Version, Download, Anleitung, Support und Quellcode.
- Optionale Übernahme der veröffentlichten Version und Dateiseite aus Depot.
- Werkzeugkasten im geöffneten Software- oder Support-Thema.
- Kategoriehinweise mit frei wählbarem Text und optionalem Link.
- Unterschiedliche Ergänzungen für Support-, Anleitungs- und Software-Themen.

### Mehr Orientierung für Mitglieder

- **Mein Arbeitsplatz:** bis zu acht persönliche Schnellzugriffe, einschließlich direkt angehefteter Diskussionen.
- **Einstieg:** bis zu fünf selbst abhakbare Schritte für neue Besucher.
- **Seit deinem letzten Besuch:** eine Auswahl neuer Themen, neuer Antworten und aktualisierter Depot-Downloads.
- **Support-Filter:** Alle, Offen und Gelöst mit FoF Best Answer.
- **Meine Themen:** Diskussionen aus verfolgten Kategorien mit FoF Follow Tags.
- **Lesemodus:** weniger seitliche Ablenkung sowie wählbare Schriftgröße und Zeilenabstände.
- **Anleitungsübersicht:** Sprungziele zu Überschriften im ersten geladenen Beitrag.

### Direkt im Adminbereich einrichten

Das Kobalt Studio enthält zehn Bereiche mit Live-Vorschau. Die Oberflächenübersetzungen für **Deutsch und Englisch** sind enthalten. Für die jeweilige Forumssprache muss das passende Flarum-Sprachpaket installiert und aktiviert sein.

## Voraussetzungen

| Voraussetzung | Unterstützter Bereich |
| --- | --- |
| Flarum | `^2.0.2` – ab 2.0.2 innerhalb der 2.x-Reihe |
| PHP | `^8.3` – PHP 8.3 und spätere 8.x-Versionen |
| Composer | Für Installation und Updates |
| Browser | Aktueller Browser mit Unterstützung für moderne CSS-Funktionen |

**Flarum 1.8 wird von Kobalt nicht unterstützt.** Kobalt benötigt weder die Admin Console noch einen eigenen Worker oder Cronjob. Zusätzliche Erweiterungen sind für die Grundgestaltung nicht erforderlich.

Die Versionsanforderungen geben den zulässigen Bereich an, keine vollständige Testmatrix aller zukünftigen Versionen. Lokale Prüfungen wurden mit Flarum 2.0.2 durchgeführt; neue Kombinationen sollten zunächst in einer Testinstallation geprüft werden.

## Installation mit Composer

> Dieser Abschnitt ist für die spätere Veröffentlichung auf Packagist vorbereitet. Aktuell ist die ZIP-Installation der verfügbare Weg. Falls du bisher eine lokale Kobalt-Paketquelle verwendest, beachte vor einem Wechsel den Abschnitt [Aktualisieren](#aktualisieren).

### Normale Flarum-2-Installation

Die Befehle im Hauptverzeichnis deines Forums als dessen Installationsbenutzer ausführen. Das Beispiel verwendet `/var/www/flarum` und `www-data`.

```bash
cd /var/www/flarum
runuser -u www-data -- composer require el-choco/kobalt:"0.1.0-alpha.14" --update-no-dev --minimal-changes --no-scripts --no-interaction
```

Nach erfolgreicher Installation:

1. Im Adminbereich unter **Erweiterungen** das bisherige Theme deaktivieren.
2. **Kobalt** aktivieren.
3. Den Cache neu aufbauen:

```bash
cd /var/www/flarum
runuser -u www-data -- php flarum cache:clear --force
```

Falls PHP alte Dateien im OPcache behält, den zu deiner Installation gehörenden PHP-FPM-Dienst neu laden. Anschließend das Forum im Browser neu laden.

### CrazyMax mit Docker Compose

Dieses Beispiel verwendet den Compose-Dienst **`flarum`**, den Container-Benutzer **`flarum`** und das Flarum-Verzeichnis **`/opt/flarum`**. Die Befehle auf dem Docker-Host im Verzeichnis der tatsächlich verwendeten Compose-Datei ausführen.

Bei Portainer die zum laufenden Stack gehörende Konfiguration verwenden. Für die Theme-Installation ist kein erneutes Bereitstellen des Stacks nötig.

```bash
cd /mnt/wdblue/flarum2

docker compose exec -T --user flarum \
  --env COMPOSER_HOME=/data/extensions/composer-home \
  --workdir /opt/flarum flarum \
  composer require el-choco/kobalt:"0.1.0-alpha.14" \
  --update-no-dev --minimal-changes --no-scripts --no-interaction && \
docker compose exec -T --user flarum flarum extension sync
```

`extension sync` übernimmt nach der erfolgreichen Paketinstallation die Erweiterungsliste für die CrazyMax-Persistenz. Das persistente `/data`-Volume beibehalten.

Danach das bisherige Theme deaktivieren, Kobalt im Adminbereich aktivieren und ausführen:

```bash
docker compose exec -T --user flarum --workdir /opt/flarum \
  flarum php flarum cache:clear --force && \
docker compose exec -T flarum s6-svc -r /run/service/php-fpm
```

Der zweite Befehl startet PHP-FPM im CrazyMax-Container neu, damit die neue Paketversion geladen wird. Dabei können Webanfragen kurz unterbrochen sein. Anschließend das Forum neu laden.

**Keine lokale Compose-Datei verfügbar?** Beim bekannten Container `flarum2-flarum-1` entspricht beispielsweise `docker compose exec -T --user flarum --workdir /opt/flarum flarum ...` dem Aufruf `docker exec --user flarum --workdir /opt/flarum flarum2-flarum-1 ...`. Dienst- und Containername sind unterschiedliche Angaben.

Die CrazyMax-Befehle `extension sync` und `s6-svc` gelten für dieses Image. Bei anderen Docker-Images sind deren Installationsbenutzer, Persistenz und PHP-Dienstverwaltung maßgeblich.

## Installation aus dem ZIP

Die Datei `kobalt-0.1.0-alpha.14.zip` enthält den fertigen Browser-Build. Node.js wird auf dem Forumserver nicht benötigt.

### CrazyMax / Docker Compose

Die ZIP zunächst nach `/tmp/kobalt-0.1.0-alpha.14.zip` auf den Docker-Host übertragen. Das Beispiel setzt den bestehenden Mount `/mnt/wdblue/flarum2/data:/data` voraus.

```bash
install -d -m 755 /mnt/wdblue/flarum2/data/theme-sources
unzip /tmp/kobalt-0.1.0-alpha.14.zip -d /mnt/wdblue/flarum2/data/theme-sources
cd /mnt/wdblue/flarum2

docker compose exec -T --user flarum flarum \
  test -r /data/theme-sources/kobalt-0.1.0-alpha.14/composer.json
```

Nur wenn die Datei im Container lesbar ist, die lokale Composer-Quelle eintragen und installieren:

```bash
docker compose exec -T --user flarum \
  --env COMPOSER_HOME=/data/extensions/composer-home \
  --workdir /opt/flarum flarum \
  composer config --global repositories.kobalt \
  '{"type":"path","url":"/data/theme-sources/kobalt-0.1.0-alpha.14","options":{"symlink":false,"versions":{"el-choco/kobalt":"0.1.0-alpha.14"}}}' && \
docker compose exec -T --user flarum \
  --env COMPOSER_HOME=/data/extensions/composer-home \
  --workdir /opt/flarum flarum \
  composer require el-choco/kobalt:"0.1.0-alpha.14" \
  --update-no-dev --minimal-changes --no-scripts --no-interaction && \
docker compose exec -T --user flarum flarum extension sync
```

Danach Kobalt aktivieren sowie Cache und PHP-FPM wie im [Docker-Abschnitt](#crazymax-mit-docker-compose) neu laden. Den Quellordner unter `/data/theme-sources` behalten, solange Composer darauf verweist. Ein zusätzlicher Container-Mount ist bei diesem Beispiel nicht nötig.

### Normale Flarum-2-Installation

Die ZIP außerhalb des öffentlichen Web-Verzeichnisses entpacken. Beispiel für `/var/www/flarum` mit `www-data`:

```bash
install -d -m 755 /var/www/flarum-theme-sources
unzip /tmp/kobalt-0.1.0-alpha.14.zip -d /var/www/flarum-theme-sources
cd /var/www/flarum

runuser -u www-data -- composer config repositories.kobalt \
  '{"type":"path","url":"/var/www/flarum-theme-sources/kobalt-0.1.0-alpha.14","options":{"symlink":false,"versions":{"el-choco/kobalt":"0.1.0-alpha.14"}}}' && \
runuser -u www-data -- composer require el-choco/kobalt:"0.1.0-alpha.14" \
  --update-no-dev --minimal-changes --no-scripts --no-interaction
```

Anschließend das bisherige Theme deaktivieren, Kobalt aktivieren und den Cache als `www-data` mit `php flarum cache:clear --force` neu aufbauen. Den Quellordner behalten, solange die lokale Paketquelle verwendet wird.

## Kobalt Studio

Öffne **Administration → Erweiterungen → Kobalt**.

Die Live-Vorschau zeigt deine noch nicht gespeicherten Entwurfswerte mit Beispieldaten. Erst **Änderungen speichern** übernimmt sie in die Flarum-Einstellungen. Danach die Forumsseite neu laden. **Standardwerte einsetzen** füllt das Formular mit den Vorgaben; auch diese müssen gespeichert werden.

### 1. Orbit – deine Schnellzugriffe

Bis zu drei Links in der mittleren Kopfzeilennavigation. Pro Link legst du Beschriftung und Ziel fest. Leere Ziele und nicht vorhandene benannte Routen werden im Forum ausgeblendet.

| Beispielziel | Bedeutung |
| --- | --- |
| `@index` | Flarums registrierte Index-Route |
| `@depot.index` | Depot-Übersicht, wenn die Route verfügbar ist |
| `@tags` | Kategorienübersicht, wenn die Route verfügbar ist |
| `downloads` | Adresse relativ zur Basisadresse deines Forums |
| `/downloads` | Adresse relativ zur Domainwurzel |
| `https://example.org/handbuch` | Externer HTTPS-Link |

Bei einer Installation in einem Unterverzeichnis auf den Unterschied zwischen relativen Adressen und Adressen mit führendem `/` achten. Externe Ziele müssen HTTPS verwenden.

### 2. Bühne – Banner und Fokus-Karte

- Startseitenbanner ein- oder ausblenden.
- Eigene Überschrift und Beschreibung festlegen. Leere Felder verwenden die vorhandenen Forumstexte.
- Hintergrundstil wählen: **Umlaufbahnen**, **Raster** oder **Farbverlauf**.
- Optionalen Glas-Look aktivieren.
- Fokus-Karte mit Rubrik, Titel, Beschreibung, Linktext und Ziel gestalten.

Die Fokus-Karte eignet sich für einen wichtigen Download, eine Ankündigung oder dein Handbuch. Kobalt kann den Startseitenbanner auch anzeigen, wenn der normale Flarum-Willkommensbereich bereits geschlossen wurde.

### 3. Empfehlung – einen Inhalt in den Mittelpunkt stellen

Wähle zwischen zwei Quellen:

- **Eigene Inhalte:** Titel, Kurztext, optionales Bild und Zieladresse.
- **Vorhandene Diskussion:** ID, Slug oder Themenlink aus deinem Forum. Ein leerer Titel verwendet den Diskussionstitel.

Beispielsweise verweisen `28`, `28-serverlotse` und `/d/28-serverlotse` auf dasselbe Thema. Im Diskussionsmodus wird die Karte nur angezeigt, wenn dessen Titel über die API mit den Rechten des Besuchers geladen werden kann.

### 4. Projekte – deine Software auf einen Blick

Bis zu drei Projektkarten mit:

- Projektname und manuell gepflegter Version.
- Download-, Anleitungs-, Support- und Quellcode-Link.
- Optionalem Depot-Slug für die veröffentlichte Version und den Link zur Dateiseite.

Ein leerer Projektname blendet die Karte aus. Der Depot-Slug ist der Teil nach `/downloads/f/` in der Dateiadresse. Ohne verfügbare Depot-Daten bleibt die manuell eingetragene Version erhalten.

Projektkarten lassen sich zusätzlich als Werkzeugkasten in einem Thema anzeigen. Dazu entweder den passenden Support-Themenlink eintragen oder das Projekt einer Kategorie mit der Darstellungsart **Software** zuordnen und den Werkzeugkasten unter **Erlebnis** einschalten.

### 5. Community – Aktivitäten und gezielte Ansichten

**Seit deinem letzten Besuch** zeigt angemeldeten Mitgliedern eine begrenzte Auswahl neuer Diskussionen, neuer Antworten und aktueller Depot-Veröffentlichungen. Der erste Besuch legt einen Ausgangspunkt an. Nach mindestens 30 Minuten Abstand zwischen Startseitenaufrufen beginnt ein neues Besuchsfenster. Die Übersicht ist eine Orientierung und kein vollständiges Aktivitätsprotokoll.

**Support-Filter** ergänzt Alle, Offen und Gelöst in Kategorien, die über FoF Best Answer als Frage und Antwort eingerichtet sind. Bei verfügbarer bester Antwort gibt es einen direkten Lösungslink.

**Meine Themen** ergänzt für angemeldete Mitglieder eine Ansicht der Diskussionen in den Kategorien, denen sie mit FoF Follow Tags folgen.

### 6. Erlebnis – persönliche Funktionen einschalten

| Funktion | Wirkung |
| --- | --- |
| Mein Arbeitsplatz | Bis zu acht persönliche Schnellzugriffe auf der Startseite; Diskussionen direkt im Thema anheften oder wieder lösen |
| Einstieg | Die unter Einstieg konfigurierten Schritte auf der Startseite anzeigen |
| Lesemodus | Im Thema seitliche Navigation ausblenden und Schriftgröße sowie Zeilenabstand wählen |
| Werkzeugkasten | Passende Projektinformationen im geöffneten Thema anzeigen |
| Kategoriehinweise | Die unter Kategorien hinterlegten Hinweise anzeigen |
| Inhaltsabhängige Darstellung | Die unter Kategorien gewählten Ergänzungen für Support, Anleitung oder Software aktivieren |

Diese sechs Funktionen sind standardmäßig ausgeschaltet und können unabhängig voneinander aktiviert werden.

Der Arbeitsplatz steht angemeldeten Mitgliedern zur Verfügung. Im Lesemodus gibt es **15, 17 oder 19 Pixel** Schriftgröße und **1,6, 1,8 oder 2** als Zeilenabstand. Der Modus endet beim Verlassen des Themas; die gewählten Größen bleiben im Browser gespeichert.

### 7. Einstieg – deine Besucher an die Hand nehmen

Erstelle bis zu fünf Schritte, jeweils mit **Titel** und **Zieladresse**. Nur vollständig ausgefüllte Einträge erscheinen. Aktiviere anschließend den Einstieg unter **Erlebnis**.

Ein Beispiel für eine Software-Community:

| Schritt | Titel | Ziel |
| --- | --- | --- |
| 1 | Willkommen im Forum | Deine Willkommensdiskussion |
| 2 | Unsere Regeln lesen | Deine Nutzungsbedingungen |
| 3 | Werkzeuge entdecken | Die Downloadübersicht |
| 4 | Stelle dich vor | Eine Vorstellungsdiskussion |
| 5 | Dein erstes Projekt | Eine passende Anleitung |

Besucher haken erledigte Schritte selbst ab. Das Öffnen eines Links setzt keinen Haken. Werden Text oder Ziel eines Schritts geändert, gilt dieser als neuer Schritt und muss erneut abgehakt werden. Auch Gäste können die Checkliste im jeweiligen Browser verwenden.

### 8. Kategorien – passende Informationen am passenden Ort

Bis zu drei Regeln lassen sich einem Kategorie-Slug zuordnen. Bei `/t/docker` ist der Slug `docker`. Trage den Slug ein, nicht die vollständige URL. Wenn ein Thema mehrere passende Kategorien hat, gilt die erste konfigurierte Regel.

Jede Regel enthält einen optionalen Hinweistext mit Link sowie eine Darstellungsart:

| Darstellung | Ergänzung im Thema |
| --- | --- |
| Standard | Keine zusätzliche inhaltsbezogene Darstellung |
| Support | Offen/Gelöst und gegebenenfalls ein Link zur besten Antwort; benötigt FoF Best Answer |
| Anleitung | Inhaltsverzeichnis aus den `h2`- und `h3`-Überschriften des geladenen ersten Beitrags |
| Software | Werkzeugkasten mit dem zugeordneten Projekt, sofern aktiviert |

Hinweise erscheinen sowohl in der Kategorieansicht als auch in zugehörigen Themen. Aktiviere **Kategoriehinweise** beziehungsweise **inhaltsabhängige Darstellung** unter **Erlebnis**.

Das Anleitungs-Inhaltsverzeichnis zeigt bis zu 30 Überschriften. Ist beim direkten Aufruf einer späteren Antwort der erste Beitrag noch nicht geladen, bietet es stattdessen einen Link zum ersten Beitrag.

### 9. Footer – ein passender Abschluss für dein Forum

Der Kobalt-Footer ist eigenständig und benötigt Modern Footer nicht. Er ist anfangs ausgeschaltet. Falls du Modern Footer verwendest, deaktiviere dessen Ausgabe beziehungsweise die Erweiterung, bevor du den Kobalt-Footer einschaltest. Kobalt verändert die Einstellungen der anderen Erweiterung nicht.

Unter **Footer → Allgemein** stehen folgende Optionen zur Verfügung:

- Footer einschalten und auf allen Seiten, nur der Startseite oder außerhalb von Diskussionen anzeigen.
- Darstellung **Weich** oder **Kobaltblau** wählen. Die weiche Darstellung folgt dem hellen oder dunklen Farbschema.
- Ausgabe auf Mobilgeräten ein- oder ausschalten.
- Zusätzlichen Abstand von 0, 56, 72 oder 96 Pixeln unter dem Footer vorsehen, beispielsweise für eine feste mobile Navigation. Der Wert wird manuell eingestellt; die Geräte-Sicherheitszone wird zusätzlich berücksichtigt.
- Infobereich mit optionalem vorhandenem Forumlogo, Titel und Beschreibung einrichten. Ein leerer Titel verwendet den Forumnamen.
- Copyright festlegen. `© {year} {forum}` setzt das aktuelle Jahr und den Forumnamen ein. Ein leeres Feld blendet den Copyright-Text aus.
- Einen Nach-oben-Button anzeigen.

Unter **Linkspalten** kannst du vier Spalten einzeln einrichten und ein- oder ausschalten. Jede enthält einen Titel, ein optionales Font-Awesome-Symbol und bis zu sechs Links. Beispielsweise könntest du Community, Software, Hilfe und Rechtliches verwenden. Nur Einträge mit gültigem Ziel und Linktext werden angezeigt; leere Spalten bleiben ausgeblendet.

Unter **Social-Links** stehen vier Einträge mit Beschriftung, optionalem Symbol und Ziel zur Verfügung. Sie erscheinen im Infobereich. Für Symbole funktionieren beispielsweise `fab fa-github`, `fab fa-discord` oder `fas fa-book`. Die jeweilige Schrift muss das Symbol enthalten. Beschriftungen bleiben auch ohne Symbol lesbar.

Interne Links verwenden die Forumsnavigation; externe HTTPS-Links öffnen einen neuen Tab. Für Ziele gelten dieselben Regeln wie bei Orbit. Die Inhalte sind Textfelder; eigene HTML- oder JavaScript-Blöcke gehören nicht zum Footer.

Die Live-Vorschau zeigt den Entwurf auch dann, wenn du als Ausgabe nur die Startseite ausgewählt hast. Die echte Seitenfilterung findet im Forum statt. Nach Änderungen speichern und das Forum neu laden.

### 10. Layout – das Erscheinungsbild abstimmen

- Akzentfarbe, standardmäßig `#4d698e`.
- Feedbreite: Standard, Breit oder Schmal.
- Rundung: Weich, Rund oder Dezent.
- Kartenabstände: Luftig oder Kompakt.
- Kompakter Diskussionsstart und Widget-Leiste.
- Höhe des Shoutbox-Nachrichtenbereichs.
- Aktionsleiste und Kategorienfarben als Kartenakzent.

**Super-Sticky-Themen erhalten immer einen roten linken Rand mit 4 Pixeln und `#e74c3c`.** Dieser hat Vorrang vor dem Kategorienakzent. Das Anheften und die Sortierung übernimmt weiterhin Stickiest.

Die maximale Breite der Beitragsspalte in geöffneten Diskussionen beträgt `150ch`; das tatsächliche Layout bleibt durch den verfügbaren Bildschirmplatz begrenzt. Dieser Wert ist derzeit im Theme festgelegt und kein Studio-Eingabefeld.

Die Aktionsleiste verwendet vorhandene Funktionen: Antworten öffnet das Thema; Teilen verwendet die Browserfreigabe oder kopiert den Link. Wenn FoF Reactions und ein sichtbarer erster Beitrag mit entsprechender Berechtigung verfügbar sind, verwendet Kobalt dessen Reaktionsauswahl. Andernfalls kann ein Link zum ersten Beitrag erscheinen. Verfügbare Reaktionen werden mit ihrer Gesamtzahl angezeigt.

## Erweiterungen und Integrationen

Alle folgenden Erweiterungen sind optional. Installiere für Flarum 2 geeignete Versionen.

| Erweiterung | Verwendung in Kobalt |
| --- | --- |
| FoF Forum Widgets Core | Vorhandene rechte Widgets als Leiste über dem Feed darstellen |
| Depot | Veröffentlichte Projektversionen, Dateiseiten und aktuelle Downloads ergänzen |
| FoF Best Answer | Support-Filter, Lösungslinks und Support-Status |
| FoF Follow Tags | Ansicht Meine Themen für verfolgte Kategorien |
| FoF Reactions | Vorhandene Reaktionsauswahl und Reaktionszahlen im Feed |
| Modern Footer | Alternative zum integrierten Kobalt-Footer; nur einen der beiden Footer aktivieren |
| Stickiest | Eigener roter Rand für Super-Sticky-Themen; Sortierung bleibt bei Stickiest |
| FoF Synopsis | Vorhandene Beitragsauszüge in der Diskussionsliste nutzen |

Für die typische Widget-Anordnung Forum-Statistiken, Aktivste Benutzer und Benutzer online im **rechten Bereich** von FoF Widgets Core platzieren. Kobalt ordnet sie oberhalb des Feeds an. Die Widget-Position **Oben** bleibt zusätzlich nutzbar. Ohne zugewiesene Widgets wird kein Beispielinhalt erzeugt.

Die Shoutbox kann über ihre eigene Widget-Konfiguration beispielsweise nach **Unten** verschoben werden, damit die Diskussionen früher sichtbar sind. Die Kobalt-Höheneinstellung begrenzt nur den Nachrichtenbereich an den von Kobalt gestalteten Widget-Positionen.

Kobalt ergänzt Flarums vorhandene Komponenten und Erweiterungspunkte. Es enthält keine Garantie für jede Kombination mit Drittanbieter-Erweiterungen. Insbesondere mehrere gleichzeitig aktive Themes können sich gegenseitig überschreiben.

## Aktualisieren

### Aus einer veröffentlichten Composer-Version

Vor dem Update laufende Paketoperationen abschließen. Anschließend die passende Composer-Installationssequenz mit der gewünschten veröffentlichten Versionsnummer erneut ausführen. Im CrazyMax-Container nach erfolgreicher Paketinstallation **`extension sync`**, Cache-Neuaufbau und PHP-FPM-Neustart durchführen.

Die Studio-Einstellungen bleiben beim normalen Paketupdate erhalten. Neue Funktionen sind gegebenenfalls zunächst ausgeschaltet.

### Von einer älteren lokalen ZIP-Version

Die neue ZIP in einen eigenen Versionsordner entpacken und die lokale Paketquelle auf diesen Ordner und die neue Versionsnummer umstellen. Danach Composer ausführen. Die ZIP-Anleitung zeigt das Vorgehen für Alpha 14.

Den alten Quellordner erst entfernen, wenn weder die Composer-Konfiguration noch ein installierter Symlink oder anderer Dienst darauf verweist.

### Später von der ZIP auf Packagist wechseln

Eine lokale Composer-Paketquelle kann eine veröffentlichte Version überdecken. Vor dem Wechsel gezielt den zuvor für Kobalt angelegten Eintrag entfernen.

Normale Installation, sofern der Eintrag wie oben im Projekt angelegt wurde:

```bash
cd /var/www/flarum
runuser -u www-data -- composer config --unset repositories.kobalt
```

CrazyMax / Docker Compose, sofern der Eintrag wie oben global angelegt wurde:

```bash
cd /mnt/wdblue/flarum2

docker compose exec -T --user flarum \
  --env COMPOSER_HOME=/data/extensions/composer-home \
  --workdir /opt/flarum flarum \
  composer config --global --unset repositories.kobalt
```

Danach die gewünschte, tatsächlich veröffentlichte Version mit Composer installieren und die passenden Abschlussbefehle ausführen. Falls früher ein anderer Repository-Name oder Speicherort verwendet wurde, zuerst dessen Konfiguration prüfen. Keine anderen lokalen Paketquellen pauschal entfernen.

## Datenspeicherung und Berechtigungen

| Daten | Speicherort und Verhalten |
| --- | --- |
| Studio-Einstellungen | Flarum-Einstellungen in der Datenbank |
| Arbeitsplatz | Lokal im Browser, nach Forum und angemeldetem Konto getrennt |
| Abgehakte Einstiegsschritte | Lokal im Browser, nach Forum und Konto beziehungsweise Gastzugang getrennt |
| Besuchsvergleich | Lokal im Browser für das angemeldete Konto |
| Schriftgröße und Zeilenabstand | Lokal im Browser, nach Forum und Konto beziehungsweise Gastzugang getrennt |

Browserdaten werden nicht zwischen Geräten synchronisiert. Beim Löschen der Website-Daten gehen diese persönlichen Einstellungen verloren. Gastfortschritte werden bei einer Anmeldung nicht automatisch dem Konto zugeordnet.

Manuell eingetragene Bannertexte, Hinweise, Einstiegsschritte und Projektinformationen sind öffentliche Theme-Inhalte. Dort keine vertraulichen Informationen hinterlegen. Zusätzliche API-Abfragen laufen mit den normalen Berechtigungen des Besuchers. Eine Empfehlung oder Projektkarte erteilt keinen Zugriff auf geschützte Inhalte.

Kobalt enthält keine eigenen Datenbankmigrationen. Zum vorübergehenden Wechsel auf ein anderes Theme Kobalt deaktivieren, das andere Theme aktivieren und den Cache neu aufbauen.

## Häufige Fragen

### Muss ich bestehende Widgets oder Erweiterungen deaktivieren?

Für die Kobalt-Grundfunktionen nicht. Die Widgets müssen in ihrer jeweiligen Erweiterung konfiguriert und einer Position zugeordnet sein. Ein zuvor verwendetes vollständiges Theme sollte beim Wechsel deaktiviert werden.

### Warum sehe ich meine Änderung nur in der Studio-Vorschau?

Die Vorschau zeigt Entwurfswerte. Zuerst **Änderungen speichern**, danach die Forumsseite neu laden. Nach einem Paketupdate zusätzlich den Cache neu aufbauen und bei veraltetem OPcache PHP-FPM neu laden.

### Warum fehlen Arbeitsplatz, Einstieg oder Werkzeugkasten?

Die passende Funktion unter **Erlebnis** aktivieren. Der Arbeitsplatz benötigt eine Anmeldung. Einstiegsschritte brauchen Titel und gültiges Ziel. Der Werkzeugkasten benötigt ein benanntes Projekt sowie einen passenden Support-Themenlink oder eine Software-Kategorieregel.

### Warum fehlen Auszüge oder Reaktionen auf einer Karte?

Kobalt nutzt bereits vorhandene Beitragsdaten. Es fordert nicht für jede Feed-Karte zusätzliche Beiträge an. Ohne vorhandenen Auszug oder zugänglichen ersten Beitrag stehen entsprechende Inhalte beziehungsweise Reaktionsaktionen nicht vollständig zur Verfügung.

### Braucht Kobalt externe Abfragen?

Aktivierte Funktionen können zusätzliche Anfragen an die API deines Forums auslösen, beispielsweise für eine Empfehlung, Depot-Projektdaten oder die Besuchsübersicht. Extern eingebundene Bilder werden von der angegebenen Bildadresse geladen. Bei manuellen Inhalten ohne solche Verknüpfungen entfallen die jeweiligen Datenabfragen.

### Die Seite lädt ungewöhnlich langsam. Wie grenze ich das ein?

Im Browser unter **F12 → Netzwerk** die Startseite neu laden und die Zeiten von Hauptdokument, JavaScript und API-Anfragen vergleichen. Wiederholte Fehlermeldungen aus einem Browser-Content-Script zusätzlich in einem privaten Fenster mit deaktivierten Browser-Erweiterungen prüfen.

Für einen Shoutbox-Vergleich deren Widget vorübergehend aus der Position nehmen und unter denselben Bedingungen erneut messen. Eine lange Ladezeit allein zeigt noch nicht, welche Erweiterung sie verursacht.

## Entwicklung

Die Installationsdateien enthalten fertige JavaScript-Bundles. Für Änderungen am Frontend:

```bash
cd js
npm install
npm run build
```

| Verzeichnis / Datei | Inhalt |
| --- | --- |
| `js/src/` | Forumfunktionen und Kobalt Studio |
| `js/dist/` | Fertige Browser-Bundles und Source Maps |
| `less/` | Forum-, Studio- und Admin-Styles |
| `locale/` | Deutsche und englische Oberflächentexte |
| `settings.json` | Standardwerte der Studio-Einstellungen |
| `src/ForumSettings.php` | Übergabe der Theme-Einstellungen an das Forum |
| `preview/` | Statische Vorschau mit Beispieldaten |

Die lokale Prüfung umfasst Frontend-Build, Sprachdateien, Styles, Speichern und Auslesen der Studio-Einstellungen sowie ausgewählte Funktions- und Browserprüfungen. Sie ersetzt keinen Test mit den eigenen Erweiterungen und Inhalten im Zielsystem.

## Gestaltungsidee

Die Konfigurationsmöglichkeiten von [Modern Footer](https://github.com/huseyinfiliz/modern-footer) dienten als Anregung für den Footer. Kobalt verwendet dafür eine eigene Umsetzung und Gestaltung.

## Lizenz

Kobalt wird unter der [MIT-Lizenz](LICENSE) bereitgestellt.

**Entwickelt von el-choco.**
