<script>
	import Chart from "$lib/components/Chart.svelte";
	import {onMount} from "svelte";
	import Gear from "$lib/svg/Gear.svelte";
	import {readFromLocalStorage, saveToLocalStorage} from "$lib/util.js";

	let selectedIndicators;
	let periodInMonths;
	let selectedCountry;
	let dataset = [];
	let countryList = [];
	let loading = true;
	let error = '';
	const fetchData = async() => {
		return await fetch("/api/indicators", {
			method: 'POST',
			'Content-Type': 'application/json',
			body: JSON.stringify({selectedIndicators, periodInMonths, selectedCountry})
		});
	}

	const load = async () => {
		loading = true;
		error = '';
		const resp = await fetchData()
		if(resp.ok) {
			// force update
			dataset = []
			dataset = await resp.json()
		}
		else{
			const result = await resp.json()
			error = result.message
		}
		loading = false
	}

	const updatePeriod = async (newPeriod) => {
		periodInMonths = newPeriod;
		const settings = readFromLocalStorage("settings");
		saveToLocalStorage("settings", {...settings, periodInMonths})
		await load();
	}

	const updateCountry = async (newCountry) => {
		selectedCountry = newCountry;
		const settings = readFromLocalStorage("settings");
		saveToLocalStorage("settings", {...settings, selectedCountry})
		await load();
	}

	const setSettings = (settings) => {
		selectedIndicators = settings.selectedIndicators;
		countryList = settings.countryList;
		selectedCountry = settings.selectedCountry;
		periodInMonths = settings.periodInMonths;
	}

	onMount(async () => {
		let settings = readFromLocalStorage("settings");
		if(!settings) {
			// save default settings first
			saveToLocalStorage("settings", {
				selectedIndicators: ["gdp", "interest rate", "inflation rate"],
				countryList: ["thailand"],
				selectedCountry: "thailand",
				periodInMonths: 36
			})
			settings = readFromLocalStorage("settings");
		}
		setSettings(settings);
		await load();
	})

</script>

<div class="max-w-screen-sm min-h-screen mx-auto flex flex-col w-full p-1">
	<div class="text-xl">Compact Historical Econ Dashboard</div>
	<div class="text-lg my-2 flex flex-col gap-3 border border-secondary-500 rounded-md p-4 shadow-md">
		<span class="font-semibold my-2 text-right">
			<a href="/settings" class="p-2 btn variant-filled"><Gear /></a>
		</span>
		<div class="flex gap-2 items-center">
			<span>Period: </span>
			<button on:click={()=> updatePeriod(36)} class={`btn text-xs ${periodInMonths === 36 ? 'variant-filled' : 'border border-black'}`}>3Y</button>
			<button on:click={()=> updatePeriod(60)} class={`btn text-xs ${periodInMonths === 60 ? 'variant-filled' : 'border border-black'}`}>5Y</button>
			<button on:click={()=> updatePeriod(120)} class={`btn text-xs ${periodInMonths === 120 ? 'variant-filled' : 'border border-black'}`}>10Y</button>
		</div>
		<div class="flex gap-2 items-center">
			<span>Countries: </span>
			<div class="flex gap-2 items-center overflow-x-auto">
				{#each countryList as country}
					<button on:click={() => updateCountry(country)} class={`${selectedCountry === country ? "border variant-filled p-2 text-sm rounded-md text-white":"border border-black p-2 text-sm rounded-md text-variant-filled"}`}>
						{country.toUpperCase()}
					</button>
				{/each}
			</div>

		</div>
	</div>

	{#if loading}
		<div class="text-center text-xl w-full">
			Loading..
		</div>
		{:else}
		{#if error !== ''}
			<div class="text-center text-base w-full">
				There is a problem when fetching data. {error}
			</div>
			{:else}

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-1 w-full">
			{#each Object.keys(dataset) as indy}
				<Chart data={dataset[indy]} indicator={indy} />
			{/each}
		</div>
			{/if}
	{/if}

</div>
