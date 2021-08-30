const fetchBtn = document.getElementById('fetch-btn');
const apiURL = document.getElementById('inputPassword2');
const responseWrapper = document.getElementById('rspn');
const responseCode = document.createElement('P');
const targetArea = document.getElementById('fetch-result');

fetchBtn.addEventListener('click', async e => {
    e.preventDefault();
    fetch(apiURL.value).then(async res => {
        responseCode.innerHTML = `Response Code: ${res.status}`
        responseWrapper.appendChild(responseCode)
        const fetched = res.headers.get("content-type") && res.headers.get("content-type").indexOf("text/plain") !== -1 ? await res.text() : await res.json();

        targetArea.innerHTML = isJson(fetched) ? JSON.stringify(fetched, undefined, 4) : fetched;
    })
})

function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}