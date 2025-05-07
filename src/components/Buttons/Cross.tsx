import { useContext } from "react";
import { EPokedexScreen, MenuPokedexContext } from "../../contexts/MenuPokedexContext";

export const Cross = () => {
  const { screen, menuOption, setMenuOption } = useContext(MenuPokedexContext);

  const handleUp = () => {
    if (screen === EPokedexScreen.MENU) {
      const newOption = menuOption - 1 < 1 ? 3 : menuOption - 1;
      setMenuOption(newOption);
    } else if (screen === EPokedexScreen.POKEDEX) {
      (window as any).pokedexGridNavigation?.handleUp();
    } else if (screen === EPokedexScreen.PACK) {
      (window as any).packGridNavigation?.handleUp();
    }
  };
  
  const handleDown = () => {
    if (screen === EPokedexScreen.MENU) {
      const newOption = menuOption + 1 > 3 ? 1 : menuOption + 1;
      setMenuOption(newOption);
    } else if (screen === EPokedexScreen.POKEDEX) {
      (window as any).pokedexGridNavigation?.handleDown();
    } else if (screen === EPokedexScreen.PACK) {
      (window as any).packGridNavigation?.handleDown();
    }
  };
  
  const handleLeft = () => {
    if (screen === EPokedexScreen.POKEDEX) {
      (window as any).pokedexGridNavigation?.handleLeft();
    } else if (screen === EPokedexScreen.PACK) {
      (window as any).packGridNavigation?.handleLeft();
    }
  };
  
  const handleRight = () => {
    if (screen === EPokedexScreen.POKEDEX) {
      (window as any).pokedexGridNavigation?.handleRight();
    } else if (screen === EPokedexScreen.PACK) {
      (window as any).packGridNavigation?.handleRight();
    }
  };
  
  const handleSelect = () => {
    if (screen === EPokedexScreen.POKEDEX) {
      (window as any).pokedexGridNavigation?.handleSelect();
    }
  };

  return (
    <div id="cross">
      <div id="leftcross" className="gameboy-button" onClick={handleLeft}>
        <div id="leftT"></div>
      </div>
      <div id="topcross" className="gameboy-button" onClick={handleUp}>
        <div id="upT"></div>
      </div>
      <div id="rightcross" className="gameboy-button" onClick={handleRight}>
        <div id="rightT"></div>
      </div>
      <div id="midcross" className="gameboy-button">
        <div id="midCircle"></div>
      </div>
      <div id="botcross" className="gameboy-button" onClick={handleDown}>
        <div id="downT"></div>
      </div>
    </div>
  );
};