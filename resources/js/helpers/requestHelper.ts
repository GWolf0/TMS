import { HOST_URL } from "@/requests/requests";
import { DOE, HTTPMethodType, HTTPRequest, JSONType } from "@/types/common";
import { UserType } from "@/types/models";

// mfetch (custom fetch method)
export async function mfetch({url, method, params}: {
    url: string, method?: HTTPMethodType, params?: JSONType
}): Promise<DOE>{
    method = method || "GET";
    params = params || {};

    // init doe (data or error) response
    let doe: DOE = {data: null, error: null};

    // csrf token
    const csrfToken = getCSRFToken();

    // check method (inject method type for laravel if not get or post)
    if(!["GET", "POST"].includes(method)){
        params._method = method.toUpperCase();
    }

    // try
    try{
        // setup request options
        const options: RequestInit = {
            method: method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        };
        // set body only for non get methods
        if(method !== "GET") options.body = JSON.stringify(params);

        // send request
        const res = await fetch(HOST_URL + url, options);
        if(res.redirected){ // return if redirect
            window.location.href = res.url;
            return doe; 
        }

        // get json
        const json = await res.json();
        
        // setup doe response based on success
        if(res.ok){
            doe.data = json;
        }else{
            doe.error = json;
            throw new Error(`*** ${JSON.stringify(json)} ***`);
        }
    }catch(e){
        // get and log error
        const err: Error = e as Error;
        console.error(`Error fetching ${method} at ${url} ; ${HOST_URL + url}`);
        console.error(`Sending ${params}`);
        console.error(err.message);
        console.error(err.stack);
    }finally{
        return doe;
    }
}

// send request (takes HTTPRequest object and send its request)
// ex: url: host/users/{id}, should replace {id} with value in params
export async function sendRequest(req: HTTPRequest, params: JSONType | undefined = undefined, user: UserType | null = null, searchQuery: string | undefined = undefined): Promise<DOE>{
    // check if allow only unauthenticated users (req.allowedRoles === null)
    if(req.allowedRoles === null && user) return { data: null, error: { message: "Only unauthenticated" } };

    // check if able by user role if specified (id req.allowedRoles are undefined then all roles are allowed)
    if(user && req.allowedRoles && !req.allowedRoles.includes(user.role)) return { data: null, error: { message: "Unauthorized" } };

    // substitute url params with passed params
    let url = new URL(HOST_URL + ( params ? req.url.replace(/{([^}]+)}/g, (_, f) => params[f]) : req.url ));

    // append search query if exists
    if(searchQuery) url.search = searchQuery;
    console.log("sending request", url.href.replace(url.origin, ""));
    console.log("params", params);

    // send
    return await mfetch({url: url.href.replace(url.origin, ""), method: req.method, params});
}

// get csrf token
export function getCSRFToken(): string{
    const metaElem: HTMLMetaElement | null = document.querySelector("meta[name=csrf-token]") as HTMLMetaElement;
    return decodeURIComponent(metaElem ? metaElem.content : "");
}

// get cookie
export function getCookie(name: string): string{
    const cooks: string[] = document.cookie.split(";");
    
    for(let i = 0; i < cooks.length; i++){
        const [key, val] = cooks[i].split("=");
        if(key == name)return val.trim();
    }
    return "";
}