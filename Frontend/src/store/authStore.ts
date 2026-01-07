import { create } from 'zustand'

import type { User, UserRole } from '../types/auth.types'

type StorageMode = 'local' | 'session'

const STORAGE_KEYS = {
    token: 'jp_token',
    user: 'jp_user',
    storageMode: 'jp_storage_mode',
    isDemo: 'jp_is_demo',
} as const

function readStorage(mode: StorageMode): Storage {
    return mode === 'local' ? window.localStorage : window.sessionStorage
}

function safeGet<T>(storage: Storage, key: string): T | null {
    try {
        const raw = storage.getItem(key)
        if (!raw) return null
        return JSON.parse(raw) as T
    } catch {
        return null
    }
}

function safeSet(storage: Storage, key: string, value: unknown): void {
    storage.setItem(key, JSON.stringify(value))
}

function safeRemove(storage: Storage, key: string): void {
    storage.removeItem(key)
}

function detectInitialStorageMode(): StorageMode {
    const localMode = safeGet<StorageMode>(window.localStorage, STORAGE_KEYS.storageMode)
    if (localMode === 'local' || localMode === 'session') return localMode

    const sessionMode = safeGet<StorageMode>(window.sessionStorage, STORAGE_KEYS.storageMode)
    if (sessionMode === 'local' || sessionMode === 'session') return sessionMode

    return 'local'
}

function loadInitialAuth(): { token: string | null; user: User | null; mode: StorageMode; isDemo: boolean } {
    const mode = detectInitialStorageMode()
    const storage = readStorage(mode)

    const token = safeGet<string>(storage, STORAGE_KEYS.token)
    const user = safeGet<User>(storage, STORAGE_KEYS.user)
    const isDemo = safeGet<boolean>(storage, STORAGE_KEYS.isDemo) ?? false

    return { token, user, mode, isDemo }
}

export interface AuthState {
    token: string | null
    user: User | null
    role: UserRole | null
    storageMode: StorageMode
    isDemo: boolean

    setAuth: (args: { token: string; user: User; rememberMe: boolean; isDemo?: boolean }) => void
    logout: () => void
}

const initial = loadInitialAuth()

export const useAuthStore = create<AuthState>((set, get) => ({
    token: initial.token,
    user: initial.user,
    role: initial.user?.role ?? null,
    storageMode: initial.mode,
    isDemo: initial.isDemo,

    setAuth: ({ token, user, rememberMe, isDemo }) => {
        const mode: StorageMode = rememberMe ? 'local' : 'session'
        const demoFlag = Boolean(isDemo)

        // Clear both, then write to chosen storage to avoid stale token.
        for (const storage of [window.localStorage, window.sessionStorage]) {
            safeRemove(storage, STORAGE_KEYS.token)
            safeRemove(storage, STORAGE_KEYS.user)
            safeRemove(storage, STORAGE_KEYS.storageMode)
            safeRemove(storage, STORAGE_KEYS.isDemo)
        }

        const storage = readStorage(mode)
        safeSet(storage, STORAGE_KEYS.token, token)
        safeSet(storage, STORAGE_KEYS.user, user)
        safeSet(storage, STORAGE_KEYS.storageMode, mode)
        safeSet(storage, STORAGE_KEYS.isDemo, demoFlag)

        set({ token, user, role: user.role, storageMode: mode, isDemo: demoFlag })
    },

    logout: () => {
        for (const storage of [window.localStorage, window.sessionStorage]) {
            safeRemove(storage, STORAGE_KEYS.token)
            safeRemove(storage, STORAGE_KEYS.user)
            safeRemove(storage, STORAGE_KEYS.storageMode)
            safeRemove(storage, STORAGE_KEYS.isDemo)
        }
        set({ token: null, user: null, role: null, storageMode: 'local', isDemo: false })
    },
}))

export function getAuthToken(): string | null {
    return useAuthStore.getState().token
}

export function isAuthenticated(): boolean {
    return Boolean(useAuthStore.getState().token)
}
