import { Injectable } from '@angular/core';
import { Item } from '../interfaces/item';

@Injectable()
export class MasonrySortService {


  public map: string[] = [];
  public sort(arr: Item[], maxColumns): Item[] {
    this.map = [];
    console.time('sort1');
    let occupiedCells = new Set<number>();
    const freeCells: number[] = [];

    const sortedSet = new Set<Item>();

    // iterate all items
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];

      // first free
      const firstFreeCell = freeCells.shift() || 0;

      let insertCell = firstFreeCell;

      // console.log('item: ', item.text, 'start', insertCell);

      while (!this.fits(item, insertCell, occupiedCells, maxColumns)) {
        if (!occupiedCells.has(insertCell)) { freeCells.push(insertCell); }
        insertCell++;
        // console.log('++', insertCell);
      }
      occupiedCells = this.occupyCells(item, insertCell, occupiedCells, maxColumns);
      const nextCell = insertCell + item.width;
      if (!occupiedCells.has(nextCell)) {
        freeCells.push(insertCell + item.width);
      }

      // console.log('free', freeCells);
    }

    for (const cell of this.map) {
      const item = arr[parseInt(cell, 10) - 1];
      if (item) {
        sortedSet.add(item);
      }
    }
    const result = Array.from(sortedSet);
    console.timeEnd('sort1');
    // this.debugMap(maxColumns, this.map);
    return result;
  }

  public sort2(arr: Item[], maxColumns: number): Item[] {
    // iterate all items
    const sorted = [];
    let occupiedCells = new Set<number>();
    let firstEmptyIndex = 0;
    let insertCell = 0;

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];

      if (!this.fits(item, insertCell, occupiedCells, maxColumns)) {  // if it doesn't fit
        // console.log(item.text, '++');
        sorted.push(item);
      } else { // if it fits
        if (sorted[firstEmptyIndex] !== undefined) { // if it's already filled
          const endPart = sorted.splice(firstEmptyIndex);
          sorted.push(item);
          sorted.push(...endPart);
          firstEmptyIndex++;
        } else { // if it's free to insert;
          sorted[firstEmptyIndex] = item;
        }
        firstEmptyIndex++;
        insertCell += item.width;
        // console.log(item.text, firstEmptyIndex);
      }
      occupiedCells = this.occupyCells(item, insertCell, occupiedCells, maxColumns);
      // console.log(sorted.map(i => i.text));
    }
    return sorted;
  }

  public sort3(arr: Item[], maxColumns: number): Item[] {
    console.time('sort3');
    const sorted = new Set<Item>();
    let map: any[][] = [new Array(maxColumns).fill('')]; // start with an empty row;
    let cell = 0;
    const unsorted: Item[] = [...arr];

    while (unsorted.length > 0) {
      let item;
      // find a freeCell, what to do when there are no free cells?
      if (cell >= map.length * maxColumns) { // bigger than the current map cells
        // add to one more row to map
        map.push(new Array(maxColumns).fill(''));
      }
      while (!this.isCellFree(cell, map, maxColumns)) {
        cell++;
        if (cell >= map.length * maxColumns) { // bigger than the current map cells
          // add to one more row to map
          map.push(new Array(maxColumns).fill(''));
        }
      }

      // iterate unsorted once
      for (let i = 0; i < unsorted.length; i++) {
        item = unsorted[i];
        // find one item that fits
        if (this.fits3(item, cell, map, maxColumns)) {
          // find item on unsorted and take it;
          // more code but more efficient than shift/unshift that are always O(n);
          const index = unsorted.findIndex(it => it === item);
          if (index > -1) {
            unsorted.splice(index, 1);
          }
          break;
        }
      }

      if (item !== undefined) {
        // it fits, place item
        map = this.occupyCells3(item, cell, map, maxColumns);
        sorted.add(item);
        cell += item.width;
      } else {
        // did not find any, leave the cell empty
        cell++;
      }
     // this.debugMap3(maxColumns, map);
    }
    const result = Array.from(sorted);
    console.timeEnd('sort3');
    return result;

  }

  private fits3(item: Item, startCell: number, map: any[][], maxColumns: number): boolean {
    // if is on edge
    const outOfLimits = (startCell % maxColumns) + (item.width - 1) > (maxColumns - 1);

    const startCellRow = this.getRow(startCell, maxColumns);
    const startCellCol = this.getCol(startCell, maxColumns);

    // if one of the cells is occupied;
    let isEmpty = true;
    if (!outOfLimits) {
      for (let itemRow = 0; itemRow < item.height; itemRow++) {
        for (let itemCol = 0; itemCol < item.width; itemCol++) {
          const row = startCellRow + itemRow;
          const col = startCellCol + itemCol;

          // if they don't exist, initialize them
          if (map[row] === undefined) {
            map[row] = new Array(maxColumns).fill('');
          }

          // check if are free; empty string means free.
          if (map[row][col] !== '') {
            isEmpty = false;
            break;
          }
        }
      }
    }
    return !outOfLimits && isEmpty;
  }

  private fits(item: Item, startCell: number, occupiedCells: Set<number>, maxColumns: number): boolean {
    // if is on edge
    const outOfLimits = (startCell % maxColumns) + (item.width - 1) > (maxColumns - 1);

    // if one of the cells is occupied;
    let isEmpty = true;
    if (!outOfLimits) {
      const itemCells = this.getCells(item, startCell, maxColumns);
      for (const cell of itemCells) {
        if (occupiedCells.has(cell)) {
          isEmpty = false;
          break;
        }
      }
    }
    return !outOfLimits && isEmpty;
  }

  private occupyCells3(item: Item, startCell: number, map: any[][], maxColumns: number): any[][] {
    const startCellRow = this.getRow(startCell, maxColumns);
    const startCellCol = this.getCol(startCell, maxColumns);

    for (let row = startCellRow; row < startCellRow + item.height; row++) {
      for (let col = startCellCol; col < startCellCol + item.width; col++) {

        map[row][col] = item.text;
      }
    }
    return map;
  }

  private occupyCells(item: Item, startCell: number, occupiedCells: Set<number>, maxColumns: number): Set<number> {
    const itemCells = this.getCells(item, startCell, maxColumns, true);
    for (const cell of itemCells) {
      occupiedCells.add(cell);
    }
    return occupiedCells;
  }

  private isCellFree(cell: number, map: any[][], maxColumns: number): boolean {
    const row = this.getRow(cell, maxColumns);
    const col = this.getCol(cell, maxColumns);
    return map[row][col] === '';
  }

  private getCells(item: Item, startCell, maxColumns: number, o?: boolean): number[] {

    const cells = [];
    for (let row = 0; row < item.height; row++) {
      for (let column = 0; column < item.width; column++) {
        const cell = startCell + column + row * maxColumns;
        cells.push(cell);

        if (o) {
          this.map[cell] = item.text;
        }
      }
    }
    return cells;
  }

  private getRow(cell: number, maxColumns: number): number {
    return Math.floor(cell / maxColumns);
  }

  private getCol(cell: number, maxColumns: number): number {
    return cell % maxColumns;
  }

  private geFirstCellOfRow(row: number, maxColumns: number) {
    return (row * maxColumns);
  }

  private getLastCellOfRow(row: number, maxColumns: number) {
    return this.geFirstCellOfRow(row, maxColumns) + (maxColumns - 1);
  }

  private debugMap(maxColumns, map) {
    let mapStr = '|';
    for (let index = 0; index < map.length; index++) {
      let cell = this.map[index] || '';
      cell = cell.length < 2 ? ' '.repeat(2 - cell.length) + cell : cell;
      mapStr += ` ${cell}${(index + 1) % maxColumns === 0 ? ' |\n|' : ' |'}`;
    }
    console.log('map1');
    console.log(mapStr);
  }

  private debugMap3(maxColumns, map) {
    let mapStr = '|';
    for (let row = 0; row < map.length; row++) {
      for (let column = 0; column < map[0].length; column++) {
        let cell = map[row][column] || '';
        cell = cell.toString();
        cell = cell.length < 2 ? ' '.repeat(2 - cell.length) + cell : cell;
        mapStr += ` ${cell} |`;
      }
      mapStr += '\n|';
    }
    console.log('map3');
    console.log(mapStr);
  }
}
