
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/desktop" | "/get-to-know-me" | "/playground" | "/playground/pacman" | "/playground/snake";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/desktop": Record<string, never>;
			"/get-to-know-me": Record<string, never>;
			"/playground": Record<string, never>;
			"/playground/pacman": Record<string, never>;
			"/playground/snake": Record<string, never>
		};
		Pathname(): "/" | "/desktop" | "/get-to-know-me" | "/playground/pacman" | "/playground/snake";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/LDD - Resume January 2026 V2.pdf" | "/vite.svg" | string & {};
	}
}