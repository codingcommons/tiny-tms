// See https://kit.svelte.dev/docs/types#app

import type { UserAuthCredentials } from 'services/user/user'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserAuthCredentials | undefined
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
