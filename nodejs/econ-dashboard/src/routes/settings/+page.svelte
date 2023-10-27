<script>
    import {onMount} from "svelte";
    import {readFromLocalStorage, saveToLocalStorage} from "$lib/util.js";
    import { getModalStore } from '@skeletonlabs/skeleton';

    const modalStore = getModalStore();

    let indicators = [];
    let countries = [];

    const saveIndicator = (entry) => {
        indicators.push(entry?.trim()?.toLowerCase())
        indicators =  Array.from(new Set(indicators));
        saveToLocalStorage("settings", {
            ...readFromLocalStorage("settings"),
            selectedIndicators: indicators
        });
    }
    const saveCountry = (entry) => {
        countries.push(entry?.trim()?.toLowerCase())
        countries =  Array.from(new Set(countries));
        saveToLocalStorage("settings", {
            ...readFromLocalStorage("settings"),
            countryList: countries
        });
    }

    const deleteIndicator = (indicator) => {
        const filtered =  indicators.filter(x => x !== indicator);
        indicators = filtered;
        saveToLocalStorage("settings", {
            ...readFromLocalStorage("settings"),
            selectedIndicators: filtered
        });
    }

    const deleteCountry = (country) => {
        const filtered =  countries.filter(x => x !== country);
        countries = filtered;
        saveToLocalStorage("settings", {
            ...readFromLocalStorage("settings"),
            countryList: filtered
        });
    }

    const addIndicator = () => {
        const modal = {
            type: 'prompt',
            title: 'Enter an indicator',
            body: 'The indicator name must be a valid indicator from TE.',
            value: '',
            valueAttr: { type: 'text', minlength: 0, maxlength: 100, required: true },
            response: (r) => {
                if(!r) return;
                saveIndicator(r)
            }
        };
        modalStore.trigger(modal);
    }

    const addCountry = () => {
        const modal = {
            type: 'prompt',
            title: 'Enter an country',
            body: 'The input country must be available in TE.',
            value: '',
            valueAttr: { type: 'text', minlength: 0, maxlength: 100, required: true },
            response: (r) => {
                if(!r) return;
                saveCountry(r)
            }
        };
        modalStore.trigger(modal);
    }

    onMount(async () => {
        const settings = readFromLocalStorage("settings");
        indicators = settings.selectedIndicators;
        countries = settings.countryList;
    })

</script>

<div class="max-w-screen-sm min-h-screen mx-auto flex flex-col w-full p-1">
    <div class="text-xl font-semibold flex w-full justify-between items-center my-4">
        <span>Settings</span>
        <a href="/" class="text-sm">back to main</a>
    </div>
    <div class="flex flex-row gap-4 w-full">
        <div class="flex flex-col gap-1 w-full">
            <div class="text-base w-full flex justify-between items-center px-1">
                <span>Indicators</span>
                <button on:click={addIndicator}>+</button>
            </div>
            <div class="border border-black p-2 h-[300px] w-full rounded-md flex flex-col gap-1 overflow-y-auto">
                {#each indicators as indy}
                    <div class="px-1 w-full flex justify-between">
                        <span>{indy}</span>
                        <button on:click={()=>deleteIndicator(indy)} >x</button>
                    </div>
                {/each}
            </div>
        </div>
        <div class="flex flex-col gap-1 w-full">
            <div class="text-base w-full flex justify-between items-center px-1">
                <span>Countries</span>
                <button on:click={addCountry}>+</button>
            </div>
            <div class="border border-black p-2 h-[300px] w-full rounded-md flex flex-col gap-1 overflow-y-auto">
                {#each countries as country}
                    <div class="px-1 w-full flex justify-between">
                        <span>{country}</span>
                        <button on:click={()=>deleteCountry(country)} >x</button>
                    </div>
                {/each}
            </div>
            </div>
    </div>
</div>