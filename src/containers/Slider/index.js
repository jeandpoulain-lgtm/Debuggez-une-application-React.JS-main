import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // 1. Tri descendant sur une COPIE du tableau [...array]
  const byDateDesc = [...(data?.focus || [])].sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? 1 : -1
  );

  // 2. Gestion du timer avec cleanup function dans useEffect
  useEffect(() => {
    if (!byDateDesc.length) return; // Sécurité si les données ne sont pas encore chargées

    const timer = setTimeout(() => {
      setIndex((prevIndex) =>
        prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearTimeout(timer); // Annule le chrono au démontage pour éviter les fuites de mémoire
  }, [index, byDateDesc.length]);

  return (
    <div className="SlideCardList">
      {/* Liste des cartes d'événements */}
      {byDateDesc?.map((event, idx) => (
        <div
          key={event.title || idx} // Key sur l'élément racine de la boucle
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
      ))}

      {/* Pagination (puces radio) SORTIE du premier .map() */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((focusEvent, radioIdx) => (
            <input
              key={`radio-${focusEvent.title || radioIdx}`} // Key unique pour chaque radio button
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => setIndex(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;