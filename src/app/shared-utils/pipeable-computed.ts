import { Signal, isSignal } from '@angular/core';
import { fromObservable, fromSignal } from '@angular/core/rxjs-interop';
import { Observable, ObservableInput, OperatorFunction, from, isObservable } from 'rxjs';

function toPipeableArgs<TValue, TReturn = TValue>(
    source: ObservableInput<TValue> | Signal<TValue>,
    initialValueOrOperator?: TValue | OperatorFunction<TValue, TReturn>,
    operator?: OperatorFunction<TValue, TReturn>
): [Observable<TValue>, OperatorFunction<TValue, TReturn>?, TValue?] {
    if (typeof source === 'function' && isSignal(source)) {
        return [fromSignal(source), initialValueOrOperator as OperatorFunction<TValue, TReturn>, source() as TValue];
    }

    if (source instanceof Promise || ('then' in source && typeof source['then'] === 'function')) {
        if (initialValueOrOperator === undefined || typeof initialValueOrOperator === 'function')
            throw new Error(`[NGT] computed$ with Promise expects an initialValue`);

        return [from(source), operator, initialValueOrOperator as TValue];
    }

    if (isObservable(source)) {
        return [source, operator, initialValueOrOperator as TValue];
    }

    return [from(source), operator, initialValueOrOperator as TValue];
}

export function computed$<TValue, TReturn = TValue>(
    signal: Signal<TValue>,
    operator: OperatorFunction<TValue, TReturn>
): Signal<TReturn>;
export function computed$<TValue, TReturn = TValue>(
    promise: Promise<TValue>,
    initialValue: TValue,
    operator?: OperatorFunction<TValue, TReturn>
): Signal<TReturn>;
export function computed$<TValue, TReturn = TValue>(
    observable: Observable<TValue>,
    initialValue?: TValue,
    operator?: OperatorFunction<TValue, TReturn>
): Signal<TReturn>;
export function computed$<TValue, TReturn = TValue>(
    source: ObservableInput<TValue> | Signal<TValue>,
    initialValueOrOperator?: TValue | OperatorFunction<TValue, TReturn>,
    operator?: OperatorFunction<TValue, TReturn>
): Signal<TReturn> {
    const [$, op, initialValue] = toPipeableArgs(source, initialValueOrOperator, operator);

    if (!op) {
        return fromObservable($, initialValue) as Signal<TReturn>;
    }

    return fromObservable($.pipe(op), initialValue as TReturn) as Signal<TReturn>;
}
