/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-any non-null-operator no-big-function no-non-null-assertion no-implicit-dependencies


export function mapObject<T, V>(obj: { [k: string]: T },
                                mapper: (k: string, v: T) => V): { [k: string]: V } {
  return Object.keys(obj).reduce((acc: { [k: string]: V }, k: string) => {
    acc[k] = mapper(k, obj[k]);

    return acc;
  }, {});
}


const copySymbol = Symbol();

// tslint:disable-next-line:no-any
export function deepCopy<T extends any>(value: T): T {
  if (Array.isArray(value)) {
    // tslint:disable-next-line:no-any
    return value.map((o: any) => deepCopy(o)) as unknown as T;
  } else if (value && typeof value === 'object') {
    const valueCasted = value as {
      [copySymbol]?: T,
      toJSON?: () => string,
      // tslint:disable-next-line:no-any
      [key: string]: any,
    };

    if (valueCasted[copySymbol]) {
      // This is a circular dependency. Just return the cloned value.
      return valueCasted[copySymbol] as T;
    }

    if (valueCasted['toJSON']) {
      return JSON.parse(valueCasted['toJSON']());
    }

    const copy = new (Object.getPrototypeOf(valueCasted).constructor)();
    valueCasted[copySymbol] = copy;
    for (const key of Object.getOwnPropertyNames(valueCasted)) {
      copy[key] = deepCopy(valueCasted[key]);
    }
    valueCasted[copySymbol] = undefined;

    return copy;
  } else {
    return value;
  }
}
