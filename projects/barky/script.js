const fetchBtn = document.getElementById('fetch-btn');
const apiURL = document.getElementById('inputPassword2');
const responseWrapper = document.getElementById('rspn');
const responseCode = document.createElement('P');
const targetArea = document.getElementById('fetch-result');
const noCORS = document.getElementById('flexCheckDefault');
const quotaField = document.getElementById('quota');

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

window.onload = async () => {
    const lastFetched = localStorage.getItem('lastFetched');
    if(lastFetched) targetArea.innerHTML = lastFetched;

    fetch('https://repyh-middleware.cjho1.repl.co/barky').then(async res => {
        const objectKey = await res.json();
        firebase.initializeApp(objectKey);
        const db = firebase.firestore();

        const quota = await db.collection('users').doc(await biri()).get();
        if(!quota.exists) {
            db.collection('users').doc(await biri()).set({
                quota: 25
            });
            console.log("a")
            fetchBtn.addEventListener('click', async e => {
                e.preventDefault();
                fetch(apiURL.value, {
                    mode: noCORS.checked ? 'no-cors' : 'cors'
                }).then(async res => {
                    responseCode.innerHTML = `Response Code: ${res.status}`
                    responseWrapper.appendChild(responseCode)
                    const fetched = res.headers.get("content-type") && res.headers.get("content-type").indexOf("text/plain") !== -1 ? await res.text() : await res.json();
                    
                    const query = await db.collection('users').doc(await biri()).get();
                    quotaField.value = (query.data().quota-1).toLocaleString();

                    db.collection('users').doc(await biri()).set({
                        quota: query.data().quota-1
                    })
                    targetArea.innerHTML = isJson(fetched) ? JSON.stringify(fetched, undefined, 4) : fetched;
                    localStorage.setItem('lastFetched', isJson(fetched) ? JSON.stringify(fetched, undefined, 4) : fetched)
                    if(query.data().quota-1 <= 2) quotaField.classList.add('red');
                })
            })
            return quotaField.value = "25";
        }else{
            const query = quota.data();
            
            if(query.quota-1 <= 10) quotaField.classList.add('red');
            fetchBtn.addEventListener('click', async e => {
                e.preventDefault();
                
                const query = await db.collection('users').doc(await biri()).get();
                if(query.data().quota <= 0) return alert("You don't have enough quota for the day!");

                fetch(apiURL.value, {
                    mode: noCORS.checked ? 'no-cors' : 'cors'
                }).then(async res => {
                    responseCode.innerHTML = `Response Code: ${res.status}`
                    responseWrapper.appendChild(responseCode)
                    const fetched = res.headers.get("content-type") && res.headers.get("content-type").indexOf("text/plain") !== -1 ? await res.text() : await res.json();
                    
                    const query = await db.collection('users').doc(await biri()).get();
                    quotaField.value = (query.data().quota-1).toLocaleString();

                    db.collection('users').doc(await biri()).set({
                        quota: query.data().quota-1
                    })
                    targetArea.innerHTML = isJson(fetched) ? JSON.stringify(fetched, undefined, 4) : fetched;
                    localStorage.setItem('lastFetched', isJson(fetched) ? JSON.stringify(fetched, undefined, 4) : fetched)
                })
            })
            quotaField.value = query.quota.toLocaleString();
        }
    })
}
