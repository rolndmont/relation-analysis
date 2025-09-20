import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-equivalence-classes',
  imports: [CommonModule],
  templateUrl: './equivalence-classes.html',
  styleUrl: './equivalence-classes.css'
})
export class EquivalenceClasses {
  eqClass = input<string[][]>([]);
}
