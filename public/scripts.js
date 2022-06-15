const ul = document.querySelector("ul")
const input = document.querySelector("input")
const form = document.querySelector('form')

async function load() {
    const res = await fetch("http://localhost:3000").then((data) => data.json()).then((data) => data);

    res.urls.map((url) => {
        return addElement(url);
    });
}

load();

async function fetchApiUrl(data, callback) {
    let apiUrl = 'http://localhost:3000';
    const qs = [];

    Object.keys(data).map((key, index) => {
        qs.push(`${key}=${data[key]}`);
    });

    if (qs.length > 0) {
        apiUrl += `/?${qs.join('&')}`;
    }

    await fetch(apiUrl).finally(() => {
        callback(data);
    });
}

function addElement({ name, url }) {
    const li = document.createElement('li')
    const a = document.createElement("a")
    const trash = document.createElement("span")

    a.href = url
    a.innerHTML = name
    a.target = "_blank"

    trash.innerHTML = "x"
    trash.onclick = () => removeElement(trash)

    li.append(a)
    li.append(trash)
    ul.append(li)
}

function removeElement(el) {
    if (confirm('Tem certeza que deseja deletar?')) {
        /* @todo delete from api too */
        el.parentNode.remove();
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let { value } = input

    if (!value)
        return alert('Preencha o campo')

    const [name, url] = value.split(",")

    if (!url)
        return alert('formate o texto da maneira correta')

    if (!/^http/.test(url))
        return alert("Digite a url da maneira correta")

    fetchApiUrl({ name, url }, (data) => {
        addElement(data);
    });

    input.value = ""
})