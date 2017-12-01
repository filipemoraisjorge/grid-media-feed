import { GridMediaFeedPage } from './app.po';

describe('grid-media-feed App', function() {
  let page: GridMediaFeedPage;

  beforeEach(() => {
    page = new GridMediaFeedPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
