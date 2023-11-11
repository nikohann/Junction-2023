import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
} from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { ApplicationError, UserError } from '@/lib/errors'
import Stream from 'stream';

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

    
    const { messages, settings } = json;

    console.log("myCustomValue: " + JSON.stringify(settings));

    if (!messages || !messages[0].content) {
      throw new UserError('Missing query in request data')
    }

    throw new UserError("asdasd");

    const news = await fetch("http://65.109.134.221:3000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer SecretKey12345"
      },
      body: JSON.stringify({
        question: messages[0].content,
      })
    });

    const newsData: Data = await news.json();
    const prompt = newsData.prompt;

    if (!prompt || prompt.length === 0) {
      throw new ApplicationError('Failed to generate prompt');
    }

    const chatMessage: ChatCompletionRequestMessage = {
      role: 'user',
      content: prompt,
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [chatMessage],
      max_tokens: 512,
      temperature: 0,
      stream: true,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new ApplicationError('Failed to generate completion', error)
    }

    // Transform the response into a readable stream
    const stream = OpenAIStream(response)

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream)
  } catch (err: unknown) {
    if (err instanceof UserError) {
      return new Response(
        JSON.stringify({
          error: err.message,
          data: err.data,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
