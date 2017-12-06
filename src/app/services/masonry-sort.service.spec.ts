import { TestBed, inject } from '@angular/core/testing';

import { MasonrySortService } from './masonry-sort.service';

describe('MasonrySortService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasonrySortService]
    });
  });

  it('should be created', inject([MasonrySortService], (service: MasonrySortService) => {
    expect(service).toBeTruthy();
  }));
});
