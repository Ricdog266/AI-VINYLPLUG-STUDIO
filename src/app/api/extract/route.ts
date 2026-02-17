export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();

  return new Response(
    JSON.stringify({
      message: "Backend connected successfully",
      received: body
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
