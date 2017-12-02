import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gmf-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  private baseTiles = [
    { content: {}, text: '2x2', cols: 2, rows: 2, color: 'lightblue' },
    { content: {}, text: '1x1', cols: 1, rows: 1, color: 'lightgreen' },
    { content: {}, text: '2x1', cols: 2, rows: 1, color: 'lightpink' },
    { content: {}, text: '1x2', cols: 1, rows: 2, color: '#DDBDF1' },
  ];
  private bigTile = { content: { title: 'big', text: 'The big tile' }, cols: 8, rows: 4, color: '#DDEE66' };
  private baseContent = [
    { title: '1', text: 'The first  item' },
    { title: '2', text: 'The second  item' },
    { title: '3', text: 'The third  item' },
    { title: '4', text: 'The fourth  item' },
    { title: '5', text: 'The fifth  item' },
    { title: '6', text: 'The sixth random item' },

  ];

  private tiles2 = [{ "text": "big", "cols": 8, "rows": 4, "color": "#DDEE66" }, { "text": "0", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "1", "cols": 2, "rows": 2, "color": "lightblue" }, { "text": "2", "cols": 1, "rows": 2, "color": "#DDBDF1" }, { "text": "3", "cols": 1, "rows": 2, "color": "#DDBDF1" }, { "text": "4", "cols": 1, "rows": 2, "color": "#DDBDF1" }, { "text": "5", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "6", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "7", "cols": 2, "rows": 2, "color": "lightblue" }, { "text": "8", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "9", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "10", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "11", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "12", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "13", "cols": 1, "rows": 2, "color": "#DDBDF1" }, { "text": "14", "cols": 2, "rows": 2, "color": "lightblue" }, { "text": "15", "cols": 1, "rows": 2, "color": "#DDBDF1" }, { "text": "16", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "17", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "18", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "19", "cols": 2, "rows": 2, "color": "lightblue" }, { "text": "20", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "21", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "22", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "23", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "24", "cols": 2, "rows": 2, "color": "lightblue" }, { "text": "25", "cols": 2, "rows": 1, "color": "red" }, { "text": "26", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "27", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "28", "cols": 2, "rows": 2, "color": "lightblue" }, { "text": "29", "cols": 1, "rows": 2, "color": "#DDBDF1" }, { "text": "30", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "31", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "32", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "33", "cols": 2, "rows": 2, "color": "lightblue" }, { "text": "34", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "35", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "36", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "37", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "38", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "39", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "40", "cols": 1, "rows": 2, "color": "#DDBDF1" }, { "text": "41", "cols": 2, "rows": 2, "color": "lightblue" }, { "text": "42", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "43", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "44", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "45", "cols": 2, "rows": 1, "color": "lightpink" }, { "text": "46", "cols": 1, "rows": 1, "color": "lightgreen" }, { "text": "47", "cols": 1, "rows": 1, "color": "lightgreen" }];
  public tiles = [];
  private GRID_QTY_ELEMENTS = 48;
  private MAX_SIZE_MULTI = 1;
  public MAX_COLS = 12; // 2 * this.MAX_SIZE_MULTI;

  public isLoaded = false;
  constructor() { }

  ngOnInit() {
    const bigIndex = this.random(0, this.GRID_QTY_ELEMENTS - 1);
    for (let i = 0; i < this.GRID_QTY_ELEMENTS; i++) {

      const size = this.random(1, this.MAX_SIZE_MULTI);
      const index = this.random(0, this.baseTiles.length - 1);
      const contentIndex = this.random(0, this.baseContent.length - 1);

      const element = { ...this.baseTiles[index] };

      element.cols = element.cols * size;
      element.rows = element.rows * size;
      element.content = this.baseContent[contentIndex];
      element.text = `${i + 1}`; // - ${element.cols}x${element.rows}`;

      this.tiles.push(i === bigIndex ? this.bigTile : element);

    }
    this.isLoaded = true;
    // console.log(JSON.stringify(this.tiles));
  }

  public addCols() {
    // this.MAX_COLS++;
    const filterType = this.random(1,6);
    this.tiles = this.tiles.filter(tile => {
      return tile.content.title !== `${filterType}`;
    });
  }

  private random(min: number, max: number) {
    return min + Math.round(Math.random() * (max - min));
  }
}
