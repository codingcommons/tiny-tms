<script lang="ts">
	export let firstname: string = 'Nomen'
	export let lastname: string = 'Nescio'

	function hashCode(str: string) {
		let hash = 0
		for (let i = 0, len = str.length; i < len; i++) {
			let chr = str.charCodeAt(i)
			hash = (hash << 3) - hash + chr
			hash |= 0
		}

		return Math.abs(hash)
	}

	function generateColor(firstname: string, lastname: string) {
		const hue = hashCode(firstname + lastname) % 360
		const saturation = 40
		const lightness = 55

		return `hsl(${hue},${saturation}%,${lightness}%)`
	}

	const backgroundColor = generateColor(firstname, lastname)
	const initials = `${firstname.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`
</script>

<div
	class="text- flex h-10 w-10 items-center justify-center rounded-full text-xl"
	style="background-color: {backgroundColor};"
>
	{initials}
</div>
