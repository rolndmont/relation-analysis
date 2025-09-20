import { Injectable, signal } from '@angular/core';
import { Pair, RelationProperties, RelationData } from '../models/relations.models';

@Injectable({
  providedIn: 'root'
})
export class RelationAnalysis {

  relationData = signal<RelationData | null>(null);
  properties = signal<RelationProperties | null>(null);
  matrix = signal<number[][] | null>(null)
  equivalenceClasses = signal<string[][]>([]);
  hasseData = signal<any>(null);
  

  parseRelation(relationText: string): Pair[] {
    const pairs: Pair[] = [];
    const cleanedText = relationText.replace(/\s/g, '');
    const pairRegex = /\(([^,]+),([^)]+)\)/g;
    let match;

    while ((match = pairRegex.exec(cleanedText)) !== null) {
      pairs.push({ x: match[1], y: match[2] });
    }

    return pairs;
  }

  calculateProperties(setA: string[], setB: string[], relation: Pair[]): RelationProperties {
    const reflexive = this.isReflexive(setA, relation);
    const symmetric = this.isSymmetric(relation);
    const antisymmetric = this.isAntisymmetric(relation);
    const transitive = this.isTransitive(relation);
    
    const equivalenceRelation = reflexive && symmetric && transitive;
    const orderRelation = reflexive && antisymmetric && transitive;
    
    return {
      reflexive,
      symmetric,
      antisymmetric,
      transitive,
      equivalenceRelation,
      orderRelation
    };
  }

  private isReflexive(set: string[], relation: Pair[]): boolean {
    for (const element of set) {
      const found = relation.some(pair => pair.x === element && pair.y === element);
      if (!found) return false;
    }
    return true;
  }

  private isSymmetric(relation: Pair[]): boolean {
    for (const pair of relation) {
      const found = relation.some(p => p.x === pair.y && p.y === pair.x);
      if (!found) return false;
    }
    return true;
  }

  private isAntisymmetric(relation: Pair[]): boolean {
    for (const pair of relation) {
      if (pair.x !== pair.y) {
        const found = relation.some(p => p.x === pair.y && p.y === pair.x);
        if (found) return false;
      }
    }
    return true;
  }

  private isTransitive(relation: Pair[]): boolean {
    for (const pair1 of relation) {
      for (const pair2 of relation) {
        if (pair1.y === pair2.x) {
          const found = relation.some(p => p.x === pair1.x && p.y === pair2.y);
          if (!found) return false;
        }
      }
    }
    return true;
  }

  generateMatrix(setA: string[], setB: string[], relation: Pair[]): number[][] {
    const matrix: number[][] = [];
    
    for (let i = 0; i < setA.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < setB.length; j++) {
        const exists = relation.some(pair => pair.x === setA[i] && pair.y === setB[j]);
        matrix[i][j] = exists ? 1 : 0;
      }
    }
    
    return matrix;
  }

  getEquivalenceClasses(setA: string[], relation: Pair[]): string[][] {
    const classes: string[][] = [];
    const processed = new Set<string>();
    
    for (const element of setA) {
      if (!processed.has(element)) {
        const eqClass: string[] = [];
        for (const other of setA) {
          const relatedForward = relation.some(p => p.x === element && p.y === other);
          const relatedBackward = relation.some(p => p.x === other && p.y === element);
          
          if (relatedForward && relatedBackward) {
            eqClass.push(other);
            processed.add(other);
          }
        }
        if (eqClass.length > 0) {
          classes.push(eqClass);
        }
      }
    }
    
    return classes;
  }

  // Para el diagrama de Hasse (simplificado)
  generateHasseDiagram(setA: string[], relation: Pair[]): any {
    // Esta es una implementación simplificada
    // En una aplicación real, necesitarías una librería de gráficos
    const nodes = setA.map(item => ({ id: item, label: item }));
    const edges = relation
      .filter(pair => pair.x !== pair.y) // Eliminar bucles
      .map(pair => ({ from: pair.x, to: pair.y }));
    
    return { nodes, edges };
  }
}