"""Prepara la lettura audio senza alterare il testo documentario pubblicato."""
import re
import subprocess
import tempfile
from pathlib import Path

MODEL = "/tmp/paola/it_IT-paola-medium.onnx"

def spoken_text(text):
    # Solo normalizzazioni fonetiche conservative, mai del documento sorgente.
    text = re.sub(r"(?<!\\w)15[.]000(?=\\s+tarì\\b)", "quindicimila", text, flags=re.I)
    return re.sub(r"\\s+", " ", text).strip()

def segments(text):
    sentences = re.split(r"(?<=[.!?])\\s+(?=[A-ZÀ-Ý])", spoken_text(text))
    for sentence in sentences:
        if not sentence.strip():
            continue
        if len(sentence) <= 190:
            yield sentence.strip(), 0.40
            continue
        parts = re.split(r"(?<=[,;:])\\s+", sentence)
        buffer = ""
        for part in parts:
            if buffer and len(buffer) + len(part) + 1 > 190:
                yield buffer.strip(), 0.23
                buffer = ""
            buffer = (buffer + " " + part).strip()
        if buffer:
            yield buffer, 0.40

def synthesize(text, destination):
    destination = Path(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        concat = []
        for index, (part, pause) in enumerate(segments(text)):
            wav = tmp / f"frase-{index:03d}.wav"
            subprocess.run(["piper", "--model", MODEL, "--length_scale", "1.20",
                            "--noise_scale", "0.30", "--noise_w", "0.45",
                            "--output_file", str(wav)],
                           input=part, text=True, check=True)
            concat.append(wav)
            # Pausa reale e deterministica, non affidata al motore TTS.
            silence = tmp / f"pausa-{index:03d}.wav"
            subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                            "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono",
                            "-t", str(pause), "-c:a", "pcm_s16le", str(silence)], check=True)
            concat.append(silence)
        if not concat:
            raise ValueError("Testo da leggere vuoto")
        manifest = tmp / "concat.txt"
        manifest.write_text("".join("file '" + str(item) + "'\\n" for item in concat), encoding="utf-8")
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                        "-f", "concat", "-safe", "0", "-i", str(manifest),
                        "-c:a", "libmp3lame", "-b:a", "128k", str(destination)], check=True)
        if destination.stat().st_size < 1000:
            raise ValueError("Registrazione non valida")
