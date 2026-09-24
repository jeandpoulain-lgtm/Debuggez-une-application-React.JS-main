import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";
// Slider
const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  // trie descendant 
  const byDateDesc = data?.focus?.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? 1 : -1 // erreur de trie inversement coriger check
  );
  // slider prochaine carte
  const nextCard = () => {
    setTimeout(
      () => setIndex(index < byDateDesc.length -1 ? index + 1 : 0), 5000 // page blanche -1 pour lenght tableaux commence a zero coriger check
    );
  };
  // appel de nextcard
  useEffect(() => {
    nextCard();
  });

  // rendu
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <>
          <div
            key={event.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc?.map((focusEvent, radioIdx) => ( // si vrai check
                <input
                  key={focusEvent.title}
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx} // puce
                  onChange={ () => setIndex(radioIdx) } // appel onChange check
                />
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Slider;