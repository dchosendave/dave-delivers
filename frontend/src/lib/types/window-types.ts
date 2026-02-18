/**
 * Window Management Types
 * Type definitions for macOS-style window management
 */

export type WindowType = 'terminal' | 'iss-tracker' | 'nasa-apod';

export interface WindowState {
    id: WindowType;
    title: string;
    icon: string;
    isMinimized: boolean;
    zIndex: number;
}

export interface WindowConfig {
    id: WindowType;
    title: string;
    icon: string;
}

export interface WindowComponentProps {
    onClose: () => void;
}
