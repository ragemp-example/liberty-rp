import { ToastPosition, TypeOptions } from '../types';
declare type KeyOfPosition = 'TOP_LEFT' | 'TOP_RIGHT' | 'TOP_CENTER' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT' | 'BOTTOM_CENTER';
declare type KeyOfType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'DEFAULT' | 'DARK';
export declare const POSITION: {
    [key in KeyOfPosition]: ToastPosition;
};
export declare const TYPE: {
    [key in KeyOfType]: TypeOptions;
};
export declare const enum DEFAULT {
    COLLAPSE_DURATION = 300,
    DEBOUNCE_DURATION = 50,
    CSS_NAMESPACE = "Toastify"
}
export {};
