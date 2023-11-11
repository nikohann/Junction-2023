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
<<<<<<< Updated upstream
    // Bottom gradient bar
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-primary from-1% to-20%">
      <ButtonScrollToBottom />
=======

    <div className="fixed bottom-0 inset-x-0">
>>>>>>> Stashed changes
      <div className="mx-auto sm:max-w-2xl">
        <div className="flex h-10 items-center justify-center mb-16">
          {isLoading ? (
            <Button
              variant="flat"
              onClick={() => stop()}
              startContent={<IconStop  />}
            >

              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="flat"
                onClick={() => reload()}
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 border-t px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
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
