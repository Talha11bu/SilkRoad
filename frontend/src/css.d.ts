declare module '*.css' {}

interface ImportMetaEnv {
	readonly BUN_PUBLIC_API_URL?: string;
	readonly BUN_PUBLIC_WS_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
