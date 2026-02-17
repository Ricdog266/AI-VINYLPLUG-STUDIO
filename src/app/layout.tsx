"use client";

import { useMemo, useState } from "react";

type Genre = "Latin Trap" | "Drill" | "Hip-Hop";

export default function Home() {
  const [personaName, setPersonaName] = useState("AI VinylPlug Persona");
  const [genre, setGenre] = useState<Genre>("Latin Trap");
  const [bpm, setBpm] = useState("95");
  const [artist, setArtist] = useState("");
  const [refSongs, setRefSongs] = useState("");
  const [notes, setNotes] = useState("");

  const [gritClean, setGritClean] = useState(55);
  const [rapMelodic, setRapMelodic] = useState(35);
  const [aggressiveCharismatic, setAggressiveCharismatic] = useState(60);
  const [minimalLayered, setMinimalLayered] = useState(45);
  const [darkPlayful, setDarkPlayful] = useState(55);

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const payload = useMemo(
    () => ({
      personaName,
      genre,
      bpm,
      artist,
      refSongs,
      notes,
      sliders: {
        gritClean,
        rapMelodic,
        aggressiveCharismatic,
        minimalLayered,
        darkPlayful,
      },
    }),
    [
      personaName,
      genre,
      bpm,
      artist,
      refSongs,
      notes,
      gritClean,
      rapMelodic,
      aggressiveCharismatic,
      minimalLayered,
      darkPlayful,
    ]
  );

  async function testBackend() {
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      setOutput(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output || "");
  }

  const box: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    background: "white",
  };

  const label: React.CSSProperties = {
    fontSize: 12,
    opacity: 0.75,
    marginBottom: 6,
    display: "block",
  };

  const input: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: 14,
  };

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 34, marginBottom: 6 }}>AI VinylPlug Studio</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Persona Extractor / Suno Optimization Machine (v0.2)
      </p>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <div style={box}>
          <h2 style={{ marginTop: 0 }}>Inputs</h2>

          <label style={label}>Persona name</label>
          <input style={input} value={personaName} onChange={(e) => setPersonaName(e.target.value)} />

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr", marginTop: 12 }}>
            <div>
              <label style={label}>Genre</label>
              <select style={input} value={genre} onChange={(e) => setGenre(e.target.value as Genre)}>
                <option>Latin Trap</option>
                <option>Drill</option>
                <option>Hip-Hop</option>
              </select>
            </div>
            <div>
              <label style={label}>BPM</label>
              <input style={input} value={bpm} onChange={(e) => setBpm(e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={label}>Artist reference (optional)</label>
            <input style={input} value={artist} onChange={(e) => setArtist(e.target.value)} />
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={label}>Reference songs (optional)</label>
            <textarea
              style={{ ...input, minHeight: 70 }}
              value={refSongs}
              onChange={(e) => setRefSongs(e.target.value)}
              placeholder="Paste song titles, one per line"
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={label}>Notes (optional)</label>
            <textarea
              style={{ ...input, minHeight: 70 }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What vibe? what energy? what rules?"
            />
          </div>
        </div>

        <div style={box}>
          <h2 style={{ marginTop: 0 }}>Sliders</h2>

          <Slider labelText={`Grit → Clean (${gritClean})`} value={gritClean} setValue={setGritClean} />
          <Slider labelText={`Rap → Melodic (${rapMelodic})`} value={rapMelodic} setValue={setRapMelodic} />
          <Slider
            labelText={`Aggressive → Charismatic (${aggressiveCharismatic})`}
            value={aggressiveCharismatic}
            setValue={setAggressiveCharismatic}
          />
          <Slider
            labelText={`Minimal → Layered (${minimalLayered})`}
            value={minimalLayered}
            setValue={setMinimalLayered}
          />
          <Slider labelText={`Dark → Playful (${darkPlayful})`} value={darkPlayful} setValue={setDarkPlayful} />

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              onClick={testBackend}
              disabled={loading}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111827",
                background: "#111827",
                color: "white",
                cursor: "pointer",
              }}
            >
              {loading ? "Testing..." : "Test Backend"}
            </button>

            <button
              onClick={() => {
                setPersonaName("AI VinylPlug Persona");
                setGenre("Latin Trap");
                setBpm("95");
                setArtist("");
                setRefSongs("");
                setNotes("");
                setGritClean(55);
                setRapMelodic(35);
                setAggressiveCharismatic(60);
                setMinimalLayered(45);
                setDarkPlayful(55);
                setOutput("");
                setError("");
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "white",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>

          {error ? (
            <p style={{ marginTop: 14, color: "#b91c1c" }}>Error: {error}</p>
          ) : null}

          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>Output</strong>
              <button
                onClick={copyOutput}
                disabled={!output}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  background: "white",
                  cursor: output ? "pointer" : "not-allowed",
                }}
              >
                Copy
              </button>
            </div>

            <pre
              style={{
                marginTop: 10,
                padding: 12,
                borderRadius: 12,
                background: "#0b1020",
                color: "#e5e7eb",
                overflowX: "auto",
                minHeight: 210,
                fontSize: 12,
              }}
            >
              {output || "Press “Test Backend” to confirm frontend → backend works."}
            </pre>
          </div>
        </div>
      </div>

      <p style={{ marginTop: 18, opacity: 0.7, fontSize: 13 }}>
        Next step: swap the backend test response for real persona generation using OpenAI.
      </p>
    </main>
  );
}

function Slider({
  labelText,
  value,
  setValue,
}: {
  labelText: string;
  value: number;
  setValue: (n: number) => void;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, opacity: 0.85 }}>{labelText}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}
