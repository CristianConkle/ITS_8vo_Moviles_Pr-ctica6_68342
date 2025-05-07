import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

interface GameItem {
  name: string;
  id: number;
  image: string;
}

const PackGrid: React.FC = () => {
  const [itemList, setItemList] = useState<GameItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const history = useHistory();
  const gridRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchItemList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/item?limit=50');
        const results = response.data.results;

        const enrichedList = results.map((item: any, index: number) => ({
          name: item.name,
          id: index + 1,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`,
        }));

        setItemList(enrichedList);
      } catch (error) {
        console.error('Error fetching item list:', error);
      }
    };

    fetchItemList();
  }, []);

  const columns = 3;

  const handleUp = () => {
    setSelectedIndex((prev) => (prev - columns >= 0 ? prev - columns : prev));
  };

  const handleDown = () => {
    setSelectedIndex((prev) =>
      prev + columns < itemList.length ? prev + columns : prev
    );
  };

  const handleLeft = () => {
    setSelectedIndex((prev) => (prev % columns === 0 ? prev : prev - 1));
  };

  const handleRight = () => {
    setSelectedIndex((prev) =>
      (prev + 1) % columns === 0 || prev + 1 >= itemList.length ? prev : prev + 1
    );
  };

  const handleSelect = () => {
    const selectedItem = itemList[selectedIndex];
    if (selectedItem) {
      history.push(`/pack/${selectedItem.id}`);
    }
  };

  // Exponer handlers globalmente
  (window as any).packGridNavigation = {
    handleUp,
    handleDown,
    handleLeft,
    handleRight,
    handleSelect,
  };

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

  if (itemList.length === 0) {
    return <div className="font-pokemon text-xs p-2">Cargando objetos...</div>;
  }

  return (
    <div ref={gridRef} className="w-full h-full overflow-auto scrollbar-hide">
      <div className="grid grid-cols-3 gap-1 p-2">
        {itemList.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => { itemRefs.current[index] = el; }}
            className={`flex flex-col items-center border rounded p-1 ${
              index === selectedIndex ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <img src={item.image} alt={item.name} className="w-10 h-10" />
            <span className="capitalize text-[10px]">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackGrid;
