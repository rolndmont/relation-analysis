import { TestBed } from '@angular/core/testing';

import { RelationAnalysis } from './relation-analysis';

describe('RelationAnalysis', () => {
  let service: RelationAnalysis;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelationAnalysis);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
