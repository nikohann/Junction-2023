'use client'

import {type Message, useChat} from 'ai/react'

import {cn} from '@/lib/utils'
import {ChatList} from '@/components/chat-list'
import {ChatPanel} from '@/components/chat-panel'
import {EmptyScreen} from '@/components/empty-screen'
import {toast} from 'react-hot-toast'
import React, {createContext, useContext, useEffect, useState} from 'react'
import {produce} from "immer";

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

export function Chat({id, initialMessages, className}: ChatProps) {

    const settings = useContext(SettingsContext);

    const [messageExtra, setMessageExtra] = useState<any>({});

    const {data, messages, append, reload, stop, isLoading, input, setInput} =
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

    const lastProcessedIndexRef = React.useRef<number>(-1);
    const currentMessageIndexRef = React.useRef<number>(-1);
    useEffect(() => {
        if (!data) return;

        // Loop data array elements until lastProcessedIndexRef.current === data.length - 1
        // If lastProcessedIndexRef.current === data.length - 1, then the data array has been processed
        while (lastProcessedIndexRef.current < data.length - 1) {
            const message = data[lastProcessedIndexRef.current + 1];
            console.log(message);
            const type = message?.type?.toString() ?? "";
            if (type === "START") {
                const index = message?.messageIndex as number;

                setMessageExtra(produce((draft: any) => {
                    console.log("index", index);
                    draft["" + index] = {articles: []};
                }));

                currentMessageIndexRef.current = index;
            } else if (type === "ARTICLE_FOUND") {
                const articleUrl = message?.articleUrl as string;

                setMessageExtra(produce((draft: any) => {
                    // If articles already contains the articleUrl, then don't add it again
                    console.log("draft", draft);
                    if (draft["" + currentMessageIndexRef.current]?.articles?.some((article: any) => article.url === articleUrl)) {
                        return;
                    }

                    draft["" + currentMessageIndexRef.current]?.articles?.push({
                        url: articleUrl,
                        done: false
                    });
                }));
            } else if(type === "ARTICLE_ERROR") {
                // Find the article and set error: true (by url)
                const articleUrl = message?.articleUrl as string;

                setMessageExtra((messageExtra: any) => produce(messageExtra, (draft: any) => {
                    draft["" + currentMessageIndexRef.current].articles.forEach((article: any) => {
                        if (article.url === articleUrl) {
                            article.error = true;
                        }
                    });
                }));
            } else if(type === "ARTICLE_FETCHED") {
                const articleUrl = message?.article?.url as string;

                setMessageExtra((messageExtra: any) => produce(messageExtra, (draft: any) => {
                    draft["" + currentMessageIndexRef.current].articles.forEach((article: any) => {
                        if (article.url === articleUrl) {
                            article.fetched = true;
                        }
                    });
                }));
            } else if(type === "ARTICLE_DONE") {

                const articleUrl = message?.articleUrl as string;

                setMessageExtra((messageExtra: any) => produce(messageExtra,(draft: any) => {
                    draft["" + currentMessageIndexRef.current].articles.forEach((article: any) => {
                        if (article.url === articleUrl) {
                            article.done = true;
                            article.summary = message?.article?.summary as string;
                            article.published = message?.article?.published as string;
                            article.title = message?.article?.title as string;
                        }
                    });
                }));
            }

            lastProcessedIndexRef.current++;
        }
    }, [data]);

    return (
        <>
            <div className={cn('pb-[200px] pt-4 md:mt-16', className)}>
                {messages.length ? (
                    <>
                        <ChatList messages={messages} messageExtra={messageExtra ?? {}}/>
                    </>
                ) : (
                    <EmptyScreen setInput={setInput}/>
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
