const times = document.getElementById('time');
const root = document.querySelector('main');

let storage = [];
const data = localStorage.getItem('keluhan');
data && (storage = JSON.parse(data),
    document.getElementById('box-keluhan').classList.remove('d-none'),
    document.getElementById('clear').classList.remove('d-none'))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function updateDateTime() {
    times.textContent = new Date().toLocaleString();
}

updateDateTime();
setInterval(updateDateTime, 1000);

const based = (body, style = '', little = false) => `
    <div class="container px-3 mb-3 ${little ? 'vertical-center' : ''}">
        <div class="row justify-content-center">
            <div class="col-12">
                <div style="${style}" class="card p-3">
                    <div class="card-body">${body}</div>
                </div>
            </div>
        </div>
    </div>`;

document.addEventListener('DOMContentLoaded', () => {
    root.innerHTML = based(`<h5 class="text-center mb-3">Let's play games with me 🤩</h5>
        <div class="d-flex gap-3 justify-content-center">
        <button class="btn btn-danger">TIDAK</button>
            <button class="btn btn-success">YESSS</button>
        </div>`, '', true);

    document.querySelector('.btn-success').addEventListener('click', firstQuestion);
    document.querySelector('.btn-danger').addEventListener('click', rejectedQuestion);

    const keluhanElement = document.getElementById('keluhan');
    keluhanElement.innerHTML = storage.length ? storage.map(item => `<div class="card mb-2 p-3" style="font-weight: 200 !important;">${item}</div>`).join('') : 'Kamu belum punya keluhan';

    document.getElementById('clear').addEventListener('click', () => {
        localStorage.clear();
        reload();
    });
});

function rejectedQuestion() {
    document.getElementById('box-keluhan').classList.add('d-none')
    document.getElementById('clear').classList.add('d-none')
    root.innerHTML = based(`<h5>Lantas Apa yang anda lakukan DISINI ?!</h5>
    <div class="text-center">
    <h5 class="mb-3">Lanjut Ga ?</h5>
    <div class="d-flex gap-3 justify-content-center">
    <button class="btn btn-success">Lanjut deh</button>
    <button class="btn btn-danger">Ga</button></div>
    </div>
    `, '', true)

    const btn = document.querySelector('.btn-danger')
    btn.addEventListener('mouseover', function () {
        btn.style.position = "absolute"
        btn.style.left = `${Math.ceil(Math.random() * 100)}%`;
        btn.style.top = `${Math.ceil(Math.random() * 100)}%`;
    });

    btn.addEventListener('click', async () => {
        root.innerHTML = based(`<h5>LOK KOK ISO DIH LU ASIK BANG</h5>`)
        await sleep(4000)
        reload()
    })

    document.querySelector('.btn-success').addEventListener('click', firstQuestion)
}

function validateInput(input) {
    const regex = /<[^>]*>|javascript:|&(?!(?:apos|quot|[gl])t;)/gi;
    const sanitizedInput = input.replace(regex, '');

    if (!sanitizedInput.trim()) {
        alert('Gaboleh Kosong yaa');
        return false;
    }
    return sanitizedInput;
}

function firstQuestion() {
    document.getElementById('box-keluhan').classList.add('d-none')
    document.getElementById('clear').classList.add('d-none')
    root.innerHTML = based(`
        <h5 class="text-center mb-3">So first how's your day ?</h5>
        <p class="text-center fw-light">Tell me please ...</p>
        <textarea class="form-control mb-3" rows="10"></textarea>
        <button class="btn btn-secondary">Send to me</button>`);

    document.querySelector('.btn-secondary').addEventListener('click', () => {
        const textareaValue = document.querySelector('textarea').value;
        const sanitizedValue = validateInput(textareaValue);
        if (sanitizedValue !== false) {
            storage.push(sanitizedValue);
            saveLocalStorage();
            secondQuestion();
        }
    });
}

function secondQuestion() {
    root.innerHTML = based(`
        <h5 class="mb-3">Cape ngga kak ? hari harinya</h5> 
        <div class="d-flex gap-3 justify-content-center">
            <button class="btn btn-secondary">Ngga Kok</button>
            <button class="btn btn-warning">Cape jir</button>
        </div>`, '', true);

    document.querySelector('.btn-secondary').addEventListener('click', () => {
        lastSession('Anjay Keren Kak Semangat Ya ! Selalu', 1);
    });

    document.querySelector('.btn-warning').addEventListener('click', () => {
        lastSession('AWOKOWKOW Mampod BJIR Bye', 2);
    });
}

async function lastSession(message, model) {
    if (model === 1) {
        root.innerHTML = based(`<h5>${message}</h5>`, '', true);
        await sleep(1000)
        reload()
    } else {
        root.innerHTML = based(`<h5>${message}</h5>`, '', true);
        await sleep(2000)
        reload()
    }
}

function reload() {
    window.location.reload();
}

function saveLocalStorage() {
    localStorage.setItem('keluhan', JSON.stringify(storage));
}

console.log('%c Ngapain Lu Buka Console ? ', 'background: red; color: #eee; font-size: 32px;')