

export async function GET(req: Request) {

    const payload = {
        "temperature": process.env.TEMPERATURE,
        "max_tokens": process.env.MAX_TOKENS,
        "GPT_MODEL": process.env.GPT_MODEL,
    }

    return new Response(JSON.stringify(payload), { status: 200 });

}