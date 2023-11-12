import { type UseChatHelpers } from 'ai/react'

import { PromptForm } from '@/components/prompt-form'
import { IconRefresh, IconStop } from '@/components/ui/icons'
import { Button } from '@nextui-org/react'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0">

      <div className="mx-auto sm:max-w-2xl">
        <div className="flex h-10 items-center justify-center mb-10">
          {isLoading ? (
            <Button
              onClick={() => stop()}
              color="primary"
              isLoading
            >
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                onClick={() => reload()}
                color='primary'
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="mb-5">
          <PromptForm
            onSubmit={async value => {
              await append({
                id,
                content: value,
                role: 'user'
              })
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
