import { Browser } from '../helpers/index';
import { SwaggerPage } from './swaggerPage';

export {
  SwaggerPage
};

export class AllPages {
  public swagger: SwaggerPage;

  constructor(private browser: Browser) {
    this.swagger = new SwaggerPage(this.browser);
    
  }

  public async dispose(): Promise<void> {
    await this.browser.close();
  }
}