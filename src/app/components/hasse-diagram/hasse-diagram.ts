import { Component, input, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { Pair } from '../../models/relations.models';

@Component({
  selector: 'app-hasse-diagram',
  standalone: true,
  templateUrl: './hasse-diagram.html',
  styleUrl: './hasse-diagram.css'
})
export class HasseDiagram implements AfterViewInit, OnChanges {
  setA = input<string[]>([]);
  relation = input<Pair[]>([]);
  
  private svg: any;
  private width: number = 800;
  private height: number = 600;
  private margin = { top: 50, right: 50, bottom: 50, left: 50 };
  
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.initSVG();
    this.renderHasseDiagram();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['relation'] && this.svg) {
      this.renderHasseDiagram();
    }
  }

  private initSVG() {
    const container = this.elementRef.nativeElement.querySelector('#hasse-container');
    this.width = container.clientWidth - this.margin.left - this.margin.right;
    this.height = container.clientHeight - this.margin.top - this.margin.bottom;

    // Limpiar contenedor existente
    d3.select(container).selectAll('*').remove();

    // Crear SVG
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private renderHasseDiagram() {
    const relation = this.relation();
    const setA = this.setA();
    
    if (!relation.length || !setA.length) {
      return;
    }

    // Filtrar la relación para el diagrama de Hasse (eliminar reflexivos y transitivos)
    const hasseRelations = this.calculateHasseRelations(relation);

    // Calcular niveles jerárquicos
    const levels = this.calculateHierarchyLevels();
    const nodePositions = this.calculateNodePositions(levels);

    // Limpiar SVG existente
    this.svg.selectAll('*').remove();

    // Dibujar enlaces (líneas)
    const link = this.svg.selectAll('.link')
      .data(hasseRelations)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', (d: any) => nodePositions[d.x].x)
      .attr('y1', (d: any) => nodePositions[d.x].y)
      .attr('x2', (d: any) => nodePositions[d.y].x)
      .attr('y2', (d: any) => nodePositions[d.y].y)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    // Dibujar nodos
    const node = this.svg.selectAll('.node')
      .data(setA)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: string) => `translate(${nodePositions[d].x},${nodePositions[d].y})`);

    // Agregar círculos a los nodos
    node.append('circle')
      .attr('r', 10)
      .attr('fill', '#3f51b5')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Agregar etiquetas a los nodos
    node.append('text')
      .text((d: string) => d)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'black')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');

  }

  public calculateHasseRelations(relation: Pair[]): Pair[] {
    // 1. Eliminar relaciones reflexivas (a,a)
    const irreflexive = relation.filter(pair => pair.x !== pair.y);
    
    // 2. Eliminar relaciones transitivas
    const hasseRelations: Pair[] = [];
    
    for (const pair of irreflexive) {
      let isTransitive = false;
      
      // Verificar si existe un camino más largo entre pair.x y pair.y
      for (const intermediate of this.setA()) {
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

  private calculateHierarchyLevels(): { [level: number]: string[] } {
    const levels: { [level: number]: string[] } = {};
    const inDegree: { [node: string]: number } = {};
    
    // Inicializar grados de entrada
    this.setA().forEach(node => {
      inDegree[node] = 0;
    });
    
    // Calcular grados de entrada (cuántos elementos son menores que cada nodo)
    this.relation().forEach(pair => {
      if (pair.x !== pair.y) { // Ignorar bucles
        inDegree[pair.y]++;
      }
    });
    
    // Asignar niveles usando BFS
    const queue: string[] = []; // Cola para nodos con grado de entrada 0
    const levelMap: { [node: string]: number } = {};
    
    // Encontrar elementos minimales (grado de entrada = 0)
    this.setA().forEach(node => {
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
      const successors = this.relation()
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

  private calculateNodePositions(levels: { [level: number]: string[] }): { [node: string]: { x: number, y: number } } {
    const positions: { [node: string]: { x: number, y: number } } = {};
    const levelCount = Object.keys(levels).length;
    
    // Calcular posición Y (de abajo hacia arriba)
    const levelHeight = this.height / Math.max(1, levelCount - 1);
    
    // Para cada nivel
    Object.keys(levels).forEach(levelKey => {
      const level = parseInt(levelKey);
      const nodesInLevel = levels[level];
      const nodeCount = nodesInLevel.length;
      
      // Calcular posición X (distribuir horizontalmente)
      const levelWidth = this.width / Math.max(1, nodeCount + 1);
      
      // Para cada nodo en el nivel
      nodesInLevel.forEach((node, index) => {
        positions[node] = {
          x: levelWidth * (index + 1),
          y: this.height - (level * levelHeight) // De abajo hacia arriba
        };
      });
    });
    
    return positions;
  }
}