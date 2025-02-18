const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const detailPanel = document.getElementById('detailPanel');
const closeBtn = document.getElementById('closeBtn');
const pokemonName = document.getElementById('pokemonName');
const pokemonType = document.getElementById('pokemonType');
const pokemonImage = document.getElementById('pokemonImage');
const pokemonStats = document.getElementById('pokemonStats');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-pokemon-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

async function loadPokemonDetails(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();
                
        // Atualiza os detalhes do Pokémon
        pokemonName.textContent = data.name;
        pokemonImage.src = data.sprites.other['official-artwork'].front_default;
                
        // Atualiza os tipos
        const types = data.types.map(type => type.type.name).join(', ');
        pokemonType.textContent = `Types: ${types}`;
                
        // Adiciona estatísticas
        const statsHTML = data.stats.map(stat => `
            <div class="stat">
                <strong>${stat.stat.name}:</strong> ${stat.base_stat}
            </div>
        `).join('');
        pokemonStats.innerHTML = statsHTML;
                
        // Mostra o painel
        detailPanel.classList.add('show-panel');
    } catch (error) {
        console.error('Error loading Pokemon details:', error);
    }
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    });
}

// Event listener para cliques na lista de Pokémon
pokemonList.addEventListener('click', (event) => {
    const pokemonCard = event.target.closest('.pokemon');
    if (pokemonCard) {
        const pokemonId = pokemonCard.dataset.pokemonId;
        loadPokemonDetails(pokemonId);
    }
});

// Fecha o painel ao clicar no botão X
closeBtn.addEventListener('click', () => {
    detailPanel.classList.remove('show-panel');
});

// Event listener para o botão "Load More"
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

// Carrega os primeiros Pokémon
loadPokemonItens(offset, limit);