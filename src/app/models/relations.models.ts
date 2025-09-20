export interface Pair {
  x: string;
  y: string;
}

export interface RelationProperties {
  reflexive: boolean;
  antireflexive: boolean;
  symmetric: boolean;
  antisymmetric: boolean;
  transitive: boolean;
  equivalenceRelation: boolean;
  orderRelation: boolean;
}

export interface RelationData {
  setA: string[];
  setB: string[];
  relationText: string;
  properties: RelationProperties;
}