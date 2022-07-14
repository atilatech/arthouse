

export const ATILA_API_CREDITS_PUBLIC_KEY_LOCAL_STORAGE_KEY_NAME = 'atilaAPIKeyCredit';
export const ATILA_API_CREDITS_PUBLIC_KEY_HEADER_NAME = 'X-ATILA-API-CREDITS-KEY';

export class ServicesHelpers {

    static DEFAULT_HEADERS = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer':  `${window.location.origin}${window.location.pathname.replace(/\/$/, "")}`,
        'Origin': window.location.origin
        };

    static getHeaders = ({addAPIKey = false}: { addAPIKey?: boolean }) => {
        const headers: {[key: string]: any} = {
            ...ServicesHelpers.DEFAULT_HEADERS,
        }
        if (addAPIKey) {
            headers[ATILA_API_CREDITS_PUBLIC_KEY_HEADER_NAME] = 
            localStorage.getItem(ATILA_API_CREDITS_PUBLIC_KEY_LOCAL_STORAGE_KEY_NAME);
        }
        return headers
    }
}