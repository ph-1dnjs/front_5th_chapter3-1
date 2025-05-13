import { http, HttpResponse } from 'msw';

import { Event } from '../types';
import { createEventStore } from './handlersUtils';
import { events } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.

export const createHandlers = (initialEvents: Event[] = []) => {
  const store = createEventStore(initialEvents);

  return {
    handlers: [
      // GET 요청: 현재 이벤트 상태 반환
      http.get('/api/events', () => {
        return HttpResponse.json({ events: store.get() });
      }),

      // POST 요청: 새로운 이벤트 추가
      http.post('/api/events', async ({ request }) => {
        const event = (await request.json()) as Event;
        const newEvent = { ...event, id: String(events.length + 2) };
        console.log('====================================');
        console.log(newEvent);
        console.log('====================================');
        store.create(newEvent);

        return HttpResponse.json(newEvent);
      }),

      // PUT 요청: 이벤트 수정
      http.put('/api/events/:id', async ({ request, params }) => {
        const id = params.id as string;
        const updated = (await request.json()) as Event;
        const updatedEvent = store
          .get()
          .map(
            (event): Event =>
              Number(event.id) === Number(id)
                ? ({ ...event, ...updated } as Event)
                : (event as Event)
          );
        console.log('====================================');
        console.log(updatedEvent);
        console.log('====================================');
        store.update(updatedEvent);

        return HttpResponse.json({ events: updatedEvent.find((e) => e.id === id) });
      }),

      // DELETE 요청: 이벤트 삭제
      http.delete('/api/events/:id', ({ params }) => {
        const id = params.id as string;
        const filteredEvents = events.filter((event) => Number(event.id) !== Number(id));
        store.deleteById(id);
        return HttpResponse.json(filteredEvents);
      }),
    ],
    store,
  };
};

// export const handlers = [
//   http.get('/api/events', () => {
//     return HttpResponse.json({ events: setupMockHandlerFetch() });
//   }),

//   http.post('/api/events', async ({ request }) => {
//     const event = (await request.json()) as Event;
//     const newEvent = { ...event, id: String(events.length + 1) };
//     console.log('====================================');
//     console.log(newEvent);
//     console.log('====================================');
//     setupMockHandlerAppend(newEvent);
//     return HttpResponse.json(newEvent);
//   }),

//   http.put('/api/events/:id', async ({ request, params }) => {
//     const id = params.id as string;
//     const update = (await request.json()) as Event;

//     const updatedEvent = events.map(
//       (event): Event =>
//         Number(event.id) === Number(id) ? ({ ...event, ...update } as Event) : (event as Event)
//     );
//     console.log('====================================');
//     console.log(updatedEvent);
//     console.log('====================================');
//     setupMockHandlerUpdateById(updatedEvent);
//     return HttpResponse.json(event);
//   }),

//   http.delete('/api/events/:id', ({ params }) => {
//     const id = params.id as string;
//     const filteredEvents = events.filter((event) => Number(event.id) !== Number(id));
//     setupMockHandlerDeletion(id);
//     return HttpResponse.json(filteredEvents);
//   }),
// ];
