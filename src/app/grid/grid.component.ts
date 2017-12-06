import { Component, OnInit } from '@angular/core';

interface Item {
  content: any;
  text: string;
  width: number;
  height: number;
  color: string;
}

@Component({
  selector: 'gmf-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  private baseTiles: Item[] = [
    { content: {}, text: '2x2', width: 2, height: 2, color: 'lightblue' },
    { content: {}, text: '1x1', width: 1, height: 1, color: 'lightgreen' },
    { content: {}, text: '2x1', width: 2, height: 1, color: 'lightpink' },
    { content: {}, text: '1x2', width: 1, height: 2, color: '#DDBDF1' },
  ];
  private baseContent = [
    { title: '1', text: 'The first  item' },
    { title: '2', text: 'The second  item' },
    { title: '3', text: 'The third  item' },
    { title: '4', text: 'The fourth  item' },
    { title: '5', text: 'The fifth  item' },
    { title: '6', text: 'The sixth random item' },

  ];
  public tiles = [];
  public unsortedTiles = [];

  public map: string[];

  private GRID_QTY_ELEMENTS = 32;
  private MAX_SIZE_MULTI = 1;
  public MAX_COLS = 8;

  public isLoaded = false;
  constructor() { }

  ngOnInit() {

    this.map = new Array(100).fill('');

    const unsortedTiles = [];

    // mock/fill the array with random items;
    for (let i = 0; i < this.GRID_QTY_ELEMENTS; i++) {

      // const size = this.random(1, this.MAX_SIZE_MULTI);
      const index = this.random(0, this.baseTiles.length - 1);
      const contentIndex = this.random(0, this.baseContent.length - 1);

      const element = { ...this.baseTiles[index] };

      // element.cols = element.cols * size;
      // element.rows = element.rows * size;
      element.content = { title: i }; // this.baseContent[contentIndex];
      element.text = `${i + 1}`; // - ${element.cols}x${element.rows}`;

      unsortedTiles.push(element);
      //      this.tiles.push(i === bigIndex ? this.bigTile : element);
    }

    this.unsortedTiles = unsortedTiles;
    // sort in a way that mat-grid-list doesn't show empty spaces;
    this.tiles = this.sort(unsortedTiles);

    this.isLoaded = true;
  }

  private debugMap() {
    let mapStr = '|';
    for (let index = 0; index < this.map.length; index++) {
      let cell = this.map[index];
      cell = cell.length < 2 ? ' '.repeat(2 - cell.length) + cell : cell;
      mapStr += ` ${cell}${(index + 1) % this.MAX_COLS === 0 ? ' |\n|' : ' |'}`;
    }
    console.log(mapStr);

  }

  private sort(arr: Item[]): Item[] {
    const result = [];
    let occupiedCells = new Set<number>();

    let insertCell = 0;
    // iterate all items
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];

      // find first free
      let firstFreeCell = 0;
      while (occupiedCells.has(firstFreeCell)) {
        firstFreeCell++;
      }

      insertCell = firstFreeCell;

      while (
        !this.fits(item, insertCell, occupiedCells, this.MAX_COLS)
      ) {
        insertCell++;
      }
      occupiedCells = this.occupyCells(item, insertCell, occupiedCells, this.MAX_COLS);
    }

    const sortedSet = new Set<Item>();
    for (const cell of this.map) {
      const item = this.unsortedTiles[parseInt(cell, 10) - 1];
      if (item) {
        sortedSet.add(item);
      }
    }
    return Array.from(sortedSet);
  }

  private fits(item: Item, startCell: number, occupiedCells: Set<number>, maxCols: number): boolean {
    // if is on edge
    const outOfLimits = (startCell % maxCols) + (item.width - 1) > (maxCols - 1);

    // if one of the cells is occupied;
    let isEmpty = true;
    if (!outOfLimits) {
      const itemCells = this.getCells(item, startCell, maxCols);
      for (const cell of itemCells) {
        if (occupiedCells.has(cell)) {
          isEmpty = false;
          break;
        }
      }
    }
    return !outOfLimits && isEmpty;
  }

  private occupyCells(item: Item, startCell: number, occupiedCells: Set<number>, maxCols: number): Set<number> {
    const itemCells = this.getCells(item, startCell, maxCols, true);
    for (const cell of itemCells) {
      occupiedCells.add(cell);
    }
    return occupiedCells;
  }

  private getCells(item: Item, startCell, maxCols: number, o?: boolean): number[] {

    const cells = [];
    for (let row = 0; row < item.height; row++) {
      for (let column = 0; column < item.width; column++) {
        const cell = startCell + column + row * maxCols;
        cells.push(cell);

        if (o) {
          this.map[cell] = item.text;
        }
      }
    }
    return cells;
  }

  private random(min: number, max: number) {
    return min + Math.round(Math.random() * (max - min));
  }
}
