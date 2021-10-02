import 'reflect-metadata';
import { WebElement } from 'selenium-webdriver';
import { WebComponent } from './components';

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function findElement(selector: string) {
  return (target: any, propertyKey: string) => {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    Object.defineProperty(target, propertyKey, {
      configurable: true,
      enumerable: true,
      get: function () {
        try {
          const promise = (this as any).browser.findElement(selector);
          return new type(promise, selector);
        } catch {
          throw new Error(`Unable to find element with selector ${selector}`)
        }
      },
    });
  };
}

export function findElements(selector: string, type: typeof WebComponent) {
  return (target: any, propertyKey: string) => {
    Object.defineProperty(target, propertyKey, {
      configurable: true,
      enumerable: true,
      get: async function () {
        let promiseArray: Array<any> = new Array();
        let webelementsArray: Array<WebElement> = await (this as any).browser.findElements(selector);
        webelementsArray.forEach(webelement => {
          let object = new type(webelement, selector);
          promiseArray.push(object);
        });
        let length = await webelementsArray.length;
        console.log(`Found ${length} element(s) with selector ${selector}`)
        return promiseArray;
      },
    });
  }
}