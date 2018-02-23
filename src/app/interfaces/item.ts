export interface Item {
  id?: string;
  content: any;
  text: string;
  body?: string;
  blurb?: string;
  imageUrl?: string;
  videoUrl?: string;
  width: number;
  height: number;
  color: string;
  row?: number;
  column?: number;
  stickyPercentage?: number;
}

