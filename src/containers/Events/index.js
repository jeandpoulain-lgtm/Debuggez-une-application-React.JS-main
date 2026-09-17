import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

const filteredEvents = (data?.events || []).filter((event) => {
  if (!type) return true;
  return event.type === type;
});

const uniqueEvents = filteredEvents.filter(
  (event, index, self) =>
    index === self.findIndex(
      (e) => e.title === event.title && e.date === event.date
    )
);

const sortedEvents = [...uniqueEvents].sort(
  (evtA, evtB) => new Date(evtB.date) - new Date(evtA.date)
);

  const startIndex = (currentPage - 1) * PER_PAGE;
  const endIndex = startIndex + PER_PAGE;
  const paginatedEvents = sortedEvents.slice(startIndex, endIndex);

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  const pageNumber = Math.ceil((sortedEvents.length || 0) / PER_PAGE);
  const typeList = new Set((data?.events || []).map((event) => event.type));

  return (
    <>
        {error ? (
          <div>An error occured</div>
        ) : data === null ? (
          "loading"
        ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
            <Modal key={event.id || event.title} Content={<ModalEvent event={event} />}>
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
              <a
                key={`page-${n + 1}`}
                href="#events"
                onClick={() => setCurrentPage(n + 1)}
              >
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