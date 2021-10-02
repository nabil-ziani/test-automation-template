import { WebElementPromise, WebElement, By } from 'selenium-webdriver';
import { promiseWithTimeout } from './promiseHelper';

type WebComponents = WebComponent | TextInput | Button | Dropdown | Checkbox | Form | Multibox;
export class WebComponent {

  constructor(protected element, public selector: string) { }

  public async click() {
    try {
      let elementToBeClicked = await this.element.click();
      return elementToBeClicked;
    } catch (clickErr) {
      try {
        await this.element.getDriver().executeScript('arguments[0].click();', this.element);
      } catch (jsErr) {
        throw clickErr;
      }
    }
  }

  public async isDisplayed() {
    return promiseWithTimeout(this.element.isDisplayed()).promiseOrTimeout;
  }

  public async hasText() {
    let text: string = await this.element.getText();
    return promiseWithTimeout(text !== "").promiseOrTimeout;
  }

  public async getButton(): Promise<string> {
    try {
      let button = await this.element.getButton();
      return this.element.getText();
    } catch {
      throw new Error("button was not found")
    }
  }

  public async getText(): Promise<string> {
    try {
      let text = await this.element.getText();
      return this.element.getText();
    } catch {
      throw new Error("could not retrieve text")
    }
  }

  public async findChild(selector: string, type: typeof WebComponent): Promise<WebComponents> {
    return new Promise(async (resolve) => {
      try {
        let child = await this.element.findElement(By.css(selector));
        let childComponent = new type(child, selector);
        resolve(childComponent);
      } catch {
        throw new Error(`No child element of ${this.selector} found with selector ${selector}`)
      }
    });
  }

  public async findChildren(selector: string, type: typeof WebComponent): Promise<WebComponent[]> {
    return new Promise(async (resolve) => {
      let children = await this.element.findElements(By.css(selector));
      let childrenArray = new Array();
      children.forEach(child => {
        let object = new type(child, selector);
        childrenArray.push(object);
      });
      let length = await childrenArray.length;
      resolve(childrenArray);
    });
  }

  public async getAttribute(attribute: string): Promise<string> {
    try {
      let attributeFromElement = await this.element.getAttribute(attribute);
      return attributeFromElement;
    } catch {
      throw new Error(`Unable to get a value for attribute ${attribute} of element with selector ${this.selector}`)
    }
  }
}

export class Button extends WebComponent {
  constructor(element: WebElementPromise | WebElement, selector: string) {
    super(element, selector);
  }
  public async getAttribute(attribute: string): Promise<string> {
    try {
      let attributeFromElement = await this.element.getAttribute(attribute);
      return attributeFromElement;
    } catch {
      throw new Error(`Unable to get a value for attribute ${attribute} of element with selector ${this.selector}`)
    }
  }
}

class TextField extends WebComponent {
  constructor(element: WebElementPromise | WebElement, selector: string, private type: string) {
    super(element, selector);
  }

  public async sendText(text: string) {
    try {
      let sendKeys = await this.element.sendKeys(text);
      return sendKeys;
    } catch {
      throw new Error(`Unable to send text to ${this.type} with selector ${this.selector}`)
    }
  }
}

export class Multibox extends TextField {
  constructor(element: WebElementPromise | WebElement, selector: string) {
    super(element, selector, "multibox");
  }
}

export class TextInput extends TextField {
  constructor(element: WebElementPromise | WebElement, selector: string) {
    super(element, selector, "text input");
  }
}

class MultiSelect extends WebComponent {
  constructor(element: WebElementPromise | WebElement, selector: string, private type: string) {
    super(element, selector);
  }

  public async selectByValue(value: string) {
    try {
      let selectByValue = await this.element.selectByValue(value);
      return selectByValue;
    } catch {
      throw new Error(`Unable to select option with value ${value} of ${this.type} with selector ${this.selector}`)
    }
  }

  public async deselectByValue(value: string) {
    try {
      let deselectByValue = await this.element.deselectByValue(value);
      return deselectByValue;
    } catch {
      throw new Error(`Unable to deselect option with value ${value} of ${this.type} with selector ${this.selector}`)
    }
  }

  public async selectAll() {
    try {
      let selectAll = await this.element.selectAll();
      return selectAll;
    } catch {
      throw new Error(`Unable to select all option of ${this.type} with selector ${this.selector}`)
    }
  }

  public async deselectAll() {
    try {
      let deselectAll = await this.element.deselectAll();
      return deselectAll;
    } catch {
      throw new Error(`Unable to deselect all option of ${this.type} with selector ${this.selector}`)
    }
  }
}

export class Dropdown extends MultiSelect {
  constructor(element: WebElementPromise | WebElement, selector: string) {
    super(element, selector, "dropdown");
  }

  public async selectByIndex(index: number) {
    try {
      let selectByIndex = await this.element.selectByIndex(index);
      return selectByIndex;
    } catch {
      throw new Error(`Unable to select option ${index} of dropdown with selector ${this.selector}`)
    }
  }

  public async deselectByIndex(index: number) {
    try {
      let deselectByIndex = await this.element.deselectByIndex(index);
      return deselectByIndex;
    } catch {
      throw new Error(`Unable to deselect option ${index} of dropdown with selector ${this.selector}`)
    }
  }
}

export class Combobox extends MultiSelect {
  constructor(element: WebElementPromise | WebElement, selector: string) {
    super(element, selector, "combobox");
  }
}

export class Checkbox extends WebComponent {
  constructor(element: WebElementPromise | WebElement, selector: string) {
    super(element, selector);
  }

  public async selectByValue(value: string) {
    try {
      let selectByValue = await this.element.selectByValue(value);
      return selectByValue;
    } catch {
      throw new Error(`Unable to select option with value ${value} of checkbox with selector ${this.selector}`)
    }
  }
}

export class Form extends WebComponent {
  constructor(element: WebElementPromise | WebElement, selector: string) {
    super(element, selector);
  }

  public async submit() {
    try {
      let submit = await this.element.submit();
      return submit;
    } catch {
      throw new Error(`Unable to submit for with selector ${this.selector}`)
    }
  }
}