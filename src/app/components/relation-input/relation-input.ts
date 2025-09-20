import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RelationData } from '../../models/relations.models';

@Component({
  selector: 'app-relation-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './relation-input.html',
  styleUrl: './relation-input.css'
})
export class RelationInput {
  setA: string = '1,2,3,4';
  setB: string = '1,2,3,4';
  relation: string = '(1,1),(1,2),(2,1),(2,2),(3,3),(4,4)';

  analyze = output<RelationData>();

  onAnalyze() {
    const setAArray = this.setA.split(',').map(item => item.trim());
    const setBArray = this.setB.split(',').map(item => item.trim());
    
    this.analyze.emit({
      setA: setAArray,
      setB: setBArray,
      relationText: this.relation,
      properties: {} as any
    });
  }
}
