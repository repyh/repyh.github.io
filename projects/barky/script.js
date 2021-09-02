const url = document.getElementById('url-form');
const bark = document.getElementById('bark');
const target = document.getElementById('txt-body2');
const element = document.getElementById('scrl');
const quotaTarget = document.getElementById('quota');

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
    fetch('https://repyh.middleware.cjho1.repl.co/barky').then(async res => {
        const objectKey = await res.json();
        firebase.initializeApp(objectKey);
        const db = firebase.firestore();

        const query = await db.collection('users').doc(await biri()).get();
        const data = query.exists ? query.data() : {
            quota: 100
        };

        quotaTarget.innerHTML = data.quota.toLocaleString() + " Q";
        if(!query.exists) {
            db.collection('users').doc(await biri()).update({
                quota: 100
            });
        }
        
        bark.addEventListener('click', async e => {
            e.preventDefault();

            if(url.value.startsWith('https://repyh-middleware.cjho1.repl.co')) return alert("You can't access the target API for security reasons!");
            if(data.quota <= 0) return alert("You don't have enough data for the day!\nDaily Quota resets at 9am UTC");
            fetch(url.value, {
                method: "GET"
            }).then(async res => {
                const fetched = res.headers.get("content-type") && res.headers.get("content-type").indexOf("text/plain") !== -1 ? await res.text() : await res.json();
                const final = isJson(fetched) ? JSON.stringify(fetched, undefined, 2) : fetched;

                target.innerHTML = final;
                data.quota -= 1;
                quotaTarget.innerHTML = data.quota.toLocaleString() + " Q";

                db.collection('users').doc(await biri()).update({
                    quota: data.quota
                });
                window.scrollTo({
                    top: 760
                })
            })
        })
    })
}
