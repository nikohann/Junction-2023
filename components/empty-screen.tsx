import { UseChatHelpers } from 'ai/react'

import { IconArrowRight } from '@/components/ui/icons'
import { Button } from '@nextui-org/react'

const exampleMessages = [
  {
    heading: 'What is the expected development of stainless steel market pricing?',
  },
  {
    heading: 'What recent news state about possible energy price developments?',
  },
  {
    heading: 'What are the most recent patents granted in the area of stainless steel?',
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border p-8">
        <h1 className="mb-2 text-lg font-semibold">
          PROJEKTIN NIMI TÄHÄN 
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This chatbot specializes in answering questions about metal industry with sources.
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="light"
              className="h-auto -ml-1 p-1 text-base"
              onClick={() => setInput(message.heading)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
