import { Component, input, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { Pair } from '../../models/relations.models';

@Component({
  selector: 'app-graph-display',
  standalone: true,
  templateUrl: './graph-display.html',
  styleUrl: './graph-display.css'
})
export class GraphDisplay implements AfterViewInit, OnChanges {
  setA = input<string[]>([]);
  setB = input<string[]>([]);
  relation = input<Pair[]>([]);
  
  private svg: any;
  private width: number = 800;
  private height: number = 600;
  private margin = { top: 50, right: 50, bottom: 50, left: 50 };
  
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.initSVG();
    this.renderGraph();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['relation'] && this.svg) {
      this.renderGraph();
    }
  }

  private initSVG() {
    const container = this.elementRef.nativeElement.querySelector('#graph-container');
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

  private renderGraph() {
    const relation = this.relation();
    const setA = this.setA();
    const setB = this.setB();
    
    if (!relation.length || !setA.length || !setB.length) {
      return;
    }

    // Crear nodos (combinar elementos de ambos conjuntos)
    const allElements = [...new Set([...setA, ...setB])];
    const nodePositions = this.calculateNodePositions(allElements);

    // Separar relaciones reflexivas y no reflexivas
    const reflexiveRelations = relation.filter(pair => pair.x === pair.y);
    const nonReflexiveRelations = relation.filter(pair => pair.x !== pair.y);

    // Limpiar SVG existente
    this.svg.selectAll('*').remove();

    // Dibujar enlaces no reflexivos (líneas con flechas)
    const nonReflexiveLink = this.svg.selectAll('.non-reflexive-link')
      .data(nonReflexiveRelations)
      .enter()
      .append('line')
      .attr('class', 'non-reflexive-link')
      .attr('x1', (d: any) => nodePositions[d.x].x)
      .attr('y1', (d: any) => nodePositions[d.x].y)
      .attr('x2', (d: any) => nodePositions[d.y].x)
      .attr('y2', (d: any) => nodePositions[d.y].y)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    // Dibujar nodos
    const node = this.svg.selectAll('.node')
      .data(allElements)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: string) => `translate(${nodePositions[d].x},${nodePositions[d].y})`);

    // Agregar círculos a los nodos
    node.append('circle')
      .attr('r', 20)
      .attr('fill', '#3f51b5')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node.filter((d: string) => reflexiveRelations.some(pair => pair.x === d))
      .append('circle')
      .attr('r', 8)
      .attr('cx', 0)
      .attr('cy', -28)
      .attr('fill', 'black')
      .attr('stroke', '#c00c0cff')
      .attr('stroke-width', 2);

    // Agregar etiquetas a los nodos
    node.append('text')
      .text((d: string) => d)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'black')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');

    // Agregar flechas a los enlaces no reflexivos
    this.svg.append('defs').selectAll('marker')
      .data(['arrow'])
      .enter()
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#333');

    nonReflexiveLink.attr('marker-end', 'url(#arrow)');

  }

  private calculateNodePositions(elements: string[]): { [key: string]: { x: number, y: number } } {
    const positions: { [key: string]: { x: number, y: number } } = {};
    const elementCount = elements.length;
    
    // Organizar nodos en un círculo
    const radius = Math.min(this.width, this.height) / 2 - 80; // Más espacio para los bucles
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const angle = (2 * Math.PI) / elementCount;
    
    elements.forEach((element, index) => {
      positions[element] = {
        x: centerX + radius * Math.cos(index * angle),
        y: centerY + radius * Math.sin(index * angle)
      };
    });
    
    return positions;
  }

}