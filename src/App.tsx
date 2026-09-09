
import { useState, useEffect } from 'react';
import { type } from '@tauri-apps/plugin-os'; // Для Tauri v2
import './App.css'
import MobileApp from './mobile/MobileApp';
import DesktopApp from './desktop/DesktopApp';

export default function App() {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const osType = type();
        if (osType === 'android' || osType === 'ios') {
            setIsMobile(true);
        }
    }, []);

    return isMobile ? <MobileApp /> : <DesktopApp />;
}
