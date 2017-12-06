import { Component, OnInit } from '@angular/core';
import { Item } from '../interfaces/item';
import { MasonrySortService } from '../services/masonry-sort.service';
import { makeDecorator } from '@angular/core/src/util/decorators';

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

  private GRID_QTY_ELEMENTS = 40;
  private MAX_SIZE_MULTI = 1;
  public MAX_COLS = 8;

  public isLoaded = false;
  constructor(private masonrySortService: MasonrySortService) {
    masonrySortService.maxColumns = this.MAX_COLS;
   }

  ngOnInit() {
     // mock/fill the array with random items;
    const unsortedTiles = [];
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

    const start = performance.now();
    this.tiles = this.masonrySortService.sort(unsortedTiles);
    const end = performance.now();
    console.log((end - start) / 1000);
    this.isLoaded = true;
  }


  private random(min: number, max: number) {
    return min + Math.round(Math.random() * (max - min));
  }


}
