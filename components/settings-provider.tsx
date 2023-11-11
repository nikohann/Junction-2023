import React, { createContext, useState, useContext } from 'react';

interface Settings {
    temp: number;
    maxTokens: number;
    gptModel: string;
}

const defaultSettings: Settings = {
    temp: 0.7,
    maxTokens: 100,
    gptModel: 'gpt-3',
};

export const SettingsContext = createContext<{
    settings: Settings;
    setSettings: (settings: Settings) => void;
}>({
    settings: defaultSettings,
    setSettings: () => { },
});

interface SettingsProviderProps {
    children: React.ReactNode
}

export default function SettingsProvider({ children }: SettingsProviderProps) {
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
