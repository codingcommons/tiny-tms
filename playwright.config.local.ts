import { type PlaywrightTestConfig, devices } from '@playwright/test'

const WEB_SERVER_PORT = 3000
const config: PlaywrightTestConfig = {
	testDir: './e2e/specs',
	outputDir: './e2e/results',
	projects: [
		{
			name: 'Chrome',
			testMatch: /.*\.spec\.ts/,
			use: {
				...devices['Desktop Chrome']
			}
		}
	],
	use: {
		baseURL: `http://localhost:${WEB_SERVER_PORT}`,
		bypassCSP: true
	},
	webServer: {
		command: 'pnpm run dev',
		port: WEB_SERVER_PORT
	},
	reporter: [['list']]
}

export default config
