import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Item } from '../interfaces/item';
import { MasonrySortService } from '../services/masonry-sort.service';
import { MatDialog } from '@angular/material/dialog';

import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

import { Sortable } from '@shopify/draggable';


@Component({
  selector: 'gmf-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {

  private baseTiles: Item[] = [
    { content: {}, text: '2x2', body: '2x2', blurb: '2x2', width: 2, height: 2, color: 'lightblue', column: null, row: null },
    { content: {}, text: '1x1', body: '1x1', blurb: '1x1', width: 1, height: 1, color: 'lightgreen', column: null, row: null },
    { content: {}, text: '2x1', body: '2x1', blurb: '2x1', width: 2, height: 1, color: 'lightpink', column: null, row: null },
    { content: {}, text: '1x2', body: '1x2', blurb: '1x2', width: 1, height: 2, color: '#DDBDF1', column: null, row: null },
  ];

  private stickyTiles: Item[] = [
    { id: 'stycky1', content: {}, text: 'sticky 2x2 id:1, 0% r:1', width: 2, height: 2, color: 'yellow', row: 1, stickyPercentage: 0 },
    { id: 'stycky2', content: {}, text: 'sticky 1x1 id:2, 20% r:3', width: 1, height: 1, color: 'yellow', row: 3, stickyPercentage: 20 },
    { id: 'stycky3', content: {}, text: 'sticky 1x1 id:3, 50% r:1', width: 1, height: 1, color: 'yellow', row: 1, stickyPercentage: 50 },
    { id: 'stycky4', content: {}, text: 'sticky 1x1 id:4, 100% r:1', width: 1, height: 1, color: 'yellow', row: 1, stickyPercentage: 100 },
    { id: 'stycky5', content: {}, text: 'sticky 2x1 id:5, 100% r: 4', width: 2, height: 1, color: 'yellow', row: 4, stickyPercentage: 100 },
  ];

  private giphy = [
    'https://media.giphy.com/media/bunjXCxyMQjug/giphy.gif',
    'https://media.giphy.com/media/Ut8hdTHRLlTlC/giphy.gif',
    'https://media.giphy.com/media/nWV4qMi2CV48E/giphy.gif',
    'https://media.giphy.com/media/3ohs4oBB5SKZqEDKVO/giphy.gif',
    'https://media.giphy.com/media/8Lkpj02ksidri/giphy.gif',
    'https://media.giphy.com/media/hr5rdmpEz5c6k/giphy.gif',
    'https://media.giphy.com/media/oBBnFS4zXerQs/giphy.gif'
  ];

  public tiles = [];
  public tiles2 = [];
  public tiles3 = [];
  public unsortedTiles = [];

  public _masonryWidthPixels: number;
  public masonryUnitPixels = 150;
  public masonryGutterPixels = 2;
  public _masonryColumns: number;
  public _screenRows: number;

  public map: string[];

  private GRID_QTY_ELEMENTS = 50;
  public MAX_COLS = 10;
  private newItemCounter = 0;
  public isLoaded = false;

  private draggable: any;

  constructor(private masonrySortService: MasonrySortService, public dialog: MatDialog) { }

  public get masonryColumns() {
    return Math.floor(this.masonryWidthPixels / (this.masonryUnitPixels + this.masonryGutterPixels));
  }

  public get masonryWidthPixels() {
    return document.getElementById('masonry').offsetWidth;
  }

  public get screenRows() {
    return Math.floor(window.innerHeight / (this.masonryUnitPixels + this.masonryGutterPixels));
  }


  ngOnInit() {
    // mock/fill the array with random items;
    const unsortedTiles = []; // [...this.stickyTiles];

    for (let i = 0; i < this.GRID_QTY_ELEMENTS; i++) {
      const element = this.getRandomItem(`${i + 1}`);
      const r = this.random(0, 100);
      if ( r < 50) {
        element.videoUrl = this.giphy[this.random(0, this.giphy.length - 1)];
      } else {
        element.imageUrl = `https://loremflickr.com/${element.width * 100}/${element.height * 100}/Pyeongchang`;
      }
      element.id = `gridItem${i}`;
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
    this.initDraggable();
    this.placeStickies(this.stickyTiles);
  }

  public edit(item: Item): void {
    item.width = this.masonryColumns;
    item.height = this.screenRows;
    item.column = 0;

    const elem = document.getElementById(item.id);
    /*
          window.scrollTo({
          behavior: 'smooth',
          left: 0,
          top: elem.offsetTop + elem.parentElement.offsetTop,
        });
     */
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
    console.log(item, elem, this.screenRows, elem.offsetTop, elem.clientTop, elem.scrollTop);

    /*
    let dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      item = result;
    });
     */
  }


  private placeStickies(stickyTiles: Item[]) {
    let prevStickyTile;
    const stickyTilesByPosition = stickyTiles.sort((a, b) => Math.pow(a.row, a.column) - Math.pow(b.row, b.column));

    for (const sticky of stickyTilesByPosition) {
      let rowIncrement = 0;
      const column = this.getStickyColumn(sticky);

      // const stickyElem = document.getElementById(sticky.id.toString(10)); // ViewChild?
      const stickyTile = this.unsortedTiles.find(stk => stk.id === sticky.id);

      if (stickyTile) {
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

  private initDraggable = () => {
    // shopify/draggable
    const containerSelector = '.masonary__flex';
    const containers = document.querySelectorAll(containerSelector);
    console.log('containers', containers);
    this.draggable = new Sortable(containers, {
      draggable: '.item-list__item--draggable',
      handle: '.grid-item__drag-handle',
      appendTo: containerSelector,
      mirror: {
        constrainDimensions: true,
      }
    });

    if (this.draggable) {
      this.draggable.on('sortable:start', (evt) => {
        console.log('drag:start', evt);
      });

      this.draggable.on('sortable:stop', (evt) => {
        console.log('drag:stop', evt);
      });
    }
    console.log('initDraggable', this.draggable);
  }

  private onClick(evt) {
    console.log('onClick', evt);
  }

}
