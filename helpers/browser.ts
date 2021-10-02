import { Builder, ThenableWebDriver, WebElement, By, WebElementPromise, } from 'selenium-webdriver';
import { WaitCondition } from './conditions';
import { webconfig } from "./webconfig";

export class Browser {
  private driver: ThenableWebDriver;

  public constructor(private browserName: string = webconfig.defaultBrowser) {
    this.driver = new Builder().forBrowser(this.browserName).build();
    this.driver.manage().window().maximize();
  }

  public async navigate(url: string): Promise<void> {
    await this.driver.navigate().to(url);
  }

  public findElement(selector: string): WebElementPromise {
    return this.driver.findElement(By.css(selector));
  }

  public findElements(selector: string): Promise<Array<WebElement>> {
    return this.driver.findElements(By.css(selector));
  }

  public async clearCookies(url?: string): Promise<void> {
    if (url) {
      const currentUrl = await this.driver.getCurrentUrl();
      await this.navigate(url);
      await this.driver.manage().deleteAllCookies();
      await this.navigate(currentUrl);
    } else {
      await this.driver.manage().deleteAllCookies();
    }
  }

  public async wait(condition: WaitCondition) {
    await this.waitAny(condition);
  }

  public async waitAny(conditions: WaitCondition | WaitCondition[]): Promise<void> {
    const all = (!(conditions instanceof Array)) ? [conditions] : conditions;
    try {
      await this.driver.wait(async () => {
        for (const condition of all) {
          try {
            if (await condition(this) === true) {
              return true;
            }
            continue;
          } catch (ex) {
            continue;
          }
        }
        return false;
      }, webconfig.defaultTimeout);
    } catch (ex) {
      throw new Error("Wait timed out for " + conditions);
    }
  }

  public async waitFor(milliseconds: number) {
    await this.driver.sleep(milliseconds);
  }

  public async close(): Promise<void> {
    await this.driver.close();
  }
}