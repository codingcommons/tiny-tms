import { type PlaywrightTestConfig, devices } from '@playwright/test'

const WEB_SERVER_PORT = 3000
const isRunningInCI = process.env.CI

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
		bypassCSP: true,
		trace: 'retain-on-failure',
		video: 'retain-on-failure',
		screenshot: 'only-on-failure'
	},
	webServer: {
		command: 'pnpm run preview',
		port: WEB_SERVER_PORT
	},
	reporter: [
		isRunningInCI ? ['github'] : ['list'],
		isRunningInCI
			? ['@estruyf/github-actions-reporter', { useDetails: true, showError: true }]
			: ['null'],
		[
			'html',
			{
				outputFolder: './e2e/report',
				open: isRunningInCI ? 'never' : 'on-failure'
			}
		]
	]
}

export default config
