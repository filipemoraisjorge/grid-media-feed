import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Components
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';


const MAT_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatGridListModule,
  MatFormFieldModule,
  MatInputModule,
  MatTabsModule
];

// app components
import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { EditDialogComponent } from './grid/edit-dialog/edit-dialog.component';
// services
import { MasonrySortService } from './services/masonry-sort.service';

@NgModule({
  entryComponents: [EditDialogComponent],
  declarations: [
    AppComponent,
    GridComponent,
    EditDialogComponent
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
