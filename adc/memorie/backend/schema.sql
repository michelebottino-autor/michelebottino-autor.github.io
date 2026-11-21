-- ADC Memorie: tabelle PRIVATE, da creare esclusivamente su D1 (mai su GitHub Pages).
CREATE TABLE IF NOT EXISTS testimonianze (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  titolo TEXT NOT NULL,
  periodo TEXT NOT NULL DEFAULT '',
  luogo TEXT NOT NULL DEFAULT '',
  racconto TEXT NOT NULL,
  attribuzione TEXT NOT NULL DEFAULT '',
  recapito TEXT NOT NULL DEFAULT '',
  scelta_pubblicazione TEXT NOT NULL CHECK(scelta_pubblicazione IN ('non_autorizzata','nome','anonima')),
  consenso_condivisione INTEGER NOT NULL CHECK(consenso_condivisione=1),
  stato TEXT NOT NULL DEFAULT 'ricevuta' CHECK(stato IN ('ricevuta','in_revisione','approvata','pubblicata','ritirata','respinta')),
  origine TEXT NOT NULL DEFAULT 'sito_ADC',
  note_redazionali TEXT NOT NULL DEFAULT '',
  testo_pubblico TEXT,
  pubblicata_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_testimonianze_stato ON testimonianze(stato,created_at);
CREATE INDEX IF NOT EXISTS idx_testimonianze_luogo ON testimonianze(luogo);
CREATE TABLE IF NOT EXISTS richieste_giornaliere (
  id TEXT PRIMARY KEY,
  numero INTEGER NOT NULL DEFAULT 0,
  scadenza TEXT NOT NULL
);
