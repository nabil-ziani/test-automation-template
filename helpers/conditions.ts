import { Browser, WebComponent } from './';

export type WaitCondition = (browser: Browser) => Promise<boolean>;

export function elementIsVisible(locator: () => WebComponent): WaitCondition {
  try {
    return async () => await locator().isDisplayed();
  } catch (ex) {
    return null;
  }
}

export function elementsAreVisible(locator: () => WebComponent[]) {
  try {
    return async () => await locator()[0].isDisplayed();
  } catch (ex) {
    return null;
  }
}

export function elementIsPresent(locator: () => WebComponent): WaitCondition {
  return async () => await locator() !== undefined;
}

export function elementHasText(locator: () => WebComponent): WaitCondition {
  try {
    return async () => await locator().hasText();
  } catch (ex) {
    return null;
  }  
}