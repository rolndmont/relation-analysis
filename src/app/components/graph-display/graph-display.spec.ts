import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphDisplay } from './graph-display';

describe('GraphDisplay', () => {
  let component: GraphDisplay;
  let fixture: ComponentFixture<GraphDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
