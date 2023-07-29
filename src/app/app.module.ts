import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { HeaderComponent } from './header/header.component';
import { NavElementComponent } from './nav-element/nav-element.component';
import { EditorLayerComponent } from './editor-layer/editor-layer.component';
import { ElementTitleComponent } from './element-title/element-title.component';
import { ElementContentComponent } from './element-content/element-content.component';
import { EditorPartComponent } from './editor-part/editor-part.component';
import { NavigationPartComponent} from './navigation-part/navigation-part.component';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms'; // add this line

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { CommentComponent } from './comment/comment.component';
import { ContentComponent } from './content/content.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImportComponent } from './import/import.component';

import { DragDropModule } from '@angular/cdk/drag-drop';



import { BackendService } from './services/backend.service';
import { ErrorPopupService } from './services/error-popup.service';
import { SettingsService } from './services/settings';
import { LatexRenderComponent } from './latex-render/latex-render.component';
import { SummaryComponent } from './summary/summary.component';

import { DiagramModule, DataBindingService, SnappingService, ComplexHierarchicalTreeService} from '@syncfusion/ej2-angular-diagrams';
import {TooltipModule} from '@syncfusion/ej2-angular-popups';



@NgModule({
  declarations: [
    AppComponent,
    TreeViewComponent,
    EditorViewComponent,
    HeaderComponent,
    NavElementComponent,
    EditorLayerComponent,
    ElementTitleComponent,
    ElementContentComponent,
    EditorPartComponent,
    NavigationPartComponent,
    SettingsComponent,
    ErrorPopupComponent,
    CommentComponent,
    ContentComponent,
    TextEditorComponent,
    ImportComponent,
    LatexRenderComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    DragDropModule,
    DiagramModule,
    TooltipModule
  ],

  providers: [SettingsService, DataBindingService, SnappingService, ComplexHierarchicalTreeService, BackendService, ErrorPopupService],
  bootstrap: [AppComponent],
})
export class AppModule {}
