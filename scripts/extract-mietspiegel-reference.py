"""Extract test-only reference tables from the supplied official PDFs.

Run with Python containing pdfplumber and pypdf:
  python scripts/extract-mietspiegel-reference.py /path/to/Mietspiegel

Never reads application data. Output is committed so CI needs neither PDFs nor
Python. Review changes against rendered source pages before accepting them.
"""

import argparse
import hashlib
import io
import json
import re
from pathlib import Path

import pdfplumber
from pypdf import PdfReader, PdfWriter

OUTPUT = Path(__file__).resolve().parents[1] / "src/calculation/verification/reference"
MIETSPIEGELJAHRE = [2015, 2017, 2019, 2021, 2023, 2024, 2026]
WOHNLAGEN = ["einfach", "mittel", "gut"]


def cents(value):
    whole, fraction = value.split(",")
    return int(whole) * 100 + int(fraction)


def old_table(path, mietspiegeljahr):
    page_number = 13 if mietspiegeljahr < 2019 else 17
    reader = PdfReader(path)
    page = reader.pages[page_number - 1]
    if mietspiegeljahr in [2015, 2021, 2023]:
        # Set the required orientation instead of adding to the PDF metadata:
        # the 2021 source page already has a 90-degree rotation.
        page.rotation = 90
    writer = PdfWriter()
    writer.add_page(page)
    buffer = io.BytesIO()
    writer.write(buffer)
    buffer.seek(0)
    with pdfplumber.open(buffer) as pdf:
        tables = pdf.pages[0].extract_tables()
    assert len(tables) == 1 and len(tables[0]) == 16
    table = tables[0]
    baujahr_spannen = ["-1918", "1919-1949", "1950-1964", "1965-1972",
               "W:1973-1990", "O:1973-1990", "1991-2002",
               {2015: "2003-2013", 2017: "2003-2015"}.get(mietspiegeljahr, "2003-2017")]
    rows = []
    for row_index, row in enumerate(table[4:]):
        assert row[2] == chr(65 + row_index)
        for column, baujahr_spanne in enumerate(baujahr_spannen):
            cell = row[column + 3] or ""
            numbers = re.findall(r"\d+,\d{2}", cell)
            assert len(numbers) in [0, 3], (mietspiegeljahr, row_index, column, cell)
            values = [cents(n) for n in numbers]
            rows.append({
                "tabellenfeld": f"{row[2]}{column + 1}", "pdfPage": page_number,
                "baujahrSpanne": baujahr_spanne, "wohnlage": WOHNLAGEN[row_index % 3],
                "minWohnflaeche": [0, 40, 60, 90][row_index // 3],
                "maxWohnflaecheExclusive": [40, 60, 90, None][row_index // 3],
                "mittelwertInCent": values[0] if values else None,
                "unterwertInCent": values[1] if values else None,
                "oberwertInCent": values[2] if values else None,
                "tabellenfeldAnnotation": "**" if "**" in cell else "*" if "*" in cell else None,
            })
    return rows


def new_table(path, mietspiegeljahr):
    rows = []
    wohnlage = baujahr_spanne = None
    with pdfplumber.open(path) as pdf:
        for page_number in range(17, 22):
            for line in pdf.pages[page_number - 1].extract_text().splitlines():
                heading = re.search(r"9\.([123]) Mietspiegeltabelle", line)
                if heading:
                    wohnlage = WOHNLAGEN[int(heading[1]) - 1]
                match = re.fullmatch(r"(\d+) (.*?) (\d+,\d{2}) € (\d+,\d{2}) € (\d+,\d{2}) €", line)
                if not match:
                    continue
                number, description, unterwert, mittelwert, oberwert = match.groups()
                baujahr_spanne_match = re.match(r"(?i)(bis 1918|\d{4} bis \d{4}(?: West| Ost)?\*{0,2}) ", description)
                if baujahr_spanne_match:
                    label = baujahr_spanne_match[1].replace("*", "")
                    baujahr_spanne = label.replace(" bis ", "-")
                    if label.lower() == "bis 1918":
                        baujahr_spanne = "-1918"
                    elif label.endswith(" West"):
                        baujahr_spanne = "W:" + baujahr_spanne.removesuffix(" West")
                    elif label.endswith(" Ost"):
                        baujahr_spanne = "O:" + baujahr_spanne.removesuffix(" Ost")
                    description = description[len(baujahr_spanne_match[0]):]
                if description == "alle Wohnflächen":
                    min_wohnflaeche, max_wohnflaeche_exclusive = 0, None
                elif wohnflaeche_match := re.fullmatch(r"bis unter (\d+) m²", description):
                    min_wohnflaeche, max_wohnflaeche_exclusive = 0, int(wohnflaeche_match[1])
                elif wohnflaeche_match := re.fullmatch(r"(\d+) m² bis unter (\d+) m²", description):
                    min_wohnflaeche, max_wohnflaeche_exclusive = map(int, wohnflaeche_match.groups())
                elif wohnflaeche_match := re.fullmatch(r"ab (\d+) m²", description):
                    min_wohnflaeche, max_wohnflaeche_exclusive = int(wohnflaeche_match[1]), None
                else:
                    raise ValueError((mietspiegeljahr, number, description))
                assert baujahr_spanne and wohnlage
                rows.append({
                    "tabellenfeld": number, "pdfPage": page_number,
                    "baujahrSpanne": baujahr_spanne, "wohnlage": wohnlage,
                    "minWohnflaeche": min_wohnflaeche, "maxWohnflaecheExclusive": max_wohnflaeche_exclusive,
                    "mittelwertInCent": cents(mittelwert), "unterwertInCent": cents(unterwert),
                    "oberwertInCent": cents(oberwert), "tabellenfeldAnnotation": None,
                })
    assert [int(r["tabellenfeld"]) for r in rows] == list(range(1, (163 if mietspiegeljahr == 2024 else 189) + 1))
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf_directory", type=Path)
    args = parser.parse_args()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for mietspiegeljahr in MIETSPIEGELJAHRE:
        path = args.pdf_directory / f"Mietspiegel {mietspiegeljahr}.pdf"
        rows = old_table(path, mietspiegeljahr) if mietspiegeljahr < 2024 else new_table(path, mietspiegeljahr)
        data = {"mietspiegeljahr": str(mietspiegeljahr), "source": path.name,
                "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                "extraction": "pdfplumber; source-only, no production imports",
                "rows": rows}
        (OUTPUT / f"{mietspiegeljahr}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        print(mietspiegeljahr, len(rows), "fields,", sum(r["mittelwertInCent"] is not None for r in rows), "populated")


if __name__ == "__main__":
    main()
