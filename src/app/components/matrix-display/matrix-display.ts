import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matrix-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matrix-display.html',
  styleUrl: './matrix-display.css'
})
export class MatrixDisplay {
  setA = input<string[]>([]);
  setB = input<string[]>([]);
  matrix = input<number[][]>([]);
  
  getCellValue(rowIndex: number, colIndex: number): number{
    const matrix = this.matrix();
    if(matrix && matrix.length > rowIndex && matrix[rowIndex].length > colIndex){
      return matrix[rowIndex][colIndex];
    }
    return 0;
  }

  hasData(): boolean {
    return this.matrix().length > 0 && this.setA().length > 0 && this.setB().length > 0;
  }
  
}
