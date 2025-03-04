import { useState } from "react";
import {
  addMonths,
  addYears,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import { Task } from "../../types";
import { EventCard } from "./event-card";
import { Toolbar } from "./toolbar";
import { CalendarNavigateAction } from "./types";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DataCalendarProps {
  data: Task[];
}

export const DataCalendar = ({ data }: DataCalendarProps) => {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const events = data.map((task) => ({
    id: task.$id,
    title: task.name,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    project: task.project,
    assignee: task.assignee,
    status: task.status,
  }));

  const navigate = (action: CalendarNavigateAction) => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={addYears(new Date(), 1)}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
          />
        ),
        toolbar: () => <Toolbar date={value} navigate={navigate} />,
      }}
    />
  );
};
