import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface ItemDetail {
  name: string;
  id: number;
  image: string;
  description: string;
  category: string;
}

const PackDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemDetail | null>(null);

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const itemResponse = await axios.get(
          `https://pokeapi.co/api/v2/item/${id}`
        );

        const descriptionEntry = itemResponse.data.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'es'
        );

        setItem({
          id: itemResponse.data.id,
          name: itemResponse.data.name,
          image: itemResponse.data.sprites.default,
          description: descriptionEntry
            ? descriptionEntry.text.replace(/\n|\f/g, ' ')
            : 'Descripción no disponible.',
          category: itemResponse.data.category.name,
        });
      } catch (error) {
        console.error('Error fetching item detail:', error);
      }
    };

    fetchItemDetail();
  }, [id]);

  if (!item) {
    return <div className="font-pokemon text-xs p-2">Cargando objeto...</div>;
  }

  return (
    <div className="font-pokemon text-[10px] p-2 text-center w-full h-full overflow-hidden">
      <div className="w-full h-full overflow-auto scrollbar-hide">
        <img src={item.image} alt={item.name} className="mx-auto w-16 h-16" />
        <p className="capitalize font-bold mt-1">{item.name}</p>
        <p>ID: {item.id}</p>
        <div className="mt-1 px-1 text-[8px] break-words">
          <p className="italic">
            {item.description.length > 150
              ? item.description.slice(0, 150) + '...'
              : item.description}
          </p>
          <p className="mt-1">Categoría: {item.category}</p>
        </div>
      </div>
    </div>
  );
  
};

export default PackDetail;
