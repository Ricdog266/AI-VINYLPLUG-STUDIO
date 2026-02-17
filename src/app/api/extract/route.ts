import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY on server (Render env var)." },
        { status: 500 }
      );
    }

    const prompt = `
You are a "Persona Extractor / Suno Optimization Machine".

INPUTS:
- personaName: ${body.personaName}
- genre: ${body.genre}
- bpm: ${body.bpm}
- artist: ${body.artist || "(none)"}
- refSongs: ${body.refSongs || "(none)"}
- notes: ${body.notes || "(none)"}

SLIDERS (0-100):
${JSON.stringify(body.sliders, null, 2)}

OUTPUT REQUIREMENTS:
Return JSON with:
1) "style_of_music" (1 paragraph optimized for Suno "Style of Music")
2) "lyrics_structure" (Intro / Verse / Hook / Verse / Hook / Bridge / Hook)
3) "hooks" (3 hook options, short + catchy)
4) "adlibs" (10 adlibs matching vibe)
5) "mix_notes" (drums/808/vocal FX notes)
Keep it tight, punchy, and production-ready.
`;

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.2-mini",
        input: prompt,
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      return NextResponse.json(
        { error: "OpenAI request failed", details: errText },
        { status: 500 }
      );
    }

    const data = await r.json();
    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      JSON.stringify(data);

    return NextResponse.json({ ok: true, result: text });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e) },
      { status: 500 }
    );
  }
}
