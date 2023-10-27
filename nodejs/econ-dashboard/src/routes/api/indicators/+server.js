import { json } from '@sveltejs/kit';
import {getIndicatorValue} from "$lib/endpoints.js";
import dayjs from "dayjs";

export async function POST({ request }) {
            const postData = await request.json();
            const input =  {
                indicators: postData.selectedIndicators.join(","),
                country: postData.selectedCountry,
                dateTo: dayjs().format("YYYY-MM-DD"),
                dateFrom: dayjs().subtract(postData.periodInMonths, 'months').format("YYYY-MM-DD"),
            }
            const resp = await getIndicatorValue(input);

            // preprocess data
            const results = {}
            for(let indy of postData.selectedIndicators){
                results[indy] = resp.filter(x => x.Category.toLowerCase() === indy)
           }

            return json(results);

}
