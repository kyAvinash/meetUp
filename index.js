const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect");

const Event = require("./models/events.models");

app.use(express.json());

initializeDatabase();

async function createEvent(newEvent) {
  try {
    const event = new Event(newEvent);
    const savedEvent = await event.save();
    // console.log('Saved event:', savedEvent);
    return savedEvent;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

app.post("/events", async (req, res) => {
  try {
    //console.log("Received request body:", req.body);
    const savedEvent = await createEvent(req.body);
    res.status(201).json({ message: "Event created successfully", savedEvent });
  } catch (error) {
    res.status(500).json({ error: "Failed to Add Event" });
  }
});

async function readAllEvents() {
  try {
    const allEvents = await Event.find();
    return allEvents;
  } catch (error) {
    throw error;
  }
}

app.get("/events", async (req, res) => {
  try {
    const events = await readAllEvents();
    if (events.length != 0) {
      res.json(events);
    } else {
      res.status(404).json({ message: "No Events Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch Events" });
  }
});

async function readEventById(eventId) {
  try {
    const event = await Event.findById(eventId);
    return event;
  } catch (error) {
    throw error;
  }
}

app.get("/events/:id", async (req, res) => {
  try {
    const event = await readEventById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: "No Event Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch Event" });
  }
});

/*
async function searchEventByTitle(searchQuery){
  try{
    const events = await Event.find({title: searchQuery});
    return events;
  }catch(error){
    throw error;
  }
}

async function searchEventByTags(searchQuery){
  try{
   const events = await Event.find({tags: searchQuery});
    return events;
  }catch(error){
    throw error;
  }
}
*/

async function searchEvents(searchQuery) {
  try {
    const allEvents = await Event.find();
    const filteredEvents = allEvents.filter(
      (event) =>
        event.title.includes(searchQuery) || event.tags.includes(searchQuery),
    );
    return filteredEvents;
  } catch (error) {
    throw error;
  }
}

app.get("/events/search/:searchQuery", async (req, res) => {
  try {
    const searchQuery = req.params.searchQuery;
    const events = await searchEvents(searchQuery);
    if (events.length > 0) {
      res.json(events);
    } else {
      res.status(404).json({ message: "No Events Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch Events" });
  }
});

/*
app.get("/events/search/:searchQuery", async(req, res)=>{
  try{
    const searchQuery = req.params.searchQuery;
    const eventsByTitle = await searchEventByTitle(searchQuery);
    if (eventsByTitle.length > 0) {
      res.json(eventsByTitle);
    } else {
      const eventsByTags = await searchEventByTags(searchQuery);
      if (eventsByTags.length > 0) {
        res.json(eventsByTags);
      } else {
        res.status(404).json({ message: "No Events Found" });
      }
    }
  }catch(error){
    res.status(500).json({error: "Failed to Fetch Events"})
  }
})
*/

async function readEventsByType(eventType) {
  try {
    const events = await Event.find({ type: eventType });
    return events;
  } catch (error) {
    throw error;
  }
}

app.get("/events/type/:type", async (req, res) => {
  try {
    const events = await readEventsByType(req.params.type);
    if (events.length != 0) {
      res.json(events);
    } else {
      res.status(404).json({ message: "No Events Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch Events" });
  }
});

async function deleteEvent(eventId) {
  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    return deletedEvent;
  } catch (error) {
    console.log("Error deleting event:", error);
  }
}

app.delete("/events/:eventId", async (req, res) => {
  try {
    const deletedEvent = await deleteEvent(req.params.eventId);
    if (deletedEvent) {
      res.status(200).json({ message: "Event Deleted Successfully" });
    } else {
      res.status(404).json({ message: "No Event Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Delete Event" });
  }
});

async function updateEvent(eventId, updatedData) {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, {
      new: true,
    });
    return updatedEvent;
  } catch (error) {
    console.log("Error updating event:", error);
  }
}

app.post("/events/:eventId", async (req, res) => {
  try {
    const updatedEvent = await updateEvent(req.params.eventId, req.body);
    if (updatedEvent) {
      res.status(200).json({ message: "Event Updated Successfully" });
    } else {
      res.status(404).json({ message: "No Event Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Update Event" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
