import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesDisplay } from './properties-display';

describe('PropertiesDisplay', () => {
  let component: PropertiesDisplay;
  let fixture: ComponentFixture<PropertiesDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
