# Merkmal-Review Mietspiegel 2023

> Automatisch erzeugt von `src/form/verification/merkmal-review.test.ts`.
> Nicht von Hand bearbeiten; Änderungen mit `pnpm test:review -u` übernehmen.

Für jedes Merkmal der Orientierungshilfe: der Text aus dem Mietspiegel, die
Antworten, bei denen der Fragebogen das Merkmal als erfüllt wertet, und in
welchen Baualtersklassen der Fragebogen es überhaupt als erfüllt werten kann
(per Lösungssuche über den echten Fragebogen ermittelt).

Bitte je Merkmal prüfen:

1. Fragt die Frage genau das ab, was der Mietspiegeltext meint (Schwellenwerte, Ausnahmen, Gäste-WC usw.)?
2. Stimmen die erreichbaren Baualtersklassen mit den Einschränkungen im Text überein?

„Nicht sicher“ wird für die Spanne als *vielleicht* gewertet: im ungünstigsten
und im günstigsten Fall jeweils so, dass die Spanne maximal wird.
Baualtersklassen ab 2015 entfallen, weil Neubauten den Fragebogen verlassen (§ 556f BGB).

Legende: ✓ erreichbar · – nicht erreichbar · ⚠ Abweichung vom Text (siehe Hinweis)

## Bad

### [Bad-] Bad ist klein

**Mietspiegel:** Kleines Bad (kleiner als 4 m2); gilt nicht in der Baualtersklasse 1973 bis 1990 Ost

**Erfüllt, wenn:**

- „Gibt es ein Badezimmer mit mindestens 4 m² Grundfläche?“ = **Nein** (`Bad mindestens 4qm`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | – | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | – | ✓ | ✓ |

- [ ] geprüft

### [Bad-] Bad mit Dielenfußboden

**Mietspiegel:** Dielenfußboden im Bad (wenn nicht feuchtraumgeeignet)

**Erfüllt, wenn:**

- „Gibt es ein Badezimmer mit Dielenfußboden, welcher nicht feuchtraumgeeignet ist?“ = **Ja** (`Bad mit Dielenfußboden`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad-] Bad mit WC ohne Fenster

**Mietspiegel:** Bad mit WC ohne Fenster

**Erfüllt, wenn:**

- „Gibt es ein Badezimmer mit einer Toilette, welches kein Fenster hat?“ = **Ja** (`Bad mit WC ohne Fenster`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad-] Bad ohne ausreichende Warmwasserversorgung

**Mietspiegel:** Keine ausreichende Warmwasserversorgung (keine zentrale Warm- wasserversorgung, kein Durchlauferhitzer, kein Boiler > 60 Liter)

**Erfüllt, wenn:**

- „Gibt es im Badezimmer eine ausreichende Warmwasserversorgung?“ = **Nein** (`Bad hat Warmwasser`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad-] Bad ohne Duschmöglichkeit

**Mietspiegel:** Keine Duschmöglichkeit

**Erfüllt, wenn:**

- „Gibt es in der Wohnung eine Möglichkeit zu Duschen?“ = **Nein** (`Bad hat Duschmöglichkeit`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad-] Bad ohne Handwaschbecken

**Mietspiegel:** Kein Handwaschbecken in Bad oder WC oder im Bad nur ein kleines Handwaschbecken (Außenmaß 50 x 25 cm oder kleiner)

**Erfüllt, wenn:**

- „Gibt es ein Badezimmer oder WC, welches kein Handwaschbecken hat?“ = **Ja** (`Bad & WC ohne Waschbecken`)
- **oder** „Gibt es ein Badezimmer, welches lediglich ein kleines Handwaschbecken (Außenmaß 50x25cm oder kleiner) hat?“ = **Ja** (`Bad nur kleines Waschbecken`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad-] Bad ohne Heizung

**Mietspiegel:** Bad oder WC nicht beheizbar oder Holz-/Kohleheizung oder Elektroheizstrahler

**Erfüllt, wenn:**

- „Gibt es ein Badezimmer oder WC, welches nicht beheizbar ist?“ = **Ja** (`Bad ohne Heizung`)
- **oder** „Gibt es ein Badezimmer oder WC, welches nur mit einer Holz-/Kohleheizung oder einem Elektroheizstrahler beheizbar ist?“ = **Ja** (`Bad mit alter Heizung`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad-] Bad ohne separate Dusche mit frei stehender Wanne

**Mietspiegel:** Bad ohne separate Dusche mit frei stehender Badewanne mit oder ohne Verblendung in nicht modernisiertem Bad

**Erfüllt, wenn:**

- „Gibt es als einzige Duschmöglichkeit eine freistehende Badewanne?“ = **Ja** (`Duschen nur in freistehender Badewanne`)
  - und „Befindet sich die Badewanne in einem nicht modernisierten Bad?“ = **Ja** (`Duschen nur in freistehender Badewanne in nicht modernisiertem Bad`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad-] Bad Wände nicht gefliest

**Mietspiegel:** Wände nicht ausreichend im Spritzwasserbereich von Waschbecken, Badewanne und/oder Dusche gefliest

**Erfüllt, wenn:**

- „Sind die Wände in den Badezimmern um Dusche, Badewanne und Waschbecken so gefließt, dass die ungeschützte Wand normalerweise nicht nass wird?“ = **Nein** (`Bad Wände ausreichend gefließt`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad-] WC ohne Entlüftung

**Mietspiegel:** WC ohne Lüftungsmöglichkeit und Entlüftung

**Erfüllt, wenn:**

- „Gibt es einen Raum mit einer Toilette, in welchem es keine Möglichkeit zur Entlüftung gibt?“ = **Ja** (`WC ohne Lüftung`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad+] Bad hat Fußbodenheizung

**Mietspiegel:** Fußbodenheizung

**Erfüllt, wenn:**

- „Gibt es ein Badezimmer mit Fußbodenheizung?“ = **Ja** (`Bad mit Fußbodenheizung`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad+] Bad hat großes Waschbecken

**Mietspiegel:** Sehr großes Waschbecken (Außenmaß mindestens 80 cm breit) oder Doppelhandwaschbecken oder zwei getrennte Waschbecken

**Erfüllt, wenn:**

- „Gibt es ein Badezimmer, welches entweder ein sehr großes Waschbecken (Außenmaß mindestens 80 cm breit), ein Doppelhandwaschbecken, oder zwei getrennte Waschbecken hat?“ = **Ja** (`Bad großes Waschbecken`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad+] Bad hat hochwertige Ausstattung

**Mietspiegel:** Besondere und hochwertige Ausstattung (z.B. hochwertige Sanitärausstattung, hochwertige Badmöbel, Eckwanne, Rundwanne)

**Erfüllt, wenn:**

- „Gibt es ein Badezimmer mit besonderer und hochwertiger Ausstattung (z.B. hochwertige Sanitärausstattung, hochwertige Badmöbel, Eckwanne/Rundwanne)?“ = **Ja** (`Bad mit hochwertiger Ausstattung`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad+] Bad hat hochwertige Boden- oder Wandfliesen

**Mietspiegel:** Wandbekleidung und Bodenbelag hochwertig

**Erfüllt, wenn:**

- „Ist der Bodenbelag und die Wandbekleidung in allen Badezimmern hochwertig?“ = **Ja** (`Bad Boden und Wand hochwertig`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad+] Bad hat moderne Entlüftung

**Mietspiegel:** Innen liegendes Badezimmer mit moderner, gesteuerter Entlüftung (z.B. mittels Feuchtigkeitssensor)

**Erfüllt, wenn:**

- „Gibt es ein innen liegendes Badezimmer mit moderner, gesteuerter Entlüftung (z.B. mittels Feuchtigkeitssensor)?“ = **Ja** (`Bad mit moderner Entlüftung`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad+] Bad hat Strukturheizkörper

**Mietspiegel:** Strukturheizkörper als Handtuchwärmer

**Erfüllt, wenn:**

- „Gibt es ein Badezimmer mit einem Strukturheizkörper als Handtuchwärmer (wie z.B. auf diesem Bild)?“ = **Ja** (`Bad mit Strukturheizkörper`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad+] Bad hat von Badewanne getrennte Dusche

**Mietspiegel:** Von der Badewanne getrennte zusätzliche Duschtasse oder -kabine

**Erfüllt, wenn:**

- „Gibt es in der Wohnung sowohl eine Dusche als auch eine separate Badewanne?“ = **Ja** (`Bad hat Dusche und Wanne`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Bad+] Bad hat wandhängendes WC

**Mietspiegel:** Wandhängendes WC mit in der Wand eingelassenem Spülkasten; gilt nicht in der Baualtersklasse ab 2003

**Erfüllt, wenn:**

- „Sind alle Toiletten wandhängend mit Spülkasten in der Wand (wie z.B. auf diesem Bild)?“ = **Ja** (`Bad hat wandhängendes WC`)
- **oder** „Sind alle Toiletten hochwertige Stand-WCs?“ = **Ja** (`Bad hat hochwertiges Stand-WC`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – |

- [ ] geprüft

### [Bad+] Bad ist groß

**Mietspiegel:** Mindestens ein Bad größer als 8 m2

**Erfüllt, wenn:**

- „Gibt es ein Badezimmer, das größer als 8qm ist?“ = **Ja** (`Bad größer als 8qm`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | – ⚠ | ✓ | ✓ |

⚠ **offen:** Vermutete Ursache: „Bad größer als 8 m²“ wird nur nach „Bad mindestens 4 m²“ gefragt; diese Frage entfällt für 1973–1990 Ost (Kleines Bad gilt dort nicht). Das Merkmal „Großes Bad“ ist aber laut Text nicht eingeschränkt.

- [ ] geprüft

### [Bad+] Zweites WC oder Bad/WC getrennt

**Mietspiegel:** Zweites WC in der Wohnung oder Bad und WC getrennt

**Erfüllt, wenn:**

- „Gibt es in der Wohnung zwei oder mehr Toiletten?“ = **Ja** (`Mehrere WCs`)
- **oder** „Sind Badezimmer und Toilette in zwei getrennten Räumen?“ = **Ja** (`Getrenntes WC`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

## Küche

### [Küche-] Küche ohne ausreichende Warmwasserversorgung

**Mietspiegel:** Keine ausreichende Warmwasserversorgung (z.B. keine zentrale Warmwasserversorgung, kein Durchlauferhitzer, kein Boiler)

**Erfüllt, wenn:**

- „Gibt es in der Küche eine ausreichende Warmwasserversorgung?“ = **Nein** (`Küche hat Warmwasser`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Küche-] Küche ohne Fenster/Entlüftung

**Mietspiegel:** Küche ohne Fenster und ohne ausreichende Entlüftung

**Erfüllt, wenn:**

- „Gibt es in Küche ein Fenster oder eine andere Möglichkeit zur Entlüftung?“ = **Nein** (`Küche hat Lüftung`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Küche-] Küche ohne Geschirrspüler Anschluss

**Mietspiegel:** Geschirrspüler in der Küche nicht stellbar oder anschließbar

**Erfüllt, wenn:**

- „Ist es möglich in der Küche einen Geschirrspüler aufzustellen und anzuschließen?“ = **Nein** (`Küche kann Spülmaschine`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Küche-] Küche ohne Heizung

**Mietspiegel:** Küche nicht beheizbar oder Holz-/ Kohleheizung

**Erfüllt, wenn:**

- „Ist die Küche beheizbar?“ = **Nein** (`Küche hat Heizung`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Küche-] Küche ohne Kochmöglichkeit

**Mietspiegel:** Keine Kochmöglichkeit oder Gas-/ Elektroherd ohne Backofen

**Erfüllt, wenn:**

- „Ist die Küche von der Vermieterin mit einem Herd ausgestattet worden?“ = **Nein** (`Küche hat Kochmöglichkeit`)
- **oder** „Handelt es sich bei dem Herd um einen Gas- oder Elektroherd ohne Backofen?“ = **Ja** (`Küche hat Gas/Elektroherd ohne Backofen`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Küche-] Küche ohne Spüle

**Mietspiegel:** Keine Spüle

**Erfüllt, wenn:**

- „Ist die Küche von der Vermieterin mit einem Spülbecken ausgestattet worden?“ = **Nein** (`Küche hat Spüle`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Küche+] Küche hat Ceran-/Induktionsherd

**Mietspiegel:** Ceran-Kochfeld oder Induktions- Kochfeld

**Erfüllt, wenn:**

- „Handelt es sich bei dem Herd um ein Ceran- oder Induktions-Kochfeld?“ = **Ja** (`Küche hat Ceran-/Induktionsherd`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Küche+] Küche hat Dunstabzugshaube

**Mietspiegel:** Dunstabzug

**Erfüllt, wenn:**

- „Ist die Küche von der Vermieterin mit einer Dunstabzugshaube ausgestattet worden?“ = **Ja** (`Küche hat Dunstabzug`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Küche+] Küche hat Einbauküche

**Mietspiegel:** Einbauküche mit Ober- und Unter- schränken sowie Herd und Spüle

**Erfüllt, wenn:**

- „Ist die Küche von der Vermieterin mit einer Einbauküche mit Ober- und Unterschränken, Herd und Spüle ausgestattet worden?“ = **Ja** (`Küche hat Einbauküche`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Küche+] Küche hat hochwertigen Bodenbelag

**Mietspiegel:** Hochwertige Fliesen, hochwertiges Linoleum, hochwertiges Feuchtraum- laminat, Parkett, Terrazzo als Bodenbelag jeweils in gutem Zustand

**Erfüllt, wenn:**

- „Ist in der Küche von der Vermieterin ein hochwertiger Fußboden verlegt worden?“ = **Ja** (`Küche hat hochwertigen Fußboden`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Küche+] Küche hat Kühlschrank

**Mietspiegel:** Kühlschrank

**Erfüllt, wenn:**

- „Ist die Küche von der Vermieterin mit einem Kühlschrank ausgestattet worden?“ = **Ja** (`Küche hat Kühlschrank`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Küche+] Küche ist groß

**Mietspiegel:** separate Küche mit mind. 14 m2 Grundfläche

**Erfüllt, wenn:**

- „Ist die Küche mindestens 14qm groß?“ = **Ja** (`Küche ist groß`)
  - und „Handelt es sich bei der Küche um einen separaten Raum?“ = **Ja** (`Küche ist separater Raum`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

## Wohnung

### [Wohnung-] Wohnung hat Einfachverglasung

**Mietspiegel:** Überwiegend Einfachverglasung

**Erfüllt, wenn:**

- „Sind in der Wohnung überwiegend einfach verglaste Fenster verbaut?“ = **Ja** (`Wohnung hat einfach verglaste Fenster`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung-] Wohnung hat kein Balkon

**Mietspiegel:** Kein Balkon, (Dach-)Terrasse, Loggia und Winter-/Dachgarten (gilt nicht, wenn das Merkmal aus baulichen und/oder rechtlichen Gründen nicht möglich oder nicht zulässig ist)

**Erfüllt, wenn:**

- „Hat die Wohnung einen Außenbereich, wie z.B. Balkon, (Dach-)Terrasse, Loggia, Wintergarten oder Dachgarten?“ = **Nein** (`Wohnung hat Balkon`)
  - und „Gibt es bauliche oder rechtliche Gründe, weshalb ein Außenbereich (wie z.B. ein Balkon) nicht möglich ist?“ = **Nein** (`Wohnung keinen Balkon weil unmöglich`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung-] Wohnung hat kein Waschmaschinen Anschluss

**Mietspiegel:** Waschmaschine weder in Bad noch Küche stellbar oder nicht anschließbar

**Erfüllt, wenn:**

- „Ist es möglich eine Waschmaschine in der Küche oder dem Bad aufzustellen und anzuschließen?“ = **Nein** (`Wohnung kann Waschmaschiene`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung-] Wohnung hat schlechten Schnitt

**Mietspiegel:** Schlechter Schnitt (z.B. gefangener Raum und/oder Durchgangsraum)

**Erfüllt, wenn:**

- „Gibt es in der Wohnung ein gefangenes Zimmer oder Durchgangszimmer?“ = **Ja** (`Wohnung hat Durchgangszimmer`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung-] Wohnung hat sichtbare Bewässerungsleitungen

**Mietspiegel:** Be- und Entwässerungsinstallation überwiegend auf Putz

**Erfüllt, wenn:**

- „Sind die Be- und Entwässerungleitungen überwiegend sichtbar verlegt?“ = **Ja** (`Wohnnung hat sichtbare Bewässerungsleitungen`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung-] Wohnung hat sichtbare Elektroinstallation

**Mietspiegel:** Elektroinstallation überwiegend sichtbar auf Putz

**Erfüllt, wenn:**

- „Verlaufen die Stromkabel in der Wohnung überwiegend innerhalb der Wand?“ = **Nein** (`Wohnung hat nicht sichtbare Elektroinstallation`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung-] Wohnung hat unzureichende Elektroinstallation

**Mietspiegel:** Unzureichende Elektroinstallation, z.B. keine ausreichende Elektrosteigeleitung und/oder VDE-gerechte Elektroinstallation (z.B. kein FI- Schalter, Potentialausgleich)

**Erfüllt, wenn:**

- „Ist in der Wohnung eine ausreichende Elektroinstallation verbaut?“ = **Nein** (`Wohnung hat ausreichende Elektroinstallation`)
- **oder** „Gibt es einen Wohnraum, der weniger als zwei Steckdosen hat?“ = **Ja** (`Wohnung hat Raum mit <2 Steckdosen`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung+] Wohnugn hat wohnungsbezogenen Kaltwasserzähler

**Mietspiegel:** Wohnungsbezogener Kaltwasserzähler in vor 1991 bezugsfertigen Gebäuden/ Wohnungen, wenn der Mieter nicht die Kosten für Miete oder Leasing im Rahmen der Betriebskosten trägt

**Erfüllt, wenn:**

- „Hat die Wohnung einen wohnungsbezogenen Kaltwasserzähler?“ = **Ja** (`Wohnung hat Kaltwasserzähler`)
  - und „Zahlt die Mieterin der Wohnung die Kosten für die Miete des wohnungbezogenen Kaltwasserzählers?“ = **Nein** (`Mieter zahlt für Kaltwasserzähler`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |

- [ ] geprüft

### [Wohnung+] Wohnugn ist barrierearm

**Mietspiegel:** Barrierearme Wohnungsgestaltung (Schwellenfreiheit in der Wohnung, schwellenarmer Übergang zu Balkon/Terrasse, ausreichende Bewegungsfreiheit in der Wohnung und/oder barrierearme Badgestaltung)

**Erfüllt, wenn:**

- „Ist die Wohnung barrierearm?“ = **Ja** (`Wohnung ist barrierearm`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung+] Wohnung hat aufwändige Deckenverkleidung

**Mietspiegel:** Aufwändige Decken- und/oder Wandverkleidung (z.B. Stuck, Täfelung) in gutem Zustand in der überwiegenden Anzahl der Wohnräume

**Erfüllt, wenn:**

- „Gibt es in der Mehrzahl der Wohnräume eine aufwändige Decken- oder Wandverkleidung in einem guten Zustand?“ = **Ja** (`Wohnung hat aufwendige Wand- und Deckenverkleidung`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung+] Wohnung hat Einbauschrank/Abstellraum

**Mietspiegel:** Einbauschrank oder Abstellraum innerhalb der Wohnung

**Erfüllt, wenn:**

- „Gibt es innerhalb der Wohnung einen Abstellraum oder Einbauschrank?“ = **Ja** (`Wohnung hat Abstellraum`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung+] Wohnung hat Fußbodenheizung

**Mietspiegel:** Überwiegend Fußbodenheizung

**Erfüllt, wenn:**

- „Ist in der Wohnung überwiegend eine Fußbodenheizung verbaut?“ = **Ja** (`Wohnung hat Fußbodenheizung`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung+] Wohnung hat großen Balkon

**Mietspiegel:** Großer, geräumiger Balkon, (Dach-) Terrasse, Loggia oder Wintergarten (ab 4 m2)

**Erfüllt, wenn:**

- „Hat die Wohnung einen Außenbereich, wie z.B. Balkon, (Dach-)Terrasse, Loggia, Wintergarten oder Dachgarten?“ = **Ja** (`Wohnung hat Balkon`)
  - und „Ist dieser Außenbereich mindestens 4qm groß?“ = **Ja** (`Wohnung hat großen Balkon`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung+] Wohnung hat großen Wohnraum

**Mietspiegel:** Ein Wohnraum größer als 40 m2

**Erfüllt, wenn:**

- „Gibt es in der Wohnung einen Wohnraum der größer als 40qm ist?“ = **Ja** (`Wohnung hat großen Wohnraum`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung+] Wohnung hat hochwertigen Boden

**Mietspiegel:** Hochwertiges Parkett, Natur- /Kunststein, Fliesen oder gleichwertiger Boden/-belag in der überwiegenden Zahl der Wohnräume

**Erfüllt, wenn:**

- „Gibt es in der überwiegenden Anzahl der Wohnräume einen hochwertigen Bodenbelag?“ = **Ja** (`Wohnung hat hochwertigen Bodenbelag`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre

**Mietspiegel:** Heizungsrohre überwiegend nicht sichtbar

**Erfüllt, wenn:**

- „Sind die Heizungsrohre überwiegend sichtbar verlegt?“ = **Nein** (`Wohnung hat sichtbare Heizungsrohe`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung+] Wohnung hat Rollläden

**Mietspiegel:** Rollläden

**Erfüllt, wenn:**

- „Sind die Fenster überwiegend mit Rollläden ausgestattet?“ = **Ja** (`Wohnung hat Rollläden`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Wohnung+] Wohnung hat Schallschutzfenster/Wärmeschutzverglasung

**Mietspiegel:** Wohngebäude/Wohnungen die vor 2002 bezugsfertig geworden sind: überwiegend Wärmeschutzverglasung (Einbau ab 2002) oder Schallschutzfenster

**Erfüllt, wenn:**

- „Sind in der Wohnung überwiegend Fenster mit Wärmeschutzverglasung (Einbau ab 2002) oder Schallschutzfenster verbaut?“ = **Ja** (`Wohnung hat Schallschutzfenster`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – |

- [ ] geprüft

### [Wohnung+] Wohnung hat zusätzliche Einbruchssicherung

**Mietspiegel:** Zusätzliche Einbruchssicherung für die Wohnungstür (z.B. hochwertige Sperrbügel und/oder Türschlösser mit Mehrfachverriegelung) bei verstärkten Türen

**Erfüllt, wenn:**

- „Ist die Wohnungstür verstärkt und verfügt über eine zusätzliche Einbruchsicherung, wie z.B. hochwertige Sperrbügel oder Türschlösser mit Mehrfachverriegelung?“ = **Ja** (`Wohnung hat verstärkte Tür`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

## Gebäude

### [Gebäude-] Energieverbrauchskennwert größer als 170/155/145

**Mietspiegel:** Energieverbrauchskennwert größer als 155 kWh/(m²a)

**Erfüllt, wenn:**

- „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Zwischen 156 und 195 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Zwischen 196 und 235 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Größer als 235 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Zwischen 187 und 234 kWH/(m2*a)** (`Energiebedarfskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Zwischen 235 und 282 kWH/(m2*a)** (`Energiebedarfskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Größer als 282 kWH/(m2*a)** (`Energiebedarfskennwert`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude-] Energieverbrauchskennwert größer als 210/195

**Mietspiegel:** Energieverbrauchskennwert größer als 195 kWh/(m²a)

**Erfüllt, wenn:**

- „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Zwischen 196 und 235 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Größer als 235 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Zwischen 235 und 282 kWH/(m2*a)** (`Energiebedarfskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Größer als 282 kWH/(m2*a)** (`Energiebedarfskennwert`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude-] Energieverbrauchskennwert größer als 250/235

**Mietspiegel:** Energieverbrauchskennwert größer als 235 kWh/(m²a)

**Erfüllt, wenn:**

- „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Größer als 235 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Größer als 282 kWH/(m2*a)** (`Energiebedarfskennwert`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude-] Gebäude hat keine Gegensprechanlage

**Mietspiegel:** Keine Gegen-/Wechselsprechanlage mit elektrischem Türöffner

**Erfüllt, wenn:**

- „Gibt es eine Gegensprechanlage mit elektrischem Türöffner?“ = **Nein** (`Gebäude hat Gegensprechanlage`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude-] Gebäude hat keinen Mieterkeller oder Kellerersatzraum

**Mietspiegel:** Kein Mieterkeller oder Kellerersatzraum zur alleinigen Nutzung des Mieters vorhanden

**Erfüllt, wenn:**

- „Gibt es einen privaten Keller, Dachboden oder Abstellraum, der zu der Wohnung gehört?“ = **Nein** (`Gebäude hat privaten Abstellraum`)
- **oder** „Gibt es einen privaten Keller oder Abstellraum, der zu der Wohnung gehört?“ = **Nein** (`Gebäude hat privaten Keller`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude-] Gebäude hat unzureichende Wärmedämmung

**Mietspiegel:** Unzureichende Wärmedämmung oder Heizanlage mit ungünstigem Wirkungsgrad (Einbau/Installation vor 1988)

**Erfüllt, wenn:**

- „Ist die Wärmedämmung der Wohnung sehr schlecht?“ = **Ja** (`Gebäude hat schlechte Wärmedämmung`)
- **oder** „Wurde die Heizanlage der Wohnung vor 1988 eingebaut?“ = **Ja** (`Gebäude hat Heizanlage mit ungünstigem Wirkungsgrad`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude-] Gebäude Hauseingangstür ist nicht abschließbar

**Mietspiegel:** Hauseingangstür nicht abschließbar

**Erfüllt, wenn:**

- „Ist es jederzeit möglich ohne Schlüssel bis zu deiner Wohnungstür zu kommen?“ = **Ja** (`Gebäude Hauseingangstür ist nicht abschließbar`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude-] Gebäude in schlechten Instandhaltungszustand

**Mietspiegel:** Schlechter Instandhaltungszustand (z.B. dauernde Durchfeuchtung des Mauerwerks - auch Keller -, große Putzschäden, erhebliche Schäden an der Dacheindeckung)

**Erfüllt, wenn:**

- „Ist das Gebäude, in dem sich die Wohnung befindet, in einem schlechten Zustand?“ = **Ja** (`Gebäude ist in schlechtem Zustand`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude-] Gebäude in Seitenflügel oder Quergebäude bei verdichteter Bebauung

**Mietspiegel:** Lage im Seitenflügel oder Quergebäude bei verdichteter Bebauung

**Erfüllt, wenn:**

- „Befindet sich die Wohnung im Seitenflügel mit sehr dichter Bebauung?“ = **Ja** (`Gebäude ist dicht bebaut`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude-] Gebäude Treppenbereich/Eingangsbereich in schlechtem Zustand

**Mietspiegel:** Treppenhaus/Eingangsbereich überwiegend in schlechtem Zustand

**Erfüllt, wenn:**

- „Sind das Treppenhaus oder der Eingangsbereich stark abgenutzt und renovierungsbedürftig?“ = **Ja** (`Gebäude hat Treppenhaus in schlechtem Zustand`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug

**Mietspiegel:** Wohnung ab fünftem Obergeschoss ohne Personenaufzug

**Erfüllt, wenn:**

- „Gibt es einen Fahrstuhl, mit dem die Wohnung erreicht werden kann?“ = **Nein** (`Gebäude hat Fahrstuhl`)
  - und „Liegt in die Wohnung im fünften Stockwerk oder höher?“ = **Ja** (`Gebäude hat >=5 Stockwerke und kein Fahrstuhl`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude+] Energieverbrauchskennwert kleiner als 100

**Mietspiegel:** Energieverbrauchskennwert kleiner als 100 kWh/(m²a)

**Erfüllt, wenn:**

- „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Zwischen 80 und 99 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Kleiner als 80 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Zwischen 96 und 119 kWH/(m2*a)** (`Energiebedarfskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Kleiner als 96 kWH/(m2*a)** (`Energiebedarfskennwert`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude+] Energieverbrauchskennwert kleiner als 120

**Mietspiegel:** Energieverbrauchskennwert kleiner als 120 kWh/(m²a)

**Erfüllt, wenn:**

- „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Zwischen 100 und 119 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Zwischen 80 und 99 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Kleiner als 80 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Zwischen 120 und 143 kWH/(m2*a)** (`Energiebedarfskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Zwischen 96 und 119 kWH/(m2*a)** (`Energiebedarfskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Kleiner als 96 kWH/(m2*a)** (`Energiebedarfskennwert`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude+] Energieverbrauchskennwert kleiner als 80

**Mietspiegel:** Energieverbrauchskennwert kleiner als 80 kWh/(m²a)

**Erfüllt, wenn:**

- „Wie hoch ist der Energieverbrauchskennwert der Wohnung?“ = **Kleiner als 80 kWH/(m2*a)** (`Energieverbrauchskennwert`)
- **oder** „Wie hoch ist der Energiebedarfskennwert der Wohnung?“ = **Kleiner als 96 kWH/(m2*a)** (`Energiebedarfskennwert`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen

**Mietspiegel:** Personenaufzug bei weniger als fünf Obergeschossen

**Erfüllt, wenn:**

- „Gibt es einen Fahrstuhl, mit dem die Wohnung erreicht werden kann?“ = **Ja** (`Gebäude hat Fahrstuhl`)
  - und „Liegt in die Wohnung im vierten Stockwerk oder niedriger?“ = **Ja** (`Gebäude hat <5 Stockwerke und Fahrstuhl`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude+] Gebäude hat Fahrradabstellraum/Fahrradstellplätze

**Mietspiegel:** Abschließbarer leicht zugänglicher Fahrradabstellraum innerhalb des Gebäudes oder Fahrradabstellplätze mit Anschließmöglichkeit außerhalb des Gebäudes auf dem Grundstück (ausreichend dimensioniert)

**Erfüllt, wenn:**

- „Gibt es auf dem Grundstück des Hauses ausreichend Stellplätze für Fahrräder, an denen du das Fahrrad sicher anschließen kannst?“ = **Ja** (`Gebäude hat Fahrradstellplätze mit Anschließmöglichkeit`)
- **oder** „Gibt es einen leicht zugänglichen, abschließbaren Raum zum Abstellen von Fahrrädern?“ = **Ja** (`Gebäude hat Fahrradabstellraum`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude+] Gebäude hat Gegensprechanlage mit Video

**Mietspiegel:** Gegen-/Wechselsprechanlage mit Videokontakt und elektrischem Türöffner

**Erfüllt, wenn:**

- „Hat die Gegensprechanlage eine Kamera?“ = **Ja** (`Gebäude hat Gegensprechanlage mit Kamera`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude+] Gebäude hat hochwertigen Eingangsbereich

**Mietspiegel:** Repräsentativer/s oder hochwertig sanierter/s Eingangsbereich/Treppenhaus (z.B. Spiegel, Marmor, exklusive Beleuchtung, hochwertiger Anstrich / Wandbelag, Läufer im gesamten Flur- und Treppenbereich)

**Erfüllt, wenn:**

- „Sind das Treppenhaus und der Eingangsbereich hochwertig saniert oder repräsentativ?“ = **Ja** (`Gebäude hat Treppenhaus in gutem Zustand`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude+] Gebäude hat zusätzliche nutzbare Räume

**Mietspiegel:** Zusätzliche und in angemessenem Umfang nutzbare Räume außerhalb der Wohnung in fußläufiger Entfernung (z.B. Gemeinschaftsraum)

**Erfüllt, wenn:**

- „Werden von der Vermieterin noch zusätzliche Räume angeboten?“ = **Ja** (`Gebäude hat zusätzliche Räume`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Gebäude+] Gebäude hat zusätzliche Wärmedämmung

**Mietspiegel:** Wärmedämmung zusätzlich zur vorhandenen Bausubstanz oder Einbau/Installation einer modernen Heizanlage nach dem 1.1.2003 (wenn Bezugsfertigkeit des Gebäudes/der Wohnung vor diesem Zeitpunkt)

**Erfüllt, wenn:**

- „Gibt es eine Wärmedämmung zusätzlich zur vorhandenen Bausubstanz?“ = **Ja** (`Gebäude hat gute Wärmedämmung`)
- **oder** „Wurde die Heizanlage der Wohnung nach dem 1.1.2003 eingebaut?“ = **Ja** (`Gebäude hat moderne Heizanlage`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – ⚠ |

⚠ **offen:** Zu prüfen: Fragebogen fragt in der jüngsten Baualtersklasse nicht nach zusätzlicher Wärmedämmung/moderner Heizanlage, der Text schränkt das Merkmal nur über den Einbauzeitpunkt ein.

- [ ] geprüft

### [Gebäude+] Gebäude ist in überdurchschnittlich gutem Instandhaltungszustand

**Mietspiegel:** Überdurchschnittlich guter Instandhaltungszustand des Gebäude(-teil)s, indem sich die Wohnung befindet (z.B. erneuerte Fassade, Dach)

**Erfüllt, wenn:**

- „Ist das Gebäude, in dem sich die Wohnung befindet, in einem sehr guten Zustand?“ = **Ja** (`Gebäude ist in gutem Zustand`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

## Wohnumfeld

### [Umfeld-] Keine Fahrradabstellmöglichkeit auf dem Grundstück

**Mietspiegel:** Keine Fahrradabstellmöglichkeit auf dem Grundstück

**Erfüllt, wenn:**

- „Ist es möglich auf dem Grundstück des Hauses Fahrräder abzustellen?“ = **Nein** (`Wohnumfeld hat Fahrradabstellmöglichkeiten`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Umfeld-] Lage in vernachlässigter Umgebung

**Mietspiegel:** Lage in stark vernachlässigter Umgebung

**Erfüllt, wenn:**

- „Liegt die Wohnung in einer eher ungepflegten Gegend oder in einem der folgenden sogenannten kriminalitätsbelasteten Ort?“ = **Ja** (`Wohnumfeld ist stark vernachlässigt`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Umfeld-] Lage ist besonders geruchsbelastet

**Mietspiegel:** Besonders geruchsbelastete Lage

**Erfüllt, wenn:**

- „Liegt die Wohnung einer besonders geruchsbelasteten Lage?“ = **Ja** (`Wohnumfeld ist geruchsbelastet`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Umfeld-] Lage ist besonders lärmbelastet

**Mietspiegel:** Lage der Wohnung an einer Straße oder Schienenstrecke mit hoher Verkehrslärmbelastung oder Belastung durch Flugverkehr nach Maßgabe der Erläuterungen zur Verkehrslärmbelastung unter Nr. 12 dieses Mietspiegels

**Erfüllt, wenn:**

- „Liegt die Wohnung in einer besonders lauten Lage?“ = **Ja** (`Wohnumfeld ist besonders laut`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Umfeld+] Aufwändig gestaltetes Wohnumfeld auf dem Grundstück

**Mietspiegel:** Aufwändig gestaltetes Wohnumfeld auf dem Grundstück (z.B. Kinderspielplatz - bei Bezugsfertigkeit des Gebäudes vor 2003, Sitzbänke oder Ruhezonen, gute Gehwegbefestigung mit Grünflächen und Beleuchtung)

**Erfüllt, wenn:**

- „Ist das Grundstück auf dem sich deine Wohnung befindet einladend gestaltetet?“ = **Ja** (`Wohnumfeld ist aufwendig gestaltet`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Umfeld+] Besonders ruhige Lage

**Mietspiegel:** Besonders ruhige Lage

**Erfüllt, wenn:**

- „Liegt die Wohnung in einer besonders ruhigen Lage?“ = **Ja** (`Wohnumfeld ist besonders leise`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Umfeld+] Bevorzugte Citylage

**Mietspiegel:** Bevorzugte Citylage (nahe repräsentativen, überregional ausstrahlenden Einkaufs-, Dienstleistungs- und Wohnstandorten)

**Erfüllt, wenn:**

- „Liegt die Wohnung in der Nähe des Kurfürstendamms oder in Berlin Mitte und in einer repräsentativen und hochwertigen Lage?“ = **Ja** (`Wohnumfeld ist repräsentativ`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Umfeld+] Garten zur alleinigen Nutzung

**Mietspiegel:** Garten zur alleinigen Nutzung/Mietergarten ohne Entgelt oder zur Wohnung gehörender Garten mit direktem Zugang

**Erfüllt, wenn:**

- „Gibt einen Garten zur alleinigen Nutzung oder einen Garten, welcher direkt von der Wohnung aus betreten werden kann?“ = **Ja** (`Wohnumfeld hat eigenen Garten`)
- **oder** „Gibt es einen Gemeinschaftsgarten mit anderen Mieterinnen?“ = **Ja** (`Wohnumfeld hat Gemeinschaftsgarten`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft

### [Umfeld+] Vom Vermieter zur Verfügung gestellter Parkplatz

**Mietspiegel:** Vom Vermieter zur Verfügung gestelltes PKW-Parkplatzangebot in der Nähe

**Erfüllt, wenn:**

- „Gibt es ein von der Vermieterin zur Verfügung gestelltes PKW-Parkplatzangebot in der Nähe der Wohnung?“ = **Ja** (`Wohnumfeld hat Parkplatz`)

| | -1918 | 1919-1949 | 1950-1964 | 1965-1972 | W:1973-1990 | O:1973-1990 | 1991-2002 | 2003-2017 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Laut Text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fragebogen | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- [ ] geprüft
