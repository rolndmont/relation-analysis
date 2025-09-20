import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelationInput } from './components/relation-input/relation-input';
import { PropertiesDisplay } from './components/properties-display/properties-display';
import { MatrixDisplay } from './components/matrix-display/matrix-display';
import { RelationData, Pair } from './models/relations.models';
import { RelationAnalysis } from './services/relation-analysis';
import { GraphDisplay } from "./components/graph-display/graph-display";
import { HasseDiagram } from "./components/hasse-diagram/hasse-diagram";
import { EquivalenceClasses } from "./components/equivalence-classes/equivalence-classes";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RelationInput, PropertiesDisplay, MatrixDisplay, GraphDisplay, HasseDiagram, EquivalenceClasses],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Propiedades de Relaciones');
  
  setA = signal<string[]>([]);
  setB = signal<string[]>([]);
  relation = signal<Pair[]>([]);
  relationText = signal<string>('');
  properties = signal<any>(null);
  matrix = signal<number[][]>([]);
  equivalenceClasses = signal<string[][]>([]);
  hasseData = signal<any>(null);

  constructor(private relationAnalysis: RelationAnalysis) {}
  onAnalyze(data: RelationData) {
    this.setA.set(data.setA);
    this.setB.set(data.setB);
    
    // Parsear la relación
    const parsedRelation = this.relationAnalysis.parseRelation(data.relationText);
    this.relation.set(parsedRelation);
    
    // Calcular propiedades
    const calculateProperties = this.relationAnalysis.calculateProperties(this.setA(), this.setB(), this.relation());
    this.properties.set(calculateProperties)
    
    // Generar matriz
    const generateMatrix = this.relationAnalysis.generateMatrix(this.setA(), this.setB(), this.relation());
    this.matrix.set(generateMatrix);
    
    // Calcular clases de equivalencia si es relación de equivalencia
    if (this.properties()?.equivalenceRelation) {
      const clases = this.relationAnalysis.getEquivalenceClasses(this.setA(), this.relation());
      this.equivalenceClasses.set(clases);
    } else {
      this.equivalenceClasses.set([]);
    }
    
    // Generar datos para diagrama de Hasse si es relación de orden
    if (this.properties()?.orderRelation) {
      const hasse = this.relationAnalysis.generateHasseDiagram(this.setA(), this.relation());
      this.hasseData.set(hasse);
    } else {
      this.hasseData.set(null);
    }
  }
}
