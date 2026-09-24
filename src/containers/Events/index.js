import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

// CONSTANTE
const PER_PAGE = 9;

// hook
const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null); // par default check
  const [currentPage, setCurrentPage] = useState(1);

  // possible erreur undefined, ont filtre d abord
  const filteredEvents = (data?.events || [] ) // si data.event vrai sinon tableau vide ensuite filtre du tableau check
    .sort((evtA, evtB) => new Date(evtB.date) - new Date(evtA.date)) // Ajout du tri du plus récent au plus ancien (doublon vue par ce changement) check
    .filter((event) => {
    if (!type) { // si pas de (not)type est vrai check
      return true;
    }
    return event.type === type;
  });

  // ont decoupe par page
  const paginatedEvents = filteredEvents.filter((_, index) => {
  const startIndex = (currentPage - 1) * PER_PAGE;
  const endIndex = currentPage * PER_PAGE;
  return index >= startIndex && index < endIndex;
  });

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  const pageNumber = Math.ceil((filteredEvents?.length || 0) / PER_PAGE); // corection math.floor par math.ceil check 
  const typeList = new Set(data?.events?.map((event) => event.type));

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents?.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
