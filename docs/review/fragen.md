# Fragen im Fragebogen (Miete)

> Automatisch erzeugt von `src/form/verification/questions.test.ts`.
> Nicht von Hand bearbeiten; Änderungen mit `pnpm test:review -u` übernehmen.

Alle Fragen, die im Miete-Ablauf gestellt werden können, mit Wortlaut,
Hinweistext und Antwortoptionen, getrennt nach Mietspiegel-Ausgabe, wenn
sich die Formulierung unterscheidet. Jede Änderung an Formulierungen
erscheint als Diff in dieser Datei und sollte fachlich gegengelesen werden.

## `Adresse`

**Frage:** Wie lautet die Adresse der Wohnung?

- Antworttyp: TextAnswer

## `Ausnahmen`

**Frage:** Trifft eine dieser Aussagen auf die Wohnung zu?

- Die Wohnung ist eine Sozialwohnung (`Sozialwohnung`)
- Die Wohnung liegt in einem Einfamilienhaus, Zweifamilienhaus oder Reihenhaus (`Reihenhaus`)
- Es gibt kein WC innerhalb der Wohnung  (`Wohnung ohne WC `)
- Die Wohnung wird möbliert vermietet (`Möbliert`)
- Keine der Aussagen trifft zu (`Keine`)

## `Bad & WC ohne Waschbecken`

*Mietspiegel 2015, 2017, 2019, 2021, 2023:*

**Frage:** Gibt es ein Badezimmer oder WC, welches kein Handwaschbecken hat?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2024, 2026:*

**Frage:** Gibt es ein Badezimmer oder WC, welches kein Handwaschbecken hat?

**Hinweis:** Beachte: Diese Frage bezieht sich nicht auf Gäste-WCs

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad Boden und Wand hochwertig`

*Mietspiegel 2015:*

**Frage:** Sind in allen Badezimmern hochwertige Boden- oder Wandfliesen verlegt?

**Hinweis:** Dies gilt, wenn die Fliesen nicht einheitlich sind, sondern durch Akzente und Verzierungen aufgewertet wurden (z.B. Mosaikfliesen). Dazu gelten Natursteine wie Marmor, Schiefer oder Granit ebenfalls als hochwertig.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Ist der Bodenbelag und die Wandbekleidung in allen Badezimmern hochwertig?

**Hinweis:** Dies gilt, wenn die Fliesen nicht einheitlich sind, sondern durch Akzente und Verzierungen aufgewertet wurden (z.B. Mosaikfliesen). Dazu gelten Natursteine wie Marmor, Schiefer oder Granit ebenfalls als hochwertig.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad größer als 8qm`

**Frage:** Gibt es ein Badezimmer, das größer als 8qm ist?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad großes Waschbecken`

**Frage:** Gibt es ein Badezimmer, welches entweder ein sehr großes Waschbecken (Außenmaß mindestens 80 cm breit), ein Doppelhandwaschbecken, oder zwei getrennte Waschbecken hat?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad hat bodengleiche Dusche`

**Frage:** Falls die Wohnung eine Dusche hat, ist diese ebenerdig zum Badezimmer oder maximal 3cm tief?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad hat Dusche und Wanne`

**Frage:** Gibt es in der Wohnung sowohl eine Dusche als auch eine separate Badewanne?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad hat Duschmöglichkeit`

*Mietspiegel 2015, 2017, 2019, 2021, 2023:*

**Frage:** Gibt es in der Wohnung eine Möglichkeit zu Duschen?

**Hinweis:** Dies ist erfüllt, wenn du eine Dusche oder eine Badewanne mit Duschkopf hast.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2024, 2026:*

**Frage:** Gibt es in der Wohnung eine Möglichkeit zu Duschen?

**Hinweis:** Die Duschmöglichkeit muss einen Spritzwasserschutz und eine Duschkopfhalterung haben.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad hat Einhebelmischbatterie`

**Frage:** Haben die Waschbecken und Badewannen überwiegend eine  Einhebelmischbatterie (wie z.B. auf diesem Bild)?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad hat hochwertiges Stand-WC`

**Frage:** Sind alle Toiletten hochwertige Stand-WCs?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad hat wandhängendes WC`

**Frage:** Sind alle Toiletten wandhängend mit Spülkasten in der Wand (wie z.B. auf diesem Bild)?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad hat Warmwasser`

*Mietspiegel 2015, 2017, 2019, 2021, 2023:*

**Frage:** Gibt es im Badezimmer eine ausreichende Warmwasserversorgung?

**Hinweis:** Das ist der Fall, wenn es einen Durchlauferhitzer, einen Boiler mit mehr als 60 Litern oder eine zentrale Warmwasserversorgung vorhanden ist.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2024, 2026:*

**Frage:** Gibt es im Badezimmer eine ausreichende Warmwasserversorgung?

**Hinweis:** Das ist der Fall, wenn es einen Durchlauferhitzer, einen Boiler mit mehr als 60 Litern oder eine zentrale Warmwasserversorgung vorhanden ist. Beachte: Diese Frage bezieht sich nicht auf Gäste-WCs.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad mindestens 4qm`

**Frage:** Gibt es ein Badezimmer mit mindestens 4 m² Grundfläche?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad mit alter Heizung`

**Frage:** Gibt es ein Badezimmer oder WC, welches nur mit einer Holz-/Kohleheizung oder einem Elektroheizstrahler beheizbar ist?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad mit Dielenfußboden`

*Mietspiegel 2015, 2017:*

**Frage:** Gibt es ein Badezimmer mit Dielenfußboden?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2019, 2021, 2023:*

**Frage:** Gibt es ein Badezimmer mit Dielenfußboden, welcher nicht feuchtraumgeeignet ist?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2024, 2026:*

**Frage:** Gibt es ein Badezimmer mit Dielenfußboden, welcher nicht feuchtraumgeeignet ist?

**Hinweis:** Beachte: Diese Frage bezieht sich nicht auf Gäste-WCs

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad mit Fußbodenheizung`

**Frage:** Gibt es ein Badezimmer mit Fußbodenheizung?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad mit hochwertiger Ausstattung`

**Frage:** Gibt es ein Badezimmer mit besonderer und hochwertiger Ausstattung (z.B. hochwertige Sanitärausstattung, hochwertige Badmöbel, Eckwanne/Rundwanne)?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad mit moderner Entlüftung`

**Frage:** Gibt es ein innen liegendes Badezimmer mit moderner, gesteuerter Entlüftung (z.B. mittels Feuchtigkeitssensor)?

**Hinweis:** Beachte: Eine durch (Licht-)Schalter bediente Entlüftung gilt nicht modern.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad mit Strukturheizkörper`

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Gibt es ein Badezimmer mit einem Strukturheizkörper als Handtuchwärmer (wie z.B. auf diesem Bild)?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2024, 2026:*

**Frage:** Gibt es ein Badezimmer mit einen elektrischen Strukturheizkörper als Handtuchwärmer (wie z.B. auf diesem Bild)?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad mit WC ohne Fenster`

**Frage:** Gibt es ein Badezimmer mit einer Toilette, welches kein Fenster hat?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad nur kleines Waschbecken`

**Frage:** Gibt es ein Badezimmer, welches lediglich ein kleines Handwaschbecken (Außenmaß 50x25cm oder kleiner) hat?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad ohne Heizung`

*Mietspiegel 2015, 2017, 2019, 2021, 2023:*

**Frage:** Gibt es ein Badezimmer oder WC, welches nicht beheizbar ist?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2024, 2026:*

**Frage:** Gibt es ein Badezimmer welches nicht beheizbar ist?

**Hinweis:** Beachte: Diese Frage bezieht sich nicht auf Gäste-WCs

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Bad Wände ausreichend gefließt`

**Frage:** Sind die Wände in den Badezimmern um Dusche, Badewanne und Waschbecken so gefließt, dass die ungeschützte Wand normalerweise nicht nass wird?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Badezimmer in Wohnung`

**Frage:** Hat die Wohnung ein Badezimmer?

**Hinweis:** Beachte: Dies trifft auf fast alle Wohnungen in Berlin zu.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Baujahr`

**Frage:** 

- Antworttyp: NumberAnswer

## `Baujahr ab 1991`

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** In welchem Jahr wurde das Dachgeschoss ausgebaut.

- Antworttyp: NumberAnswer

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** In welchem Jahr wurde das Haus, in dem sich die Wohnung befindet, erbaut?

- Antworttyp: NumberAnswer

## `Baujahr vor 1.10.2014`

**Frage:** Wurde das Haus, in dem sich die Wohnung befindet, vor dem 01.10.2014 erbaut?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Baujahr vor 1991`

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Wann wurde das Dachgeschoss ausgebaut?

**Hinweis:** Das Baujahr des Hauses findest du in dem Energieausweis, welchen du bei Abschluss des Mietvertrages erhalten haben solltest. Alternativ kannst du das Baujahr auch schätzen und später korrigieren.

- Bis einschließlich 1918 (`-1918`)
- 1919-1949 (`1919-1949`)
- 1950-1964 (`1950-1964`)
- 1965-1972 (`1965-1972`)
- 1973-1985 (`1973-1985`)
- 1986-1990 (`1986-1990`)
- Ab einschließlich 1991 (`1991-`)

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Wann wurde das Haus, in dem sich deine Wohnung befindet, erbaut?

**Hinweis:** Das Baujahr des Hauses findest du in dem Energieausweis, welchen du bei Abschluss des Mietvertrages erhalten haben solltest. Alternativ kannst du das Baujahr auch schätzen und später korrigieren.

- Bis einschließlich 1918 (`-1918`)
- 1919-1949 (`1919-1949`)
- 1950-1964 (`1950-1964`)
- 1965-1972 (`1965-1972`)
- 1973-1985 (`1973-1985`)
- 1986-1990 (`1986-1990`)
- Ab einschließlich 1991 (`1991-`)

## `Dachgeschoss`

**Frage:** Liegt deine Wohnung in einem nachträglich ausgebauten Dachgeschoss?

- Ja
- Nein
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Duschen nur in freistehender Badewanne`

**Frage:** Gibt es als einzige Duschmöglichkeit eine freistehende Badewanne?

**Hinweis:** Eine Badewanne gilt als freistehend, wenn sie an keiner Seite fest mit der Wand verbunden ist.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Duschen nur in freistehender Badewanne in nicht modernisiertem Bad`

**Frage:** Befindet sich die Badewanne in einem nicht modernisierten Bad?

**Hinweis:** Ein Bad gilt als nicht modernisiert, wenn es z.B. nicht ausreichend im Spritzwasserbereich gefließt ist oder der Boden nicht feuchtigkeitsgeeignet ist.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Energiebedarfskennwert`

*Mietspiegel 2015:*

**Frage:** Wie hoch ist der Energiebedarfskennwert der Wohnung?

- Größer als 300 kWH/(m2*a) (`---`)
- Zwischen 253 und 299 kWH/(m2*a) (`--`)
- Zwischen 205 und 252 kWH/(m2*a) (`-`)
- Zwischen 144 und 204 kWH/(m2*a) (`0`)
- Zwischen 120 und 143 kWH/(m2*a) (`+`)
- Zwischen 96 und 119 kWH/(m2*a) (`++`)
- Kleiner als 96 kWH/(m2*a) (`+++`)

*Mietspiegel 2017, 2019, 2021, 2023:*

**Frage:** Wie hoch ist der Energiebedarfskennwert der Wohnung?

- Größer als 282 kWH/(m2*a) (`---`)
- Zwischen 235 und 282 kWH/(m2*a) (`--`)
- Zwischen 187 und 234 kWH/(m2*a) (`-`)
- Zwischen 144 und 186 kWH/(m2*a) (`0`)
- Zwischen 120 und 143 kWH/(m2*a) (`+`)
- Zwischen 96 und 119 kWH/(m2*a) (`++`)
- Kleiner als 96 kWH/(m2*a) (`+++`)

*Mietspiegel 2024, 2026:*

**Frage:** Wie hoch ist dein Energiebedarfskennwert?

- Größer als 282 kWH/(m2*a) (`---`)
- Zwischen 235 und 282 kWH/(m2*a) (`--`)
- Zwischen 176 und 234 kWH/(m2*a) (`-`)
- Zwischen 144 und 175 kWH/(m2*a) (`0`)
- Zwischen 120 und 143 kWH/(m2*a) (`+`)
- Zwischen 96 und 119 kWH/(m2*a) (`++`)
- Kleiner als 96 kWH/(m2*a) (`+++`)

## `Energieverbrauchskennwert`

*Mietspiegel 2015:*

**Frage:** Wie hoch ist der Energieverbrauchskennwert der Wohnung?

- Größer als 250 kWH/(m2*a) (`---`)
- Zwischen 211 und 250 kWH/(m2*a) (`--`)
- Zwischen 171 und 210 kWH/(m2*a) (`-`)
- Zwischen 120 und 170 kWH/(m2*a) (`0`)
- Zwischen 100 und 119 kWH/(m2*a) (`+`)
- Zwischen 80 und 99 kWH/(m2*a) (`++`)
- Kleiner als 80 kWH/(m2*a) (`+++`)

*Mietspiegel 2017, 2019, 2021, 2023:*

**Frage:** Wie hoch ist der Energieverbrauchskennwert der Wohnung?

- Größer als 235 kWH/(m2*a) (`---`)
- Zwischen 196 und 235 kWH/(m2*a) (`--`)
- Zwischen 156 und 195 kWH/(m2*a) (`-`)
- Zwischen 120 und 155 kWH/(m2*a) (`0`)
- Zwischen 100 und 119 kWH/(m2*a) (`+`)
- Zwischen 80 und 99 kWH/(m2*a) (`++`)
- Kleiner als 80 kWH/(m2*a) (`+++`)

*Mietspiegel 2024, 2026:*

**Frage:** Wie hoch ist der Energieverbrauchskennwert der Wohnung?

- Größer als 235 kWH/(m2*a) (`---`)
- Zwischen 196 und 235 kWH/(m2*a) (`--`)
- Zwischen 146 und 195 kWH/(m2*a) (`-`)
- Zwischen 120 und 145 kWH/(m2*a) (`0`)
- Zwischen 100 und 119 kWH/(m2*a) (`+`)
- Zwischen 80 und 99 kWH/(m2*a) (`++`)
- Kleiner als 80 kWH/(m2*a) (`+++`)

## `Gebäude hat <5 Stockwerke und Fahrstuhl`

**Frage:** Liegt in die Wohnung im vierten Stockwerk oder niedriger?

**Hinweis:** Beachte: Das Erdgeschoss zählt nicht als Stockwerk.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat >=5 Stockwerke und kein Fahrstuhl`

**Frage:** Liegt in die Wohnung im fünften Stockwerk oder höher?

**Hinweis:** Beachte: Das Erdgeschoss zählt nicht als Stockwerk.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat Fahrradabstellmöglichkeit`

**Frage:** Ist es möglich, auf dem Grundstück des Hauses Fahrräder abzustellen?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat Fahrradabstellraum`

**Frage:** Gibt es einen leicht zugänglichen, abschließbaren Raum zum Abstellen von Fahrrädern?

**Hinweis:** Beachte: dieser Raum muss groß genug sein, dass er genug Platz für alle ihn nutzenden Bewohner*innen bietet.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat Fahrradstellplätze mit Anschließmöglichkeit`

*Mietspiegel 2015:*

**Frage:** Gibt es einen leicht zugänglichen, abschließbaren Raum zum Abstellen von Fahrrädern?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2017:*

**Frage:** Gibt es einen leicht zugänglichen, abschließbaren Raum zum Abstellen von Fahrrädern?

**Hinweis:** Beachte: dieser Raum muss groß genug sein, dass er genug Platz für alle ihn nutzenden Bewohner*innen bietet.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2019, 2021, 2023, 2024, 2026:*

**Frage:** Gibt es auf dem Grundstück des Hauses ausreichend Stellplätze für Fahrräder, an denen du das Fahrrad sicher anschließen kannst?

**Hinweis:** Beachte: Einfache Fahrradständer an denen lediglich die Vorderräder angeschlossen werden können gelten nicht, da sie nicht sicher sind. Auch diese Stellplätze müssen genug Platz für alle Mieter*innen bieten.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat Fahrstuhl`

**Frage:** Gibt es einen Fahrstuhl, mit dem die Wohnung erreicht werden kann?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat Gegensprechanlage`

**Frage:** Gibt es eine Gegensprechanlage mit elektrischem Türöffner?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat Gegensprechanlage mit Kamera`

**Frage:** Hat die Gegensprechanlage eine Kamera?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat gute Wärmedämmung`

**Frage:** Gibt es eine Wärmedämmung zusätzlich zur vorhandenen Bausubstanz?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat Heizanlage mit ungünstigem Wirkungsgrad`

*Mietspiegel 2015:*

**Frage:** Wurde die Heizanlage der Wohnung vor 1984 eingebaut?

**Hinweis:** Beachte: Unter der Heizanlage versteht man nur das Gerät, welches die Wärme produziert, wie z.B. Gasheizungen, Ölheizungen oder Wärmepumpen. Die Heizkörper selber gehören nicht zur Heizanlage.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2017, 2019, 2021, 2023:*

**Frage:** Wurde die Heizanlage der Wohnung vor 1988 eingebaut?

**Hinweis:** Beachte: Unter der Heizanlage versteht man nur das Gerät, welches die Wärme produziert, wie z.B. Gasheizungen, Ölheizungen oder Wärmepumpen. Die Heizkörper selber gehören nicht zur Heizanlage.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2024, 2026:*

**Frage:** Wurde die Heizanlage der Wohnung vor 1995 eingebaut?

**Hinweis:** Beachte: Unter der Heizanlage versteht man nur das Gerät, welches die Wärme produziert, wie z.B. Gasheizungen, Ölheizungen oder Wärmepumpen. Die Heizkörper selber gehören nicht zur Heizanlage.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat moderne Heizanlage`

*Mietspiegel 2015:*

**Frage:** Wurde die Heizanlage der Wohnung nach dem 1.7.1994 erneuert?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2017, 2019, 2021, 2023:*

**Frage:** Wurde die Heizanlage der Wohnung nach dem 1.1.2003 eingebaut?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2024, 2026:*

**Frage:** Wurde die Heizanlage der Wohnung nach dem 1.1.2009 erneuert?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat Parkplatz`

**Frage:** Gibt es einen kostenlosen Garagen- oder Stellplatz, der ohne zusätzliche Kosten zur Wohnung gehört?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat privaten Abstellraum`

**Frage:** Gibt es einen privaten Keller, Dachboden oder Abstellraum, der zu der Wohnung gehört?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat privaten Keller`

*Mietspiegel 2017, 2019, 2021, 2023:*

**Frage:** Gibt es einen privaten Keller oder Abstellraum, der zu der Wohnung gehört?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2024, 2026:*

**Frage:** Gibt es einen privaten Keller oder Abstellraum, der zu der Wohnung gehört?

**Hinweis:** Ein solcher Raum zählt nicht, wenn du für diesen eine gesonderte Miete zahlst.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat schlechte Wärmedämmung`

**Frage:** Ist die Wärmedämmung der Wohnung sehr schlecht?

**Hinweis:** Hinweise hierfür können etwa sein, dass es in der Wohnung zieht oder dass es sehr schnell wieder kalt wird, nachdem man im Winter die Heizung ausschaltet.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat schwellenarmen Zugang`

**Frage:** Ist ein schwellenarmer Zugang zum Gebäude (max. 1 Stufe) und der Wohnung (max. 1 Stufe) möglich?

**Hinweis:** Beachte: Es kommt nicht darauf an, dass du auf den schwellenarmen Zugang angewiesen bist.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat sichere Haustür`

**Frage:** Hat das Gebäude eine einbruchssichere Haustür?

**Hinweis:** Hierzu zählt z.B. mehrere Schließbolzen, automatische Alarmanlage oder Aufbohrschutz

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat Treppenhaus in gutem Zustand`

**Frage:** Sind das Treppenhaus und der Eingangsbereich hochwertig saniert oder repräsentativ?

**Hinweis:** Beachte: Nur ein guter Zustand reicht nicht aus. Anzeichen für repräsentatives Treppenhaus oder Eingangsbereich sind z.B.: Läufer im gesamten Bereich, Marmor, Spiegel, aufwändige Wand- und Deckengestaltung.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat Treppenhaus in schlechtem Zustand`

**Frage:** Sind das Treppenhaus oder der Eingangsbereich stark abgenutzt und renovierungsbedürftig?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude hat zusätzliche Räume`

**Frage:** Werden von der Vermieterin noch zusätzliche Räume angeboten?

**Hinweis:** Hierzu zählt z.B. Gemeinschaftsräume, Gemeinschaftsküche oder ein Fitnessraum.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude Hauseingangstür ist nicht abschließbar`

**Frage:** Ist es jederzeit möglich ohne Schlüssel bis zu deiner Wohnungstür zu kommen?

**Hinweis:** Dies ist etwa der Fall wenn das Treppenhaus keine Eingangstür hat. Es reicht nicht aus, dass der Gebäude-Eingang kurzzeitig kaputt ist.
Wenn du im Hinterhaus wohnst, reicht es wenn man das Vorderhaus abschließen kannst.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude ist dicht bebaut`

**Frage:** Befindet sich die Wohnung im Seitenflügel mit sehr dichter Bebauung?

**Hinweis:** Dies ist der Fall, wenn alle Fenster zu einem geschlossenen Hinterhof hinausgehen, bei dem die anderen Häuser nur wenige Meter entfernt stehen.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude ist in gutem Zustand`

**Frage:** Ist das Gebäude, in dem sich die Wohnung befindet, in einem sehr guten Zustand?

**Hinweis:** Insgesamt sollte der Eindruck eines frisch renovierten Hauses entstehen. Das ist dann anzunehmen, wenn sowohl Fassade als auch Dach den Eindruck machen frisch renoviert zu sein.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Gebäude ist in schlechtem Zustand`

**Frage:** Ist das Gebäude, in dem sich die Wohnung befindet, in einem schlechten Zustand?

**Hinweis:** Hierzu zählen z.B.: dauernde Durchfeuchtung des Mauerwerks (auch im Keller), große Putzschäden oder erhebliche Schäden am Dach.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Getrenntes WC`

**Frage:** Sind Badezimmer und Toilette in zwei getrennten Räumen?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Kennt Energieverbrauch oder Energiebedarf`

**Frage:** Kennst du den Energieverbrauchskennwert oder den Energiebedarfskennwert deiner Wohnunng?

**Hinweis:** Wenn du beide Werte kennst, wähle am besten den Energieverbrauchskennwer aus. Diese Werte müssen auf dem Energieausweis stehen, welcher dir vor dem Einzug gezeigt wurde.

- Ja, ich kenne den Energieverbrauchswert (`Energieverbrauchswert`)
- Ja, aber nur den Ernergiebedarfswert (`Ernergiebedarfswert`)
- Nein (`Nein`)

## `Küche hat Ceran-/Induktionsherd`

**Frage:** Handelt es sich bei dem Herd um ein Ceran- oder Induktions-Kochfeld?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche hat Dunstabzug`

**Frage:** Ist die Küche von der Vermieterin mit einer Dunstabzugshaube ausgestattet worden?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche hat Einbauküche`

**Frage:** Ist die Küche von der Vermieterin mit einer Einbauküche mit Ober- und Unterschränken, Herd und Spüle ausgestattet worden?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche hat Gas/Elektroherd ohne Backofen`

**Frage:** Handelt es sich bei dem Herd um einen Gas- oder Elektroherd ohne Backofen?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche hat Heizung`

**Frage:** Ist die Küche beheizbar?

**Hinweis:** Beachte: Eine Holz- oder Kohleheizung zählt nicht.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche hat hochwertigen Fußboden`

**Frage:** Ist in der Küche von der Vermieterin ein hochwertiger Fußboden verlegt worden?

**Hinweis:** Hierzu zählen z.B. hochwertige Fliesen, hochwertiges Linoleum, hochwertiges Feuchtraumlaminat, Parkett oder Terrazzo. Gilt nur, wenn diese auch in einem guten Zustand sind.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche hat Kochmöglichkeit`

**Frage:** Ist die Küche von der Vermieterin mit einem Herd ausgestattet worden?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche hat Kücheninsel`

**Frage:** Ist die Küche von der Vermieterin mit einer freistehenden Kücheninsel mit Kochmöglichkeit oder Spüle ausgestattet worden?

**Hinweis:** Freistehend heißt, dass diese nicht mit einer Wand oder einer anderen Arbeitsfläche verbunden ist. L-förmige Küchentheken sind daher nicht freistehend.

- Ja (`Ja`)
- Nein  (`Nein`)
- Ich bin mir nicht sicher (`nicht sicher`)

## `Küche hat Kühlschrank`

*Mietspiegel 2015, 2017, 2019, 2021, 2023:*

**Frage:** Ist die Küche von der Vermieterin mit einem Kühlschrank ausgestattet worden?

**Hinweis:** Der Kühlschrank zählt nur wenn er bei der Überlassung in einem annähernd neuwertigen Zustand war und der Vermieter keine extra Miete für diesen verlangt.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2024, 2026:*

**Frage:** Ist die Küche von deiner Vermieterin mit mindestens einem der folgenden Geräte ausgestattet: Kühlschrank, Tiefkühlschrank, Geschirrspüler.

**Hinweis:** Diese Geräte zählen nur wenn sie bei der Überlassung in einem annähernd neuwertigen Zustand waren und der Vermieter keine extra Miete für sie verlangt.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche hat Lüftung`

**Frage:** Gibt es in Küche ein Fenster oder eine andere Möglichkeit zur Entlüftung?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche hat Spüle`

**Frage:** Ist die Küche von der Vermieterin mit einem Spülbecken ausgestattet worden?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche hat Warmwasser`

**Frage:** Gibt es in der Küche eine ausreichende Warmwasserversorgung?

**Hinweis:** Dies ist erfüllt, wenn z.B. eine zentrale Warmwasserversorgung, ein Durchlauferhitzer, oder ein Boiler existiert.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche ist gefliest`

**Frage:** Sie die Wände um die Arbeitsbereiche in der Küche gefliest oder mit einem anderen Wandbelag bedeckt, den man gut reinigen kann?

**Hinweis:** Dies können etwa Silikonfarbe, Linoleum, Edelstahl oder behandeltes Holz sein.
Dabei geht es um die Bereiche, die bei einer normalen Benutzung häufig dreckig werden

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`nicht sicher`)

## `Küche ist groß`

**Frage:** Ist die Küche mindestens 14qm groß?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche ist separater Raum`

**Frage:** Handelt es sich bei der Küche um einen separaten Raum?

**Hinweis:** Beachte: Offene Küchen und Wohnküchen gelten nicht als separate Räume.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Küche kann Spülmaschine`

**Frage:** Ist es möglich in der Küche einen Geschirrspüler aufzustellen und anzuschließen?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Mehrere WCs`

**Frage:** Gibt es in der Wohnung zwei oder mehr Toiletten?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Mietart`

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Ist in dem Mietvertrag eine Staffelmiete oder Indexmiete vereinbart?

**Hinweis:** Wenn eine Staffelmiete oder Indexmiete vereinbart ist, muss dies explizit in deinem Mietvertrag angegeben sein.

- Staffelmiete (`Staffelmiete`)
- Indexmiete (`Indexmiete`)
- Keins von beiden (`Normal`)

*Mietspiegel 2026:*

**Frage:** Ist in dem Mietvertrag eine Staffelmiete oder Indexmiete vorgesehen?

**Hinweis:** Wenn eine Staffelmiete oder Indexmiete vereinbart ist, muss dies explizit in deinem Mietvertrag angegeben sein.

- Staffelmiete (`Staffelmiete`)
- Indexmiete (`Indexmiete`)
- Keins von beiden (`Normal`)

## `Mieter zahlt für Kaltwasserzähler`

**Frage:** Zahlt die Mieterin der Wohnung die Kosten für die Miete des wohnungbezogenen Kaltwasserzählers?

**Hinweis:** Falls dies der Fall ist, findest du die Kosten hierfür in der Betriebskostenabrechnung.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Nettokaltmiete`

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Wie hoch war die Nettokaltmiete bei Abschluss des Mietvertrages?

**Hinweis:** Wichtig: Die Nettokaltmiete  ist unterschiedlich zur "normalen" Kaltmiete. Sie beinhaltet keine Betriebskosten, wie z.B. Heizung oder Wasser. Du findest diesen Wert in deinem Mietvertrag.

- Antworttyp: NumberAnswer

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Auf welchen Betrag ist die Nettokaltmiete mit der letzten Mietstaffel gestiegen?

**Hinweis:** Wichtig: Die Nettokaltmiete  ist unterschiedlich zur "normalen" Kaltmiete. Sie beinhaltet keine Betriebskosten, wie z.B. Heizung oder Wasser. Du findest diesen Wert in deinem Mietvertrag.

- Antworttyp: NumberAnswer

*Mietspiegel 2026:*

**Frage:** Wie hoch ist die vorgesehene Nettokaltmiete?

**Hinweis:** Wichtig: Die Nettokaltmiete  ist unterschiedlich zur "normalen" Kaltmiete. Sie beinhaltet keine Betriebskosten, wie z.B. Heizung oder Wasser. Du findest diesen Wert in deinem Mietvertrag.

- Antworttyp: NumberAnswer

## `Neue Mietstaffel seit Vertragsabschluss`

**Frage:** Ist seit Abschluss des Mietvertrages bereits eine neue Mietstaffel in Kraft getreten?

- Ja (`Ja`)
- Nein (`Nein`)

## `Ost`

**Frage:** [Hidden Question]

- Antworttyp: BooleanAnswer

## `Qm`

**Frage:** Wie groß ist die Wohnung in qm?

**Hinweis:** Diese Information findest du in deinem Mietvertrag. Du kannst du den Wert auch schätzen und später korrigieren.

- Antworttyp: NumberAnswer

## `Renovierungskosten ein Drittel des Neubaupreises`

**Frage:** Waren die Renovierungskosten mindestens ein Drittel des Neubaupreis?

**Hinweis:** Den genauen Neubaupreis kann man als Mieter*in meist nur schätzen. Du kannst dafür etwa 800€ pro Quadratmeter veranschlagen.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Sondermerkmal Aufzug`

**Frage:** Gibt es im Haus einen Aufzug?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Sondermerkmal Badezimmer mindestens 4qm`

**Frage:** Gibt es ein Badezimmer mit mindestens 4 m² Grundfläche?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Sondermerkmal Bodenbelag`

**Frage:** Ist in der Mehrheit der Wohnräume einen hochwertiger Bodenbelag verlegt?

**Hinweis:** Hierzu zählt z.B. hochwertiges Parkett, Natur-/Kunststein, Fliesen oder gleichwertiger Bodenbelag

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Sondermerkmal Dusche Und Badewanne`

**Frage:** Gibt es in der Wohnung eine Dusche sowie eine Badewanne?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Sondermerkmal Moderne Küche`

**Frage:** Ist die Küche modern ausgestattet?

**Hinweis:** Dafür sind notwendig: Küchenschränke, Einbauspüle, Dunstabzugshaube, Herd mit Ceran- oder Induktionskochfeld, Backofen, Wandfliesen im Arbeitsbereich, Kühlschrank.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Sondermerkmal Modernes Bad`

**Frage:** Sind die Badezimmer modern ausgestattet?

**Hinweis:** Ein Badezimmer gilt als modern ausgestattet, wenn die Wände neben Waschbecken, Badewanne und Dusche gefliest sind. Bodenfliesen, Einhebelmischbatterie, Strukturheizkörper als Handtuchwärmer und Badewanne oder Dusche vorhanden sind.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Sondermerkmal Schallschutzfenster`

**Frage:** Sind in der Wohnung überwiegend Schallschutzfenster oder Isolierverglasung (Einbau ab 1987) eingebaut?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Typ`

**Frage:** Was möchtest du überprüfen?

- Miete für aktuelle oder neue Wohnung (`Miete`)
- Mieterhöhung (`Mieterhöhung`)

## `Unterschrieben`

**Frage:** Hast du den Mietvertrag für die Wohnung bereits unterschrieben?

- Ja (`Ja`)
- Nein (`Nein`)

## `Vermiete hat Vormiete mitgeteilt`

**Frage:** Hat die Vermieterin dir mitgeteilt wie hoch die Miete der Vormieterin war?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Vermieter hat Renovierungskosten mitgeteilt`

**Frage:** Hat die Vermieterin dir Auskunft über die Höhe der Renovierungskosten gegeben?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Vermieter hat Renovierungskosten schriftlich mitgeteilt`

**Frage:** Wurde dir die Höhe der Renovierungskosten schriftlich mitgeteilt?

**Hinweis:** Dazu zählt Papier, Email, Fax, WhatsApp, SMS oder irgendeine nicht rein mündliche Mitteilung.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Vermieter hat über umfassende Sanierung informiert`

**Frage:** Hat die Vermieterin sich bei Abschluss des Mietvertrages darauf berufen, dass es sich um die erstmalige Vermietung nach umfassender Renovierung handelt?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Vermieter hat über Vormiete informiert`

**Frage:** Hat die Vermieterin sich bei Abschluss des Mietvertrages darauf berufen, dass die Mietpreisbremse nicht gilt, weil die Vormieterin bereits eine höhere Miete gezahlt hat?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Vermieter hat Vormiete schriftlich mitgeteilt`

**Frage:** Wurde dir die Höhe der Miete schriftlich mitgeteilt?

**Hinweis:** Dazu zählt Papier, Email, Fax, WhatsApp, SMS oder irgendeine nicht rein mündliche Mitteilung.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Vertragsdatum`

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Wann hast du den Mietvertrag unterschrieben?

- Vor 01.06.2015 (`<2015`)
- Zwischen 01.06.2015 und 31.08.2016 (`2015-2016`)
- Zwischen 01.09.2016 und 31.08.2018 (`2016-2018`)
- Zwischen 01.09.2018 und 31.08.2020 (`2018-2020`)
- Zwischen 01.09.2020 und 31.08.2022 (`2020-2022`)
- Zwischen 01.09.2022 und 31.08.2023 (`2022-2024`)
- Zwischen 01.09.2023 und 31.08.2025 (`2024-2026`)
- Ab 01.09.2025 (`>2026`)

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Wann ist die letzte Mietstaffel in Kraft getreten?

**Hinweis:** Du findest diese Information in deinem Mietvertrag.

- Vor 01.06.2015 (`<2015`)
- Zwischen 01.06.2015 und 31.08.2016 (`2015-2016`)
- Zwischen 01.09.2016 und 31.08.2018 (`2016-2018`)
- Zwischen 01.09.2018 und 31.08.2020 (`2018-2020`)
- Zwischen 01.09.2020 und 31.08.2022 (`2020-2022`)
- Zwischen 01.09.2022 und 31.08.2023 (`2022-2024`)
- Zwischen 01.09.2023 und 31.08.2025 (`2024-2026`)
- Ab 01.09.2025 (`>2026`)

## `Vorherige Mieterhöhung`

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Hat sich deine Miete seit Abschluss des Mietvertrages mindestens einmal erhöht?

- Ja (`Ja`)
- Nein (`Nein`)

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Hat sich deine Miete seit Beginn der letzten Mietstaffel mindestens einmal erhöht?

- Ja (`Ja`)
- Nein (`Nein`)

## `Vormiete`

**Frage:** Wie hoch ist die von der Vermieterin genannte Nettokaltmiete der Vormieterin?

- Antworttyp: NumberAnswer

## `WC ohne Lüftung`

*Mietspiegel 2015, 2017, 2019, 2021, 2023:*

**Frage:** Gibt es einen Raum mit einer Toilette, in welchem es keine Möglichkeit zur Entlüftung gibt?

**Hinweis:** Dies ist der Fall, wenn es in dem Raum kein Fenster und keine Lüftungsanlage gibt.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2024, 2026:*

**Frage:** Gibt es einen Raum mit einer Toilette, in welchem es keine Möglichkeit zur Entlüftung gibt?

**Hinweis:** Dies ist der Fall, wenn es in dem Raum kein Fenster und keine Lüftungsanlage gibt. Beachte: Diese Frage bezieht sich nicht auf Gäste-WCs.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnlage`

**Frage:** [Hidden Question]

- einfach (`einfach`)
- mittel (`mittel`)
- gut (`gut`)

## `Wohnnung hat sichtbare Bewässerungsleitungen`

**Frage:** Sind die Be- und Entwässerungleitungen überwiegend sichtbar verlegt?

**Hinweis:** Zu den Be- und Entwässerungleitungen gehören zum Beispiel Wasserleitungen im Badezimmer, der Küche oder zu einer Therme.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld hat eigenen Garten`

**Frage:** Gibt einen Garten zur alleinigen Nutzung oder einen Garten, welcher direkt von der Wohnung aus betreten werden kann?

**Hinweis:** Beachte: Dieser zählt auch, wenn er zur Miete zusätzlich bezahlt werden muss.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld hat Fahrradabstellmöglichkeiten`

**Frage:** Ist es möglich auf dem Grundstück des Hauses Fahrräder abzustellen?

**Hinweis:** Beachte: Es reicht aus, dass es generell möglich ist Fahrräder irgendwo auf dem Grundstück abzustellen, z.B. im Hinterhof oder einem Fahrradkeller. Es muss hierfür nicht extra Fahrradständer oder ähnliches geben.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld hat Gemeinschaftsgarten`

**Frage:** Gibt es einen Gemeinschaftsgarten mit anderen Mieterinnen?

**Hinweis:** Beachte: Dieser gilt nur, wenn für den Garten nicht zusätzlich gezahlt werden muss.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld hat gepflegte Müllstandsfläche`

**Frage:** Gibt es auf dem Grundstück des Hauses eine gepflegte Müllstandsfläche mit sichtbegrenzender Gestaltung?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld hat Parkplatz`

**Frage:** Gibt es ein von der Vermieterin zur Verfügung gestelltes PKW-Parkplatzangebot in der Nähe der Wohnung?

**Hinweis:** Beachte: Das Parkplatzangebot darf auch kostenpflichtig sein

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld hat ungepflegte Müllstandsfläche`

**Frage:** Gibt es auf dem Grundstück des Hauses eine ungepflegte, offene Müllstandsfläche?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld hat villenartige Mehrfamilienhäuser`

**Frage:** Befinden sich in der Umgebung des Hauses villenartige Mehrfamilienhäuser?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld ist aufwendig gestaltet`

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Ist das Grundstück auf dem sich deine Wohnung befindet einladend gestaltetet?

**Hinweis:** Das ist etwa der Fall, wenn es Grünflächen mit angelegten Wegen gibt oder Sitzbänke und Ruhezonen. Diese dürfen zudem nicht in einem verwahrlosten Zustand sein.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Ist das Grundstück auf dem sich deine Wohnung befindet einladend gestaltetet?

**Hinweis:** Das ist etwa der Fall, wenn es Grünflächen mit angelegten Wegen gibt, einen Kinderspielplatz oder Sitzbänke und Ruhezonen. Diese dürfen zudem nicht in einem verwahrlosten Zustand sein.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld ist besonders laut`

**Frage:** Liegt die Wohnung in einer besonders lauten Lage?

**Hinweis:** Dies gilt wenn die Wohnung z.B. an einer Hauptverkehrsstraße, einer lauten Bahnstrecke oder in Flughafennähe in einer Einflugschneise liegt. Zudem kommen auch Lärm erheblicher Lärm durch Industrie und Gastronomie oder Musik in Frage. Diese dürfen aber nicht nur vorübergehend auftreten (etwa Baustellen/Straßenfeste), sondern müssen langfristig und regelmäßig auftreten.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld ist besonders leise`

**Frage:** Liegt die Wohnung in einer besonders ruhigen Lage?

**Hinweis:** Beachte: eine einfache, ruhige Wohnstraße etwa in einer 30er-Zone reicht nicht aus. Nur die Lage an einem ruhigen Park oder in einer Straße mit besonderen (baulichen) Maßnahmen zur Verkehrsberuhigung kommen in Frage. Es darf neben dem Straßenverkehr auch keine anderen Lärmquellen geben, wie etwa Gastronomie.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld ist geräuschs- oder geruchsbelastet`

**Frage:** Ist die Wohnung regelmäßig und erheblich durch Geräusche oder Gerüche von Gewerbe beeinträchtigt?

**Hinweis:** Beachte: Damit ist hier nicht allgemeiner Verkehrlärm, sondern Lärm durch z.B. gewerblichen Liefer- und Kundenverkehr gemeint

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld ist geruchsbelastet`

**Frage:** Liegt die Wohnung einer besonders geruchsbelasteten Lage?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld ist repräsentativ`

**Frage:** Liegt die Wohnung in der Nähe des Kurfürstendamms oder in Berlin Mitte und in einer repräsentativen und hochwertigen Lage?

**Hinweis:** Beachte: die Einschätzung der Wohnlage als gut nach dem Mietspiegelverzeichnis reicht nicht aus.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnumfeld ist stark vernachlässigt`

**Frage:** Liegt die Wohnung in einer eher ungepflegten Gegend oder in einem der folgenden sogenannten kriminalitätsbelasteten Ort?

**Hinweis:** Laut Polizei, zählen die folgenden Orte als kriminalitätsbelastet: Wrangelkiez im Umfeld des Görlitzer Parks, Kottbusser Tor, Hermannstraße in direkter Nähe vom S-Bahnhof Neukölln, Donaukiez im Umfeld des Hermannplatzes.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Abstellraum`

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024:*

**Frage:** Gibt es innerhalb der Wohnung einen Abstellraum oder Einbauschrank?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2026:*

**Frage:** Gibt es innerhalb der Wohnung einen Abstellraum (mind. 1 m² Grundfläche) oder Einbauschrank?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat aufwendige Wand- und Deckenverkleidung`

**Frage:** Gibt es in der Mehrzahl der Wohnräume eine aufwändige Decken- oder Wandverkleidung in einem guten Zustand?

**Hinweis:** Hierzu zählt z.B. Stuck oder Täfelung

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat ausreichende Elektroinstallation`

*Mietspiegel 2015:*

**Frage:** Ist es möglich zwei oder mehr größere haushaltsübliche Elektrogeräten (z.B. Waschmaschine und Staubsauger) gleichzeitiger zu betreiben?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2017, 2019, 2021, 2023, 2024, 2026:*

**Frage:** Ist in der Wohnung eine ausreichende Elektroinstallation verbaut?

**Hinweis:** Eine Elektronistallation gilt als nicht ausreichend, wenn es z.B. keinen FI-Schalter, keinen Potentialausgleich, keine ausreichende Elektrosteigeleitung oder regelmäßige Stromausfälle gibt.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Balkon`

**Frage:** Hat die Wohnung einen Außenbereich, wie z.B. Balkon, (Dach-)Terrasse, Loggia, Wintergarten oder Dachgarten?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Durchgangszimmer`

**Frage:** Gibt es in der Wohnung ein gefangenes Zimmer oder Durchgangszimmer?

**Hinweis:** Ein Durchgangszimmer ist ein Zimmer, durch welches man durchgehen muss um in ein weiteres Zimmer zu kommen. In das dahinterliegende Zimmer darf man also nicht vom Flur aus kommen. Dieses Merkmal ist auch bei einer Einzimmerwohnung gegeben, bei welcher man die Küche nur durch das Wohn- /Schlafzimmer betreten kann.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Einbruchsicherung oder Sichtschutz`

**Frage:** Hat die Wohnung ein Einbruchs- oder Sichtschutzsystem an allen Fenstern der Wohnung (z. B. Gitter, Rollläden, Fensteralarm)?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat einfach verglaste Fenster`

**Frage:** Sind in der Wohnung überwiegend einfach verglaste Fenster verbaut?

**Hinweis:** Beachte: Die in Altbau typischen Doppelkastenfenstern gelten nicht als Einfachverglasung.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Fußbodenheizung`

**Frage:** Ist in der Wohnung überwiegend eine Fußbodenheizung verbaut?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat großen Balkon`

**Frage:** Ist dieser Außenbereich mindestens 4qm groß?

**Hinweis:** Beachte: Wenn die Wohnung mehrere Balkone (oder ähnliches) hat, wird deren Fläche nicht zusammengerechnet.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat großen Wohnraum`

**Frage:** Gibt es in der Wohnung einen Wohnraum der größer als 40qm ist?

**Hinweis:** Beachte: Eine Wohnküche zählt nicht als Wohnraum.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat hochwertigen Bodenbelag`

*Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024:*

**Frage:** Gibt es in der überwiegenden Anzahl der Wohnräume einen hochwertigen Bodenbelag?

**Hinweis:** Hierzu zählt z.B. Parkett, Natur-/Kunststein, Fliesen oder gleichwertiger Bodenbelag

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2026:*

**Frage:** Gibt es in der überwiegenden Anzahl der Wohnräume (inkl. Flur, ohne Küche, ohne Bad) einen hochwertigen Bodenbelag?

**Hinweis:** Hierzu zählt z.B. Parkett, Natur-/Kunststein, Fliesen oder gleichwertiger Bodenbelag

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Internetanschluss`

**Frage:** Gibt es in der Wohnung einen Anschluss zum Internet?

**Hinweis:** Beachte: Dies gilt nicht vor, wenn der Mieter durch diesen automatisch vertraglich gebunden ist.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Kabelanschluss`

**Frage:** Gibt es einen Kabelanschluss für den Fernseher oder eine Gemeinschaftssatelliten- oder Antennenanlage?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Kaltwasserzähler`

**Frage:** Hat die Wohnung einen wohnungsbezogenen Kaltwasserzähler?

**Hinweis:** Ein wohnungbezogener Kaltwasserzähler ermöglicht den Wasserverbrauch jeder Wohnung einzeln zu messen und somit auch die Wasserkosten für jede Wohnung einzeln abzurechnen.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat nicht sichtbare Elektroinstallation`

**Frage:** Verlaufen die Stromkabel in der Wohnung überwiegend innerhalb der Wand?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Raum mit <2 Steckdosen`

**Frage:** Gibt es einen Wohnraum, der weniger als zwei Steckdosen hat?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Rollläden`

**Frage:** Sind die Fenster überwiegend mit Rollläden ausgestattet?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Sammelheizung`

**Frage:** Hat die Wohnung eine Zentralheizung, Etagenheizung, oder Wohnungsheizung (Gas, Öl, Elektro)?

**Hinweis:** Beachte: Dies trifft auf fast alle Wohnungen in Berlin zu.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat Schallschutzfenster`

*Mietspiegel 2015:*

**Frage:** Sind in der Wohnung überwiegend Fenster mit Wärmeschutzverglasung (Einbau ab 1987) oder Schallschutzfenster verbaut?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2017:*

**Frage:** Sind in der Wohnung überwiegend Fenster mit Wärmeschutzverglasung (Einbau ab 1995) oder Schallschutzfenster verbaut?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2017:*

**Frage:** Sind in der Wohnung überwiegend Fenster mit Wärmeschutzverglasung verbaut?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2019, 2021, 2023, 2024:*

**Frage:** Sind in der Wohnung überwiegend Fenster mit Wärmeschutzverglasung (Einbau ab 2002) oder Schallschutzfenster verbaut?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

*Mietspiegel 2026:*

**Frage:** Sind in der Wohnung überwiegend Fenster mit Wärmeschutzverglasung oder Schallschutzfenster verbaut (jeweils Einbau ab 2002)?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat sichtbare Heizungsrohe`

**Frage:** Sind die Heizungsrohre überwiegend sichtbar verlegt?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung hat verstärkte Tür`

**Frage:** Ist die Wohnungstür verstärkt und verfügt über eine zusätzliche Einbruchsicherung, wie z.B. hochwertige Sperrbügel oder Türschlösser mit Mehrfachverriegelung?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung im Erdgeschoss`

**Frage:** Liegt die Wohnung im Ergeschoss?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung ist barrierearm`

**Frage:** Ist die Wohnung barrierearm?

**Hinweis:** Dies ist erfüllt, wenn Wohnung schwellenfrei ist, der Übergang zu Balkon oder Dachterasse schwellenarm ist, ausreichende Bewegungsfreiheit in Wohnung gegeben ist, und das Bad barreierearm gestaltet ist.

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung kann Waschmaschiene`

**Frage:** Ist es möglich eine Waschmaschine in der Küche oder dem Bad aufzustellen und anzuschließen?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)

## `Wohnung keinen Balkon weil unmöglich`

**Frage:** Gibt es bauliche oder rechtliche Gründe, weshalb ein Außenbereich (wie z.B. ein Balkon) nicht möglich ist?

- Ja (`Ja`)
- Nein (`Nein`)
- Ich bin mir nicht sicher (`Nicht sicher`)
