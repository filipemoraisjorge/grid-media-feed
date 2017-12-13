import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit, HostListener } from '@angular/core';
import { Item } from '../interfaces/item';
import { MasonrySortService } from '../services/masonry-sort.service';
import { MatDialog } from '@angular/material/dialog';

import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

@Component({
  selector: 'gmf-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {

  private baseTiles: Item[] = [
    { content: {}, text: '2x2', width: 2, height: 2, color: 'lightblue', column: null, row: null },
    { content: {}, text: '1x1', width: 1, height: 1, color: 'lightgreen', column: null, row: null },
    { content: {}, text: '2x1', width: 2, height: 1, color: 'lightpink', column: null, row: null },
    { content: {}, text: '1x2', width: 1, height: 2, color: '#DDBDF1', column: null, row: null },
  ];

  private stickyTiles: Item[] = [
    { id: 1, content: {}, text: 'sticky 2x2 id:1, 0% r:1', width: 2, height: 2, color: 'yellow', row: 1, stickyPercentage: 0 },
    { id: 2, content: {}, text: 'sticky 1x1 id:2, 20% r:3', width: 1, height: 1, color: 'yellow', row: 3, stickyPercentage: 20 },
    { id: 3, content: {}, text: 'sticky 1x1 id:3, 50% r:1', width: 1, height: 1, color: 'yellow', row: 1, stickyPercentage: 55 },
    { id: 4, content: {}, text: 'sticky 1x1 id:4, 100% r:1', width: 1, height: 1, color: 'yellow', row: 1, stickyPercentage: 100 },
    { id: 5, content: {}, text: 'sticky 2x1 id:5, 100% r: 4', width: 2, height: 1, color: 'yellow', row: 3, stickyPercentage: 100 },


  ];

  public tiles = [];
  public tiles2 = [];
  public tiles3 = [];
  public unsortedTiles = [];

  public _masonryWidthPixels: number;
  public masonryUnitPixels = 160;
  public masonryGridTemplateColumns = `repeat(auto-fill, minmax(${this.masonryUnitPixels}px, 1fr))`;
  public masonryGutterPixels = 3;
  public _masonryColumns: number;

  public map: string[];

  private GRID_QTY_ELEMENTS = 100;
  public MAX_COLS = 8;
  private newItemCounter = 0;
  public isLoaded = false;
  constructor(private masonrySortService: MasonrySortService, public dialog: MatDialog) { }




  public get masonryColumns() {
    return Math.floor(this.masonryWidthPixels / (this.masonryUnitPixels + this.masonryGutterPixels));
  }

  public get masonryWidthPixels() {
    return document.getElementById('masonry').offsetWidth;
  }

  ngOnInit() {
    // mock/fill the array with random items;
    const unsortedTiles = [...this.stickyTiles];

    for (let i = 0; i < this.GRID_QTY_ELEMENTS; i++) {
      const element = this.getRandomItem(`${i + 1}`);
      unsortedTiles.push(element);
    }
    this.unsortedTiles = unsortedTiles;
    // sort in a way that mat-grid-list doesn't show empty spaces;
    // this.tiles3 = this.masonrySortService.sort3(unsortedTiles, this.MAX_COLS);
    this.isLoaded = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.placeStickies(this.stickyTiles);
  }

  ngAfterViewInit() {
    this.placeStickies(this.stickyTiles);
  }

  public edit(item: Item): void {
    let dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      item = result;
    });
  }


  private placeStickies(stickyTiles: Item[]) {
    let prevStickyTile;

    const stickyTilesById = stickyTiles.sort((a, b) => Math.pow(a.row, a.column) - Math.pow(b.row, b.column));

    for (const sticky of stickyTilesById) {
      let rowIncrement = 0;
      const column = this.getStickyColumn(sticky);

      // const stickyElem = document.getElementById(sticky.id.toString(10)); // ViewChild?
      const stickyTile = this.unsortedTiles.find(stk => stk.id === sticky.id);

      if (prevStickyTile && this.isColliding(prevStickyTile, stickyTile)) {
        rowIncrement += prevStickyTile.height;
      }

      stickyTile.column = column;
      stickyTile.row += rowIncrement;
      // stickyElem.style.gridColumnStart = column;
      // stickyElem.style.gridRowStart = sticky.row + rowIncrement;
      prevStickyTile = stickyTile;
    }
  }

  private isColliding(itemOne: Item, itemTwo: Item): boolean {
    const OneStartCol = itemOne.column;
    const TwoStartCol = itemTwo.column;
    const OneEndCol = itemOne.column + itemOne.width - 1;
    const TwoEndCol = itemTwo.column + itemTwo.width - 1;

    const OneStartRow = itemOne.row;
    const TwoStartRow = itemTwo.row;
    const OneEndRow = itemOne.row + itemOne.height - 1;
    const TwoEndRow = itemTwo.row + itemTwo.height - 1;

    return Math.max(OneStartCol, TwoStartCol) === Math.min(OneEndCol, TwoEndCol) &&
      Math.max(OneStartRow, TwoStartRow) === Math.min(OneEndRow, TwoEndRow);
  }

  private getStickyColumn(sticky: Item): number {
    let percentage = sticky.stickyPercentage;
    percentage = Math.max(percentage, 1);
    percentage = Math.min(percentage, 99);
    const baseCol = (Math.ceil((percentage) * this.masonryColumns / 100));
    return Math.min(baseCol, Math.min(baseCol + sticky.width, this.masonryColumns - (sticky.width - 1)));
  }

  private random(min: number, max: number) {
    return min + Math.round(Math.random() * (max - min));
  }

  public addItem() {

    const element = this.getRandomItem('n' + (this.newItemCounter++));
    this.unsortedTiles.unshift(element);

    // const unsrt = [...this.unsortedTiles];
    // this.tiles = this.masonrySortService.sort(unsrt, this.MAX_COLS);
    // this.tiles3 = this.masonrySortService.sort3(unsrt, this.MAX_COLS);
  }

  public addRandomShape() {
    const width = this.random(1, 4);
    const height = this.random(1, 4);
    const element = { content: {}, text: `${width}x${height}`, width, height, color: '#CCEEDD' };
    this.unsortedTiles.unshift(element);
  }

  private getRandomItem(label: string): Item {
    const index = this.random(0, this.baseTiles.length - 1);
    const item = { ...this.baseTiles[index] };
    item.text = label;
    return item;
  }
}
