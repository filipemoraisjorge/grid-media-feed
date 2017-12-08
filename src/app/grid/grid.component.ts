import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit, HostListener } from '@angular/core';
import { Item } from '../interfaces/item';
import { MasonrySortService } from '../services/masonry-sort.service';

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
    { id: 3, content: {}, text: 'sticky 1x1 id:3, 50% r:1', width: 1, height: 1, color: 'yellow', row: 1, stickyPercentage: 50 },
    { id: 4, content: {}, text: 'sticky 1x1 id:4, 100% r:1', width: 1, height: 1, color: 'yellow', row: 1, stickyPercentage: 100 },
    { id: 5, content: {}, text: 'sticky 2x1 id:5, 100% r: 4', width: 2, height: 1, color: 'yellow', row: 3, stickyPercentage: 100 },


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
  public tiles2 = [];
  public tiles3 = [];
  public unsortedTiles = [];

  public _masonryWidthPixels: number;
  public masonryUnitPixels = 150;
  public masonryGridTemplateColumns = `repeat(auto-fill, minmax(${this.masonryUnitPixels}px, 1fr))`;
  public masonryGutterPixels = 3;
  public _masonryColumns: number;

  public map: string[];

  private GRID_QTY_ELEMENTS = 48;
  public MAX_COLS = 8;
  private newItemCounter = 0;
  public isLoaded = false;
  constructor(private masonrySortService: MasonrySortService) { }


  @HostListener('window:resize', ['$event'])

  onResize(event) {
    this.placeStickies(this.stickyTiles);
  }

  ngAfterViewInit() {
    // console.log(100 / this.masonryColumns);
    // for (let i = 0; i <= 100; i++) {
    //   console.log(i, this.getStickyColumn(i));
    // }
    this.placeStickies(this.stickyTiles);

  }

  public get masonryColumns() {
    return Math.floor(this.masonryWidthPixels / (this.masonryUnitPixels + this.masonryGutterPixels));
  }

  public get masonryWidthPixels() {
    return document.getElementById('masonry').offsetWidth;
  }

  private placeStickies(stickyTiles: Item[]) {
    for (const sticky of this.stickyTiles) {
      const stickyElem = document.getElementById(sticky.id.toString(10)); // ViewChild?
      const c = this.getStickyColumn(sticky);
      stickyElem.style.gridColumnStart = c;
    }
  }

  private getStickyColumn(sticky: Item): number {
    let percentage = sticky.stickyPercentage;
    percentage = Math.max(percentage, 1);
    percentage = Math.min(percentage, 99);
    const baseCol = (Math.ceil((percentage) * this.masonryColumns / 100));
    return Math.min(baseCol, Math.min(baseCol + sticky.width, this.masonryColumns - (sticky.width - 1)));
  }


  ngOnInit() {
    // mock/fill the array with random items;
    let unsortedTiles = [...this.stickyTiles];

    for (let i = 0; i < this.GRID_QTY_ELEMENTS; i++) {
      //  const contentIndex = this.random(0, this.baseContent.length - 1);
      const element = this.getRandomItem(`${i + 1}`);
      unsortedTiles.push(element);
    }

    // unsortedTiles = [
    //   { ...this.baseTiles[0] },
    //   { ...this.baseTiles[2] },
    //   { ...this.baseTiles[2] },
    //   { ...this.baseTiles[1] },
    //   { ...this.baseTiles[3] },
    //   { ...this.baseTiles[0] },
    //   { ...this.baseTiles[0] },
    //   { ...this.baseTiles[1] },
    // ];
    // unsortedTiles.map((item, i) => {
    //   item.text = `${i + 1}`;
    //   return item;
    // });

    this.unsortedTiles = unsortedTiles;
    // sort in a way that mat-grid-list doesn't show empty spaces;

    this.tiles3 = this.masonrySortService.sort3(unsortedTiles, this.MAX_COLS);


    // console.time('sort2');
    // this.tiles2 = this.masonrySortService.sort2(unsortedTiles, this.MAX_COLS);
    // console.timeEnd('sort2');

    // this.tiles = this.masonrySortService.sort(unsortedTiles, this.MAX_COLS);

    // console.log('unsort', this.unsortedTiles.map(item => item.text));
    // console.log('tiles ', this.tiles.map(item => item.text));
    // console.log('tiles2', this.tiles2.map(item => item.text));

    this.isLoaded = true;
  }


  private random(min: number, max: number) {
    return min + Math.round(Math.random() * (max - min));
  }

  public addItem() {
    const element = this.getRandomItem('n' + (this.newItemCounter++));
    this.unsortedTiles.unshift(element);
    const unsrt = [...this.unsortedTiles];
    this.tiles = this.masonrySortService.sort(unsrt, this.MAX_COLS);
    this.tiles3 = this.masonrySortService.sort3(unsrt, this.MAX_COLS);
  }

  public sort(arr: Item[]) {
    return this.masonrySortService.sort(arr, this.MAX_COLS);
  }

  private getRandomItem(label: string) {
    const index = this.random(0, this.baseTiles.length - 1);
    const item = { ...this.baseTiles[index] };
    item.text = label;
    return item;
  }

}
