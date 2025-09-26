import requests
import pdfplumber
import pandas as pd
import os
import json
from datetime import date

PDF_URL = "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_en.pdf"
DATA_DIR = "data"
PDF_FILENAME = os.path.join(DATA_DIR, "Instrument_Universe.pdf")
MASTER_CSV = os.path.join(DATA_DIR, "trade_republic_aktien_25_09_25.csv")
ADDED_JSON = os.path.join(DATA_DIR, "added.json")
REMOVED_JSON = os.path.join(DATA_DIR, "removed.json")

def download_pdf(url, filename):
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, "wb") as file:
            file.write(response.content)
        print("✓ PDF downloaded successfully.")
        return True
    print(f"✗ Failed to download PDF. Status: {response.status_code}")
    return False

def extract_data_from_pdf(pdf_filename):
    isin_list, name_list = [], []
    with pdfplumber.open(pdf_filename) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text: continue
            for line in text.split('\n'):
                if line.startswith("ISIN") or "TRADING UNIVERSE" in line or not line.strip():
                    continue
                parts = line.split()
                if len(parts) >= 2:
                    isin = parts[0].strip()
                    if len(isin) == 12 and isin[:2].isalpha() and isin[2:].isalnum():
                        name = " ".join(parts[1:]).strip()
                        isin_list.append(isin)
                        name_list.append(name)
    return pd.DataFrame({'ISIN': isin_list, 'Name': name_list})

def main():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

    if not download_pdf(PDF_URL, PDF_FILENAME):
        return

    new_df = extract_data_from_pdf(PDF_FILENAME)
    new_df['ISIN'] = new_df['ISIN'].str.strip().str.upper()
    new_df = new_df.drop_duplicates(subset=['ISIN'])

    if not os.path.exists(MASTER_CSV):
        new_df.to_csv(MASTER_CSV, index=False)
        with open(ADDED_JSON, 'w') as f: json.dump([], f)
        with open(REMOVED_JSON, 'w') as f: json.dump([], f)
        print("✓ Master file created. No previous data to compare.")
        return

    old_df = pd.read_csv(MASTER_CSV)
    old_df['ISIN'] = old_df['ISIN'].str.strip().str.upper()

    added = new_df[~new_df['ISIN'].isin(old_df['ISIN'])]
    removed = old_df[~old_df['ISIN'].isin(new_df['ISIN'])]

    if added.empty and removed.empty:
        print("✓ No changes found.")
        return

    today_str = date.today().strftime('%Y-%m-%d')

    if not added.empty:
        print(f"\n✓ Added stocks ({len(added)}):")
        print(added)
        new_added_list = added.to_dict('records')
        for item in new_added_list: item['date'] = today_str

        with open(ADDED_JSON, 'r') as f: existing_added = json.load(f)
        updated_added = new_added_list + existing_added
        with open(ADDED_JSON, 'w') as f: json.dump(updated_added, f, indent=2)

    if not removed.empty:
        print(f"\n✓ Removed stocks ({len(removed)}):")
        print(removed)
        new_removed_list = removed.to_dict('records')
        for item in new_removed_list: item['date'] = today_str

        with open(REMOVED_JSON, 'r') as f: existing_removed = json.load(f)
        updated_removed = new_removed_list + existing_removed
        with open(REMOVED_JSON, 'w') as f: json.dump(updated_removed, f, indent=2)

    new_df.to_csv(MASTER_CSV, index=False)
    print("\n✓ Master file and JSON logs have been updated.")

if __name__ == "__main__":
    main()
