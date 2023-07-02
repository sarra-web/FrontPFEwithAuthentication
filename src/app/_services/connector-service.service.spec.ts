import { TestBed } from '@angular/core/testing';

import { ConnectorServiceService } from './connector-service.service';

describe('ConnectorServiceService', () => {
  let service: ConnectorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

export { ConnectorServiceService };
