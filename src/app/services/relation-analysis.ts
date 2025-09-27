import { Injectable, signal } from '@angular/core';
import { Pair, RelationProperties, RelationData, HasseData } from '../models/relations.models';

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
    const antireflexive = this.isAntiReflexive(setA, relation);
    const symmetric = this.isSymmetric(relation);
    const asymemmetric = this.isAsymmetric(reflexive,relation);
    const antisymmetric = this.isAntisymmetric(relation);
    const transitive = this.isTransitive(relation);
    
    const equivalenceRelation = reflexive && symmetric && transitive;
    const orderRelation = reflexive && antisymmetric && transitive;
    
    return {
      reflexive,
      antireflexive,
      symmetric,
      asymemmetric,
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

  private isAntiReflexive(set: string[], relation: Pair[]): boolean {
    for (const element of set) {
      const found = relation.some(pair => pair.x === element && pair.y === element);
      if (found) return false;
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

  private isAsymmetric(reflexive: boolean,relation: Pair[]): boolean {
    if(reflexive) return false; // Una relacion reflexiva no puede ser asimetrica
    for (const pair of relation) {
      const found = relation.some(p => p.x === pair.y && p.y === pair.x);
      if(!found) return true;
      /* if(!found){ // Si se descomenta este codigo, entonces eliminar el parametro reflexive de la funcion
        const foundReflexive = relation.some(p => p.x === pair.x && p.y === pair.x);
        if(!foundReflexive) return true;
      } */
    }
    return false;
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
    
    // Para cada elemento en el conjunto A 
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

  // Para el diagrama de Hasse
  generateHasseDiagram(setA: string[], relation: Pair[]): HasseData {
    // Generar relaciones de Hasse
    const hasseRelations = this.calculateHasseRelations(setA,relation);
    // Calcular niveles jerárquicos
    const levels = this.calculateHierarchyLevels(setA,relation);
    const dataHasse: HasseData = { setA, hasseRelations, levels };
    return dataHasse;
  }

  public calculateHasseRelations(setA: string[],relation: Pair[]): Pair[] {
    // 1. Eliminar relaciones reflexivas (a,a)
    const irreflexive = relation.filter(pair => pair.x !== pair.y);
    
    // 2. Eliminar relaciones transitivas
    const hasseRelations: Pair[] = [];
    
    for (const pair of irreflexive) {
      let isTransitive = false;
      
      // Verificar si existe un camino más largo entre pair.x y pair.y
      for (const intermediate of setA) {
        if (intermediate !== pair.x && intermediate !== pair.y) {
          const hasFirstStep = relation.some(p => p.x === pair.x && p.y === intermediate);
          const hasSecondStep = relation.some(p => p.x === intermediate && p.y === pair.y);
          
          if (hasFirstStep && hasSecondStep) {
            isTransitive = true;
            break;
          }
        }
      }
      
      if (!isTransitive) {
        hasseRelations.push(pair);
      }
    }
    
    return hasseRelations;
  }

  //Calcular niveles jerárquicos usando BFS (para dibujar el diagrama de Hasse)
  private calculateHierarchyLevels(setA: string[], relation: Pair[]): { [level: number]: string[] } {
    const levels: { [level: number]: string[] } = {};
    const inDegree: { [node: string]: number } = {};
    
    // Inicializar grados de entrada
    setA.forEach(node => {
      inDegree[node] = 0;
    });
    
    // Calcular grados de entrada (cuántos elementos son menores que cada nodo)
    relation.forEach(pair => {
      if (pair.x !== pair.y) { // Ignorar bucles
        inDegree[pair.y]++;
      }
    });
    
    // Asignar niveles usando BFS
    const queue: string[] = []; // Cola para nodos con grado de entrada 0
    const levelMap: { [node: string]: number } = {}; // Mapa de niveles
    
    // Encontrar elementos minimales (grado de entrada = 0)
    setA.forEach(node => {
      if (inDegree[node] === 0) {
        queue.push(node);
        levelMap[node] = 0;
      }
    });
    
    // Procesar la cola
    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      const currentLevel = levelMap[currentNode];
      
      // Agregar a levels
      if (!levels[currentLevel]) {
        levels[currentLevel] = [];
      }
      levels[currentLevel].push(currentNode);
      
      // Encontrar sucesores
      const successors = relation
        .filter(pair => pair.x === currentNode && pair.x !== pair.y)
        .map(pair => pair.y);
      
      // Procesar sucesores
      successors.forEach(successor => {
        inDegree[successor]--;
        if (inDegree[successor] === 0) {
          queue.push(successor);
          levelMap[successor] = currentLevel + 1;
        }
      });
    }
    
    return levels;
  }

}