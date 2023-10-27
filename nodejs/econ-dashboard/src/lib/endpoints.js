
import { env } from '$env/dynamic/private';
import {error} from "@sveltejs/kit";

const baseUrl = env.PRIVATE_BACKENDURL
const makeRequest = async (path) => {
    const resp = await fetch(`${baseUrl}${path}?c=${env.PRIVATE_APIKEY}`)
    let result;
    try{
        result = await resp.json();
    }
    catch(e){
        console.error("Failed to parse json: " +e)
        console.error(`Showing the plain status text instead: ${resp.status} - ${resp.statusText}`)
    }
    if(resp.ok && result){
        return result;
    }

    throw error(resp.status, {message: resp.statusText});
}

export const getIndicatorValue = async ({indicators, country, dateFrom, dateTo}) => {
    let path = `historical/country/${country}/indicator/${indicators}`;
    if(dateFrom && dateTo) {
        path += `/${dateFrom}/${dateTo}`;
    }
    return await makeRequest(path)
}