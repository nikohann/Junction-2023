import { type UseChatHelpers } from 'ai/react'

import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
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
    // Bottom gradient bar
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-primary from-1% to-20%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl">
        <div className="flex h-10 items-center justify-center mb-10">
          {isLoading ? (
            <Button
              variant="flat"
              onClick={() => stop()}
            >
              <IconStop className="animate-pulse mr-2" />
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
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
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
