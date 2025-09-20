import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HasseDiagram } from './hasse-diagram';

describe('HasseDiagram', () => {
  let component: HasseDiagram;
  let fixture: ComponentFixture<HasseDiagram>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HasseDiagram]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HasseDiagram);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
