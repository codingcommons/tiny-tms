import type { TreeNode } from './NavigationTree.svelte'
import type { LayoutLoad } from './$types'

const storyImports = import.meta.env.PROD ? [] : import.meta.glob('/src/**/*.story.svelte')

const storiesMenuData = [
	['/docs', 'Components Overview'],
	...Object.keys(storyImports)
		.map((module) => {
			const name = module
				.substring(module.lastIndexOf('/') + 1, module.length)
				.replace('.story.svelte', '')
			const href = module.replace('/src', '/docs').replace('.story.svelte', '')

			return [href, name]
		})
		.sort()
]

const data: TreeNode = {
	children: [],
	name: 'components',
	href: 'components'
}

storiesMenuData.forEach((component) => {
	const path = component[0]
	const pathParts = path?.split('/')

	if (pathParts !== undefined && pathParts.length > 2) {
		let currentNode = data

		//traverse through path and attach each part as node if not existing
		for (
			let currentPathPartIndex = 2;
			currentPathPartIndex < pathParts.length;
			currentPathPartIndex++
		) {
			const currentPathPart = pathParts[currentPathPartIndex]

			if (currentNode.name !== currentPathPart) {
				const tempNextNode = currentNode.children.find(
					(el: { name: string | undefined }) => el.name === currentPathPart
				)

				if (tempNextNode === undefined) {
					currentNode.children.push({
						name: currentPathPart ?? '',
						children: [],
						href: pathParts.filter((el) => pathParts.indexOf(el) <= currentPathPartIndex).join('/')
					})
				}

				// if tempNextNode was null we just attached the next node so the find result can't be undefined
				currentNode = currentNode.children.find(
					(el: { name: string | undefined }) => el.name === currentPathPart
				) as TreeNode
			}
		}
	}
})

export const load: LayoutLoad = () => data