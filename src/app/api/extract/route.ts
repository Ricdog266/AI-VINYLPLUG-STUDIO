import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY on server." },
        { status: 500 }
      );
    }

    const prompt = `
You are a Suno Persona Optimization Engine.

INPUT:
Persona Name: ${body.personaName}
Genre: ${body.genre}
BPM: ${body.bpm}
Artist Ref: ${body.artist || "None"}
Reference Songs: ${body.refSongs || "None"}
Notes: ${body.notes || "None"}

SLIDERS:
${JSON.stringify(body.sliders, null, 2)}

Return JSON with:
- style_of_music
- lyrics_structure
- 3_hooks
- adlibs (10)
- mix_notes
Make it tight, punchy, Suno-ready.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
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

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "OpenAI request failed", details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      JSON.stringify(data);

    return NextResponse.json({ result: text });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}
