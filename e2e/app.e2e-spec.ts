import { AppPage } from './app.po';

describe('oppi App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display oppi header', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('oppi!');
  });
});
