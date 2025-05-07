import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

interface Pokemon {
  name: string;
  id: number;
  image: string;
}

const PokedexGrid: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const history = useHistory();
  const gridRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const results = response.data.results;

        const enrichedList = results.map((pokemon: any, index: number) => ({
          name: pokemon.name,
          id: index + 1,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
        }));

        setPokemonList(enrichedList);
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
      }
    };

    fetchPokemonList();
  }, []);

  // Configuración: 3 columnas por fila
  const columns = 3;

  const handleUp = () => {
    setSelectedIndex((prev) => (prev - columns >= 0 ? prev - columns : prev));
  };

  const handleDown = () => {
    setSelectedIndex((prev) =>
      prev + columns < pokemonList.length ? prev + columns : prev
    );
  };

  const handleLeft = () => {
    setSelectedIndex((prev) => (prev % columns === 0 ? prev : prev - 1));
  };

  const handleRight = () => {
    setSelectedIndex((prev) =>
      (prev + 1) % columns === 0 || prev + 1 >= pokemonList.length ? prev : prev + 1
    );
  };

  const handleSelect = () => {
    const selectedPokemon = pokemonList[selectedIndex];
    if (selectedPokemon) {
      history.push(`/pokedex/${selectedPokemon.id}`);
    }
  };

  // Exponer handlers globalmente
  (window as any).pokedexGridNavigation = {
    handleUp,
    handleDown,
    handleLeft,
    handleRight,
    handleSelect,
  };

  // Scroll automático cada vez que cambia la selección
  useEffect(() => {
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem && gridRef.current) {
      selectedItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [selectedIndex]);

  if (pokemonList.length === 0) {
    return <div className="font-pokemon text-xs p-2">Cargando...</div>;
  }

  return (
    <div ref={gridRef} className="w-full h-full overflow-auto scrollbar-hide">
      <div className="grid grid-cols-3 gap-1 p-2">
        {pokemonList.map((pokemon, index) => (
          <div
            key={pokemon.id}
            ref={(el) => { itemRefs.current[index] = el; }}
            className={`flex flex-col items-center border rounded p-1 ${
              index === selectedIndex ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <img src={pokemon.image} alt={pokemon.name} className="w-10 h-10" />
            <span className="capitalize text-[10px]">{pokemon.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokedexGrid;
