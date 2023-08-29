import { TestBed } from '@angular/core/testing';

import { XmlConnectorService } from './xml-connector.service';

describe('XmlConnectorService', () => {
  let service: XmlConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XmlConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
