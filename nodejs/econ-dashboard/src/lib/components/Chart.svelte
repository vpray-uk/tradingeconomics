<script>
    import {Chart} from "frappe-charts"
    import {onMount} from "svelte";
    import {sortArrayByTime} from "$lib/util.js";
    import dayjs from "dayjs";
    export let data;
    export let indicator;

    let chart;
    let chartElem;
    let values = []
    let labels = []
    const preprocess = ({data, category}) => {
        const preprocessed = sortArrayByTime(data.filter(x => x.Category.toLowerCase() === category))
        for(let d of preprocessed) {
            labels.push(dayjs(d.DateTime).format("YYYY-MM-DD"))
            values.push(d.Value)
        }
    }


    const initChart = () => {
        chart = new Chart( chartElem, {
            title: indicator.toUpperCase(),
            data: {
                labels,
                datasets: [
                    {
                        name: indicator, chartType: 'line',
                        values
                    },
                ],
            },
            lineOptions: {
                hideDots: 1
            },
            type: 'axis-mixed',
            height: 200,
            colors: ['red'],

            tooltipOptions: {
                formatTooltipX: d => (d + '').toUpperCase(),
                formatTooltipY: d => d + '',
            }
        });
    }
    onMount(() => {
        preprocess({data, category: indicator})
        if(values.length ===0 && labels.length === 0) return;
        initChart()
    })
</script>
    <div bind:this={chartElem}>
    </div>

