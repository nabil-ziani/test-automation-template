import { WaitCondition, Browser, elementIsVisible, findElement, WebComponent } from '../helpers/index';
import { BasePage } from "./basePage";

export class SwaggerPage extends BasePage {
  // ELEMENTS
  @findElement('.title')
  public title: WebComponent;

  constructor(browser: Browser) {
    super(browser);
  }
  
  // METHODS
  public loadCondition(): WaitCondition {
    return elementIsVisible(() => this.title);
  }
}