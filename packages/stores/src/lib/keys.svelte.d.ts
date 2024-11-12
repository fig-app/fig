import type { KeyboardKey } from "@fig/types/KeyboardKey";
declare class Keys {
    keyPressed: KeyboardKey[];
    constructor();
    private handleKeyDown;
    private handleKeyUp;
    get anyPressed(): boolean;
    get combo(): KeyboardKey[];
    isPressed(key: KeyboardKey): boolean;
    checkCombo(keys: KeyboardKey[]): boolean;
    containCommandsKey(): boolean;
    shiftPressed(): boolean;
    ctrlPressed(): boolean;
    altPressed(): boolean;
    destroy(): void;
}
export declare const keys: Keys;
export {};
