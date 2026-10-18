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
YEARS = [2015, 2017, 2019, 2021, 2023, 2024, 2026]
LOCATIONS = ["einfach", "mittel", "gut"]


def cents(value):
    whole, fraction = value.split(",")
    return int(whole) * 100 + int(fraction)


def old_table(path, year):
    page_number = 13 if year < 2019 else 17
    reader = PdfReader(path)
    page = reader.pages[page_number - 1]
    if year in [2015, 2021, 2023]:
        page.rotate(90)
    writer = PdfWriter()
    writer.add_page(page)
    buffer = io.BytesIO()
    writer.write(buffer)
    buffer.seek(0)
    with pdfplumber.open(buffer) as pdf:
        tables = pdf.pages[0].extract_tables()
    assert len(tables) == 1 and len(tables[0]) == 16
    table = tables[0]
    periods = ["-1918", "1919-1949", "1950-1964", "1965-1972",
               "W:1973-1990", "O:1973-1990", "1991-2002",
               {2015: "2003-2013", 2017: "2003-2015"}.get(year, "2003-2017")]
    rows = []
    for row_index, row in enumerate(table[4:]):
        assert row[2] == chr(65 + row_index)
        for column, period in enumerate(periods):
            cell = row[column + 3] or ""
            numbers = re.findall(r"\d+,\d{2}", cell)
            assert len(numbers) in [0, 3], (year, row_index, column, cell)
            values = [cents(n) for n in numbers]
            rows.append({
                "field": f"{row[2]}{column + 1}", "pdfPage": page_number,
                "period": period, "location": LOCATIONS[row_index % 3],
                "minArea": [0, 40, 60, 90][row_index // 3],
                "maxArea": [40, 60, 90, None][row_index // 3],
                "medianCents": values[0] if values else None,
                "lowerCents": values[1] if values else None,
                "upperCents": values[2] if values else None,
                "qualification": "**" if "**" in cell else "*" if "*" in cell else None,
            })
    return rows


def new_table(path, year):
    rows = []
    location = period = None
    with pdfplumber.open(path) as pdf:
        for page_number in range(17, 22):
            for line in pdf.pages[page_number - 1].extract_text().splitlines():
                heading = re.search(r"9\.([123]) Mietspiegeltabelle", line)
                if heading:
                    location = LOCATIONS[int(heading[1]) - 1]
                match = re.fullmatch(r"(\d+) (.*?) (\d+,\d{2}) € (\d+,\d{2}) € (\d+,\d{2}) €", line)
                if not match:
                    continue
                number, description, lower, median, upper = match.groups()
                construction = re.match(r"(?i)(bis 1918|\d{4} bis \d{4}(?: West| Ost)?\*{0,2}) ", description)
                if construction:
                    label = construction[1].replace("*", "")
                    period = label.replace(" bis ", "-")
                    if label.lower() == "bis 1918":
                        period = "-1918"
                    elif label.endswith(" West"):
                        period = "W:" + period.removesuffix(" West")
                    elif label.endswith(" Ost"):
                        period = "O:" + period.removesuffix(" Ost")
                    description = description[len(construction[0]):]
                if description == "alle Wohnflächen":
                    minimum, maximum = 0, None
                elif match_area := re.fullmatch(r"bis unter (\d+) m²", description):
                    minimum, maximum = 0, int(match_area[1])
                elif match_area := re.fullmatch(r"(\d+) m² bis unter (\d+) m²", description):
                    minimum, maximum = map(int, match_area.groups())
                elif match_area := re.fullmatch(r"ab (\d+) m²", description):
                    minimum, maximum = int(match_area[1]), None
                else:
                    raise ValueError((year, number, description))
                assert period and location
                rows.append({
                    "field": number, "pdfPage": page_number,
                    "period": period, "location": location,
                    "minArea": minimum, "maxArea": maximum,
                    "medianCents": cents(median), "lowerCents": cents(lower),
                    "upperCents": cents(upper), "qualification": None,
                })
    assert [int(r["field"]) for r in rows] == list(range(1, (163 if year == 2024 else 189) + 1))
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf_directory", type=Path)
    args = parser.parse_args()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for year in YEARS:
        path = args.pdf_directory / f"Mietspiegel {year}.pdf"
        rows = old_table(path, year) if year < 2024 else new_table(path, year)
        data = {"edition": str(year), "source": path.name,
                "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                "extraction": "pdfplumber; source-only, no production imports",
                "rows": rows}
        (OUTPUT / f"{year}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        print(year, len(rows), "fields,", sum(r["medianCents"] is not None for r in rows), "populated")


if __name__ == "__main__":
    main()
