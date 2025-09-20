import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquivalenceClasses } from './equivalence-classes';

describe('EquivalenceClasses', () => {
  let component: EquivalenceClasses;
  let fixture: ComponentFixture<EquivalenceClasses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquivalenceClasses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquivalenceClasses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
