import { TestBed } from '@angular/core/testing';

import { ProjectServiceService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
