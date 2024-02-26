const pokemons = document.querySelector("#pokemons");
const inputBox = document.getElementById("input-box");
const resultsBox = document.querySelector(".result-box");

const pokemonCount = 24;

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

const colors = {
    fighting: '#ce3f6a',
    psychic: '#f97077',
    poison: '#ab6ac8',
    dragon: '#096dc3',
    ghost: '#5269ab',
    dark: '#595365',
    ground: '#d97746',
    fire: '#fe9c53',
    fairy: '#ec8fe7',
    water: '#4d90d5',
    flying: '#8fa8de',
    normal: '#9098a2',
    rock: '#c6b889',
    electric: '#f4d23b',
    bug: '#90c02c',
    grass: '#63bb5c',
    ice: '#73cebf',
    steel: '#5a8fa1'
};

const mainTypes = Object.keys(colors);

//css dinâmico
const generateDynamicCSS = () => {
    let dynamicCSS = '';

    for (const type in colors) {
        dynamicCSS += `
            .${type} {
                background: linear-gradient(to right top, ${colors[type]}d5, ${colors[type]}6e),
                    url(images/4.svg) no-repeat;
                background-size: auto;
                background-position-x: right;
            }
        `;
    }

    return dynamicCSS;
};

const dynamicStyles = document.createElement('style');
dynamicStyles.innerHTML = generateDynamicCSS();
document.head.appendChild(dynamicStyles);

function gerarNumeroAleatorio(x) {
    return Math.floor(Math.random() * x) + 1;
}

//percorrer os pokemns
const fetchPokemons = async () => {
    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemons(i, false);
    }
}

const goToDetails = async (pokemonId) => {
    // getPokemons(id, true);
    console.log('goToDetails', pokemonId)
    window.location.href = 'details.html?pokedex=' + pokemonId; ""
}

const getPokemons = async (id, crtl) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (crtl) { console.log('to local storage', data) }

    !crtl ? createPokemonCard(data, false) : localStorage.setItem('poke-api', JSON.stringify(data));
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
    createPokemonCard(data, true);
}

const createPokemonCard = (poke, ctrl) => {

    if (ctrl) {
        pokemons.innerHTML = '';
    }

    const card = document.createElement('div');
    card.classList.add("poke-card");

    const name = poke.name[0].toUpperCase() + poke.name.slice(1);
    const id = poke.id.toString().padStart(3, "0");

    const pokeTypes = poke.types.map(p => p.type.name);

    const type = mainTypes.find(type => pokeTypes.indexOf(type) > -1);
    const color = colors[type];

    card.classList.add(type);

    const typesInnerHTML = pokeTypes.map(type => `
        <li class="poke-type"><span class="poke-color-name">${type}</span></li>
    `).join('');

    const pokemnInnerHTML = `
        <div class="w-50 poke-info">
            <div class="poke-data">
                <span>#${id}</span>
                <strong class="poke-name">${name}</strong>
            </div>
            <span class="poke-titles">Tipo:</span>
            <ul class="poke-types">
                 ${typesInnerHTML}
            </ul>

            <div class="text-end mt-2 text-center">
                <a onclick="goToDetails(${poke.id})" id="verPokemon" class="poke-fs12 link-light cursor">VER</a>
            </div>
        </div>
        <div class="w-50 poke-img center-image">
            <img class="poke-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${poke.id}.png" alt="${name}">
        </div>
    `;

    card.innerHTML = pokemnInnerHTML;
    pokemons.appendChild(card);
}

function redirectToDetails(pokemonId) {
    // Adicione aqui a lógica de redirecionamento para a página de detalhes
    // Por exemplo, você pode usar window.location.href ou outras formas de navegação
    console.log('Redirecionar para detalhes do Pokémon com ID:', pokemonId);
    // window.location.href = 'details.html?pokedex_id=' + pokemonId;
}


fetchPokemons();