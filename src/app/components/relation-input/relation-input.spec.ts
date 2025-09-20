import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationInput } from './relation-input';

describe('RelationInput', () => {
  let component: RelationInput;
  let fixture: ComponentFixture<RelationInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelationInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelationInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
