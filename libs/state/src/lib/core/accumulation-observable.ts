import {
  ConnectableObservable, isObservable,
  Observable, of,
  queueScheduler,
  Subject,
  Subscribable,
  Subscription
} from 'rxjs';
import {
  distinctUntilChanged, map,
  mergeAll,
  observeOn,
  publishReplay,
  scan,
  tap
} from 'rxjs/operators';

export function createAccumulationObservable<T extends object>(
  stateSliceOrObservable$ = new Subject<Partial<T> | Observable<Partial<T>>>(),
  stateAccumulator: (st: T, sl: Partial<T>) => T = (
    st: T,
    sl: Partial<T>
  ): T => {
    return { ...st, ...sl };
  }
): {
  state: T;
  state$: Observable<T>;
  nextSliceOrObservable: (state$: Partial<T> | Observable<Partial<T>>) => void;
} & Subscribable<T> {
  const stateSliceOrObservable =  stateSliceOrObservable$.pipe(distinctUntilChanged())
  const compositionObservable = {
    state: {},
    state$: stateSliceOrObservable.pipe(
      map(o => isObservable(o) ? o : of(o)),
      mergeAll(),
      observeOn(queueScheduler),
      scan(stateAccumulator, {} as T),
      tap(newState => (compositionObservable.state = newState)),
      publishReplay(1)
    ),
    nextSlice: nextSliceOrObservable,
    subscribe
  };

  // ======

  return compositionObservable;

  // ======

  function nextSliceOrObservable(stateSlice: Partial<T> | Observable<Partial<T>>): void {
    stateSliceOrObservable$.next(stateSlice);
  }

  function subscribe(): Subscription {
    return (compositionObservable.state$ as ConnectableObservable<T>).connect();
  }
}
