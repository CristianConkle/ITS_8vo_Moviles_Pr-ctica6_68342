// src/components/Pokedex/PokedexList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Pokemon {
  name: string;
  url: string;
  id: number;
  image: string;
}

const PokedexList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const results = response.data.results;

        const enrichedList = results.map((pokemon: any, index: number) => ({
          name: pokemon.name,
          url: pokemon.url,
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

  const handleUp = () => {
    setSelectedIndex((prev) => (prev === 0 ? pokemonList.length - 1 : prev - 1));
  };

  const handleDown = () => {
    setSelectedIndex((prev) => (prev === pokemonList.length - 1 ? 0 : prev + 1));
  };

  // Exponemos métodos globalmente para usarlos desde el Cross
  (window as any).pokedexNavigation = { handleUp, handleDown };

  if (pokemonList.length === 0) return <div className="font-pokemon text-xs p-2">Cargando...</div>;

  const selectedPokemon = pokemonList[selectedIndex];

  return (
    <div className="font-pokemon text-xs p-2 text-center">
      <img src={selectedPokemon.image} alt={selectedPokemon.name} className="mx-auto w-20 h-20" />
      <p className="capitalize mt-2">{selectedPokemon.name}</p>
      <p className="mt-1 text-[10px]">ID: {selectedPokemon.id}</p>
    </div>
  );
};

export default PokedexList;
