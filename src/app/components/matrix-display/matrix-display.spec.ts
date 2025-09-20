import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixDisplay } from './matrix-display';

describe('MatrixDisplay', () => {
  let component: MatrixDisplay;
  let fixture: ComponentFixture<MatrixDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrixDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
