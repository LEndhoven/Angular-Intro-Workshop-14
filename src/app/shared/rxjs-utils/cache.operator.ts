import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';

/**
 * Operator for caching the last emitted next event and which multicasts all events from the source observable, thereby making sure it only
 * receives a single subscriber.
 *
 * This operator is shorthand for `publishReplay(1), refCount()`.
 */
export function cache<T>(): MonoTypeOperatorFunction<T> {
  // RxJS 7 upgrade path: replace pipe contents with `share({ connector: () => new ReplaySubject(1), resetOnRefCountZero: true })`.
  return (input$: Observable<T>) => input$.pipe(publishReplay(1), refCount());
}
