import { Event } from '../types';

// ! Hard
// ! 이벤트는 생성, 수정 되면 fetch를 다시 해 상태를 업데이트 합니다. 이를 위한 제어가 필요할 것 같은데요. 어떻게 작성해야 테스트가 병렬로 돌아도 안정적이게 동작할까요?
// ! 아래 이름을 사용하지 않아도 되니, 독립적이게 테스트를 구동할 수 있는 방법을 찾아보세요. 그리고 이 로직을 PR에 설명해주세요.

/**
 * <개선된 코드>
 * 테스트마다 격리된 (eventStore) 상태를 사용한다.
 * => 전역 변수로 두지 말고 함수로 분리된 store 컨텍스트로 관리
 */
export const createEventStore = (initial: Event[] = []) => {
  let store = [...initial];

  return {
    get: () => store,
    create: (event: Event) => {
      store.push(event);
    },
    update: (updatedEvents: Event[]) => {
      store = [...updatedEvents];
    },
    deleteById: (id: string) => {
      store = store.filter((event) => Number(event.id) !== Number(id));
    },
    reset: (newEvents: Event[]) => {
      store = [...newEvents];
    },
  };
};

/**
 *  <기존 코드의 문제점> - 모듈 레벨의 (eventStore)전역 상태를 사용하고 있다.
 *  1. 테스트간 상태가 공유된다.
 *  2. 테스트가 병렬 실행될 때 충돌 가능성이 생긴다.
 **/
// let eventStore = [] as Event[];
// export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
//   eventStore = initEvents;
// };

// export const setupMockHandlerUpdateById = (update: Event[]) => {
//   eventStore = update;
//   console.log('====================================');
//   console.log('eventStore');
//   console.log(eventStore);
//   console.log('====================================');
// };

// export const setupMockHandlerAppend = (update: Event) => {
//   eventStore = [...eventStore, update];
// };

// export const setupMockHandlerDeletion = (id: string) => {
//   eventStore = eventStore.filter((event) => Number(event.id) !== Number(id));
// };

// export const setupMockHandlerFetch = () => eventStore;
