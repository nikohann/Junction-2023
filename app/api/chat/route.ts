import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
} from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { ApplicationError, UserError } from '@/lib/errors'
import { codeBlock, oneLine } from 'common-tags'
import GPT3Tokenizer from 'gpt3-tokenizer'

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

    const { messages } = json;

    if (!messages || !messages[0].content) {
      throw new UserError('Missing query in request data')
    }


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

    const newsJson = await news.json();

    console.log(newsJson)

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
    let tokenCount = 0;
    let contextText = '';
    
    for (let i = 0; i < newsJson.searches.length; i++) {
      // Iterate through each 'news' item in the current 'search'
      for (let j = 0; j < newsJson.searches[i].news.length; j++) {
        const newsItem = newsJson.searches[i].news[j];
        const content = newsItem.summary;
        const encoded = tokenizer.encode(content);
        tokenCount += encoded.text.length;
    
        if (tokenCount >= 1500) {
          break;
        }
    
        contextText += `${content.trim()}\n---\n`;
      }
    
      // Check if the token count limit has been reached after processing each search
      if (tokenCount >= 1500) {
        break;
      }
    }    

    //print context
    console.log(contextText)

    const prompt = codeBlock`
      ${oneLine`
        You are a very enthusiastic Outokumpu steel representative who loves
        to help people!"
      `}

      Context sections:
      ${contextText}

      Question: """
      ${messages[0].content}
      """

      Answer as markdown:
    `

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
