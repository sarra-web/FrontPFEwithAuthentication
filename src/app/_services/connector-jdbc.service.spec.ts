import { TestBed } from '@angular/core/testing';

import { ConnectorJDBCService } from './connector-jdbc.service';

describe('ConnectorJDBCService', () => {
  let service: ConnectorJDBCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectorJDBCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
