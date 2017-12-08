export interface Item {
  id?: number;
  content: any;
  text: string;
  width: number;
  height: number;
  color: string;
  row?: number;
  column?: number;
  stickyPercentage?: number;
}

