import {step} from "mocha-steps";
import { Browser } from "../helpers/index"
import { AllPages } from '../pageObjects/index';

describe('Post Pet', function () {
    let pages: AllPages;

    before(async () => {
        pages = new AllPages(new Browser());
    });

    step('Navigate to the swagger page', async () => {
      await pages.swagger.navigate();
    });

    after(async function () {
      await pages.dispose();
    });
});