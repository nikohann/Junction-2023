import {ChatCompletionRequestMessage, Configuration, OpenAIApi,} from 'openai-edge'
import {experimental_StreamData, OpenAIStream, StreamingTextResponse} from 'ai'
import {ApplicationError, UserError} from '@/lib/errors'

type NewsItem = {
    url: string;
    title: string;
    summary: string;
};
type SearchItem = {
    keyword: string;
    website: string;
    news: NewsItem[];
};
type Data = {
    searches: SearchItem[];
    prompt: string;
};

const openAiKey = process.env.OPENAI_KEY

const config = new Configuration({
    apiKey: openAiKey,
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
    try {
        if (!openAiKey) {
            throw new ApplicationError('Missing environment variable OPENAI_KEY')
        }

        const json = await req.json()

        if (!json) {
            throw new UserError('Missing request data')
        }

        const {messages, settings} = json;

        if (!messages || !messages[messages.length - 1]?.content || !settings || !settings.maxTokens || !settings.temp) {
            throw new UserError('Missing query in request data')
        }

        const response = await fetch("http://65.109.134.221:3001/api/ask", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.IM_API_KEY,
                "X-Forwarded-Host": "junction.hannolainen.fi"
            },
            body: JSON.stringify({ question: messages[messages.length - 1].content, stream: true })
        });

        const data = new experimental_StreamData();

        const [deferredReadable, deferredWritable, writer] = createDeferredStream();

        const send = (json: any) => {
            data.append(json);
            writer.write(new Uint8Array([48,58,34,34,10])).then(); // Flush the buffer
        };

        send({type: "START", messageIndex: messages.length});

        const handleJson = async (json: any) => {
            const type = json?.type?.toString() ?? "";
            //console.log(JSON.stringify(json));
            if(type === "DONE") {
                const chatMessage: ChatCompletionRequestMessage = {
                    role: 'user',
                    content: json?.prompt?.toString() ?? "",
                }

                const response = await openai.createChatCompletion({
                    model: 'gpt-4-1106-preview',
                    messages: [chatMessage],
                    temperature: settings.temp,
                    stream: true,
                })

                if (!response.ok) {
                    const error = await response.json();
                    console.log(error);
                    throw new ApplicationError('Failed to generate completion', error)
                }

                // Transform the response into a readable stream
                const stream = OpenAIStream(response, {
                    experimental_streamData: true,
                    onFinal: () => {
                        writer.close();
                        data.close();
                    },
                });

                stream.pipeTo(deferredWritable).then();
            } else {
                send(json);
            }
        };

        (async () => {
            const reader = response!.body!.getReader();
            let buffer = '';


            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += new TextDecoder().decode(value);

                // Split buffer by comma and process each chunk
                const parts = buffer.split('\n');
                while (parts.length > 1) {
                    let part = parts.shift();

                    if(!part) throw new Error('Failed to generate prompt');

                    // Handle possible incomplete chunk at the start
                    if (part.charAt(0) !== '{' && part.charAt(0) !== '[') {
                        part = '{' + part;
                    }

                    try {
                        const jsonChunk = JSON.parse(part);
                        handleJson(jsonChunk).then();
                    } catch (error) {
                        console.error('JSON parsing error:', error);
                    }
                }

                buffer = parts[0] || '';
            }

            // Process any remaining data in the buffer
            if (buffer) {
                try {
                    const jsonChunk = JSON.parse(buffer);
                    handleJson(jsonChunk).then();
                } catch (error) {
                    console.error('JSON parsing error in final chunk:', error);
                }
            }
        })().then();


        // Return a StreamingTextResponse, which can be consumed by the client
        return new StreamingTextResponse(deferredReadable, {}, data);
    } catch (err: unknown) {
        if (err instanceof UserError) {
            return new Response(
                JSON.stringify({
                    error: err.message,
                    data: err.data,
                }),
                {
                    status: 400,
                    headers: {'Content-Type': 'application/json'},
                }
            )
        } else if (err instanceof ApplicationError) {
            // Print out application errors with their additional data
            console.error(`${err.message}: ${JSON.stringify(err.data)}`)
        } else {
            // Print out unexpected errors as is to help with debugging
            console.error(err)
        }

        // TODO: include more response info in debug environments
        return new Response(
            JSON.stringify({
                error: 'There was an error processing your request',
            }),
            {
                status: 500,
                headers: {'Content-Type': 'application/json'},
            }
        )
    }
}

function createDeferredStream(): [ReadableStream<any>, WritableStream<any>, WritableStreamDefaultWriter<any>] {
    // Create a TransformStream
    const transformStream = new TransformStream();

    // The readable side of the transform stream
    const readable = transformStream.readable;

    const writer = transformStream.writable.getWriter();

    // DEBUG: print out the readable stream with text encoding and pass it
    const writable = new WritableStream({
        write(chunk) {
            // Use text decoder to convert the chunk to a string
            const text = new TextDecoder().decode(chunk);
            writer.write(chunk).then();
        },
    });

    // The writable side of the transform stream
    //const writable = transformStream.writable;

    return [readable, writable, writer];
}