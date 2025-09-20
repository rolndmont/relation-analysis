import { Component, input } from '@angular/core';
import { RelationProperties } from '../../models/relations.models';
import { CommonModule } from '@angular/common';

type PropertyKey = keyof RelationProperties

@Component({
  selector: 'app-properties-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './properties-display.html',
  styleUrl: './properties-display.css'
})
export class PropertiesDisplay {
  properties = input.required<RelationProperties>();

  readonly propertyOrder: PropertyKey[] = [
    'reflexive',
    'symmetric',
    'antisymmetric',
    'transitive',
    'equivalenceRelation',
    'orderRelation'
  ]

  formatPropertyName(key: PropertyKey): string {
    const names: Record<PropertyKey, string> = {
      reflexive: 'Reflexiva',
      symmetric: 'Simétrica',
      antisymmetric: 'Antisimétrica',
      transitive: 'Transitiva',
      equivalenceRelation: 'Relación de Equivalencia',
      orderRelation: 'Relación de Orden'
    };
    return names[key];
  }
}
