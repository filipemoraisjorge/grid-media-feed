import { Injectable } from '@angular/core';
import { Item } from '../interfaces/item';

@Injectable()
export class MasonrySortService {
  public maxColumns: number;

  public map: string[] = [];

  public sort(arr: Item[]): Item[] {
    const result = [];
    let occupiedCells = new Set<number>();
    const sortedSet = new Set<Item>();

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

      while (!this.fits(item, insertCell, occupiedCells, this.maxColumns)) {
        insertCell++;
      }

      occupiedCells = this.occupyCells(item, insertCell, occupiedCells, this.maxColumns);
      this.debugMap();
    }

    for (const cell of this.map) {
      const item = arr[parseInt(cell, 10) - 1];
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
    const itemCells = this.getCells(item, startCell, maxCols, HTMLOptGroupElement);
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

  private debugMap() {
    let mapStr = '|';
    for (let index = 0; index < this.map.length; index++) {
      let cell = this.map[index] || '';
      cell = cell.length < 2 ? ' '.repeat(2 - cell.length) + cell : cell;
      mapStr += ` ${cell}${(index + 1) % this.maxColumns === 0 ? ' |\n|' : ' |'}`;
    }
    console.log(mapStr);
  }


}
