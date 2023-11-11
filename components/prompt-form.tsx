import { UseChatHelpers } from 'ai/react'
import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { Button } from '@nextui-org/react'
import SettingsModal from './settings-modal'
import { Settings } from '@/app/api/chat/settings/route'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {

  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])


  function getSettings() {
    const payload: Settings = {
      "temp": !process.env.TEMPERATURE ? 0 : +process.env.TEMPERATURE,
      "max_tokens": !process.env.MAX_TOKENS ? 0 : +process.env.MAX_TOKENS,
      "gpt_model": !process.env.GPT_MODEL ? "gpt-3.5-turbo" : process.env.GPT_MODEL,
    }

    return payload;

  }

  const settings: Settings = getSettings();

  return (
    <div className='relative'>

      <SettingsModal gpt_model={settings.gpt_model} max_tokens={settings.max_tokens} temp={settings.temp} />

      <form
        onSubmit={async e => {
          e.preventDefault()
          if (!input?.trim()) {
            return
          }
          setInput('')
          await onSubmit(input)
        }}
        ref={formRef}
        className='w-full'
      >
        <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background sm:rounded-md sm:border">

          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Send a message."
            spellCheck={false}
            className="min-h-[60px] w-full resize-none bg-transparent pl-4 pr-14 py-[1.3rem] focus-within:outline-none sm:text-sm"
          />

          <div className="absolute right-0 top-4 sm:right-4">

            <Button
              type="submit"
              size="sm"
              color='primary'
              isIconOnly
              disabled={isLoading || input === ''}
            >
              <IconArrowElbow />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </form>

    </div>
  )
}
