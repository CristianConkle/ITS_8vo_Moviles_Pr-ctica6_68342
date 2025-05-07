// src/components/Pokedex/PokedexDetail.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface PokemonDetail {
  name: string;
  id: number;
  image: string;
  description: string;
  types: string[];
  height: number;
  weight: number;
}

const PokedexDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const speciesResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );
        const pokemonResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        const descriptionEntry = speciesResponse.data.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'es'
        );

        const types = pokemonResponse.data.types.map(
          (t: any) => t.type.name
        );

        setPokemon({
          id: pokemonResponse.data.id,
          name: pokemonResponse.data.name,
          image: pokemonResponse.data.sprites.front_default,
          description: descriptionEntry
            ? descriptionEntry.flavor_text.replace(/\n|\f/g, ' ')
            : 'Descripción no disponible.',
          types,
          height: pokemonResponse.data.height / 10, // decímetros → metros
          weight: pokemonResponse.data.weight / 10, // decagramos → kilogramos
        });
      } catch (error) {
        console.error('Error fetching Pokémon detail:', error);
      }
    };

    fetchPokemonDetail();
  }, [id]);

  if (!pokemon) {
    return <div className="font-pokemon text-xs p-2">Cargando...</div>;
  }

  return (
    <div className="w-full h-full overflow-hidden p-1">
      <div className="w-full h-full overflow-auto scrollbar-hide font-pokemon text-[8px] text-center p-1">
        <img src={pokemon.image} alt={pokemon.name} className="mx-auto w-16 h-16" />
        <p className="capitalize font-bold mt-1">{pokemon.name}</p>
        <p>ID: {pokemon.id}</p>
        <p className="italic mt-1">{pokemon.description}</p>
        <div className="mt-1">
          <p>Tipo: {pokemon.types.join(', ')}</p>
          <p>Altura: {pokemon.height} m</p>
          <p>Peso: {pokemon.weight} kg</p>
        </div>
      </div>
    </div>
  );
  
};

export default PokedexDetail;
