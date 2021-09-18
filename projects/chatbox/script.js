let username = 'Guest';
let tag = Date.now().toString().substr(Date.now().toString().length-4);
const id = Date.now().toString();
const ws = new WebSocket('wss://CrispDigitalEmulator.cjho1.repl.co/');

function updateUsername() {
    return username = document.querySelector('#username-input').value;
}

ws.onopen = () => {
    ws.send(JSON.stringify({
        event: 'REGISTER',
        user: {
            id,
            username: username + '#' + tag
        }
    }));
}

ws.onmessage = (message) => {
    message = JSON.parse(message.data);
    if(message.event === 'MESSAGE') {
        const target = document.querySelector('.chats');
        const li = document.createElement('li');
        const h5 = document.createElement('h5');
        const p = document.createElement('p');

        h5.innerHTML = message.username;
        p.innerHTML = message.message;

        li.appendChild(h5);
        li.appendChild(p);

        message.username === username + '#' + tag ? li.classList.add('right') : 0;
        target.appendChild(li);
    }
}

document.querySelector('#send').addEventListener('click', e => {
    e.preventDefault();
    const message = document.querySelector('#message');
    ws.send(JSON.stringify({
        event: 'BROADCAST',
        message: message.value,
        username: username + '#' + tag
    }))
    message.value = '';
})