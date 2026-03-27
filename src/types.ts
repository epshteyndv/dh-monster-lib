export interface Monster {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface Catalog {
  monsters: Monster[];
}
