import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// Angular Material Components
import {MatGridListModule} from '@angular/material/grid-list';
const MAT_MODULES = [ MatGridListModule ];
// app components
import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
// services
import { MasonrySortService } from './services/masonry-sort.service';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ...MAT_MODULES
  ],
  providers: [MasonrySortService],
  bootstrap: [AppComponent]
})
export class AppModule { }
