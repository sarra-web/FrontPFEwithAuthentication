import { TestBed } from '@angular/core/testing';

import { ConnectorNoSQLService } from './connector-no-sql.service';

describe('ConnectorNoSQLService', () => {
  let service: ConnectorNoSQLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectorNoSQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
