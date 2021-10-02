import { Browser, WaitCondition, webconfig } from '../helpers/index'

export interface NewablePage<T extends BasePage> {
    new(browser: Browser): T;
}

export abstract class BasePage {
  private url: string;

  public constructor(protected browser: Browser) {
    this.setUrl(webconfig.baseUrl);
  }

  private setUrl(url: string) {
    this.url = url;
  }

  public async navigate(): Promise<void> {
    await this.browser.navigate(this.url);
    await this.browser.wait(this.loadCondition());
    await this.browser.waitFor(5000);
  }

  public abstract loadCondition(): WaitCondition;
}