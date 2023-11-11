'use client'

import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { toast } from 'react-hot-toast'
import { createContext, useContext } from 'react'
import React from 'react'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export interface Settings {
  temp: number
  maxTokens: number
  gptModel: string
}

const defaultSettings: Settings = {
  temp: 0.5,
  maxTokens: 50,
  gptModel: "gpt-3.5-turbo"
}

export const SettingsContext = createContext(defaultSettings);

export function Chat({ id, initialMessages, className }: ChatProps) {

  const settings = useContext(SettingsContext);

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        settings: settings
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      }
    })
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:mt-16', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <SettingsContext.Provider value={settings}>
        <ChatPanel
          id={id}
          isLoading={isLoading}
          stop={stop}
          append={append}
          reload={reload}
          messages={messages}
          input={input}
          setInput={setInput}
        />
      </SettingsContext.Provider>
    </>
  )
}
