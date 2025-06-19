import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventService } from './eventService';
import axios from 'axios';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async (source) => {
    try {
      setLoading(true);
      console.log("Fetching events from /swp391/events");
      const response = await eventService.getEvents({ cancelToken: source.token });
      console.log("API response:", response.data);
      const mappedEvents = response.data.result.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        time: `${event.startTime} - ${event.endTime}`,
        location: event.location,
        description: event.description,
        image: event.imageUrl || event.images[0]?.url || '/assets/event-default.jpg',
        status: event.status,
        createdBy: event.createdBy?.name || 'Unknown',
      }));
      setEvents(mappedEvents);
      setError(null);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Fetch events cancelled:", error.message);
      } else {
        console.error('Fetch events error:', error);
        setError(error.message || 'Không thể tải sự kiện');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("EventProvider mounted");
    const source = axios.CancelToken.source();
    fetchEvents(source);

    return () => {
      console.log("EventProvider unmounting");
      source.cancel('Request cancelled due to component unmount');
    };
  }, []);

  return (
    <EventContext.Provider value={{ events, loading, error, fetchEvents }}>
      {children}
    </EventContext.Provider>
  );
};