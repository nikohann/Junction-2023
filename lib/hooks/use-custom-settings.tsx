import { SettingsContext } from '@/components/settings-provider';
import { useContext } from 'react';

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
