export function sortArrayByTime(arr) {
    return arr.sort((a, b) => {
        const dateA = new Date(a.DateTime);
        const dateB = new Date(b.DateTime);
        return dateA - dateB;
    });
}

export function saveToLocalStorage(key, value) {
    try {
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
        localStorage.setItem(key, stringValue);
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}
export function readFromLocalStorage(key) {
    try {
        const value = localStorage.getItem(key);
        return value && JSON.parse(value);
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

