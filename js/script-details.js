
document.addEventListener('DOMContentLoaded', function () {
    function getParameterByName(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    const pokemonId = getParameterByName('pokedex');
    getPokeData(pokemonId);
});

const typeColor = {
    bug: "#26de81",
    dragon: "#ffeaa7",
    electric: "#fed330",
    fairy: "#ff0069",
    fighting: "#30336b",
    fire: "#f0932b",
    flying: "#81ecec",
    grass: "#00b894",
    ground: "#efb549",
    ghost: "#a55eea",
    ice: "#74b9ff",
    normal: "#95afc0",
    poison: "#6c5ce7",
    psychic: "#a29bfe",
    rock: "#2d3436",
    water: "#0190ff"
}

const url = "https://pokeapi.co/api/v2/pokemon/";
const card = document.getElementById("card");
const inputBox = document.getElementById("input-box");
const resultsBox = document.querySelector(".result-box");

let getPokeData = (pokemonId) => {

    const finalUrl = url + pokemonId;
    fetch(finalUrl)
        .then((response) => response.json())
        .then((data) => {
            generateCard(data);
        });
};

generateCard = (data) => {
    const hp = data.stats[0].base_stat;
    const imgSrc = data.sprites.other.dream_world
        .front_default;
    const pokeName = data.name[0].toUpperCase() + data.name.slice(1);
    const statAttack = data.stats[1].base_stat;
    const statDefense = data.stats[2].base_stat;
    const statSpeed = data.stats[5].base_stat;

    const themeColor = typeColor[data.types[0].type.name];

    card.innerHTML = `
    <p class="hp">

        <span>HP</span>
        ${hp}

    </p>
    
    <img src=${imgSrc} >
    
    <h2 class="poke-name">${pokeName}</h2>
    <div class="types">

    </div>
    <div class="stats">

        <div>
            <h3>${statAttack}</h3>
            <p>Attack</p>
        </div>

        <div>
            <h3>${statDefense}</h3>
            <p>Defense</p>
        </div>

        <div>
            <h3>${statSpeed}</h3>
            <p>Speed</p>
        </div>

    </div>
    `;
    appendTypes(data.types);
    styleCard(themeColor);
};

let appendTypes = (types) => {
    types.forEach((item) => {
        let span = document.createElement("SPAN");
        span.classList.add("poke-type");
        span.textContent = item.type.name;
        document.querySelector(".types").appendChild(span);
    });

};

let styleCard = (color) => {
    card.style.background = `radial-gradient(
        circle at 50% 0%, ${color} 36%, #efffff 36%)`;
    card.querySelectorAll(".types span").forEach((typeColor) => {
        typeColor.style.backgroundColor = color;
    });
};

inputBox.onkeyup = () => {
    let result = [];
    let input = inputBox.value;

    if (input.length) {
        result = pokeNames.filter((keywod) => {
            return keywod.toLowerCase().includes(input.toLowerCase());
        });
    }

    display(result);

    if (!result.length) {
        resultsBox.innerHTML = '';
    }
}

display = (result) => {
    const content = result.map((list) => {
        return `<li onclick=selectedInput(this) value='${list}'>` + list + "</li>";
    });
    resultsBox.innerHTML = "<ul>" + content.join("") + "</ul>";
}

selectedInput = (list) => {
    inputBox.value = list.innerHTML;
    resultsBox.innerHTML = '';
    var value = list.getAttribute('value');
    getPokemonsSearch(value.toLowerCase());
}

getPokemonsSearch = async (pokeName) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
    const resp = await fetch(url);
    const data = await resp.json();
    generateCard(data);
}