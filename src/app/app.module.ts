import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { HeaderComponent } from './header/header.component';
import { NavElementComponent } from './nav-element/nav-element.component';
import { EditorLayerComponent } from './editor-layer/editor-layer.component';
import { LayerElementComponent } from './layer-element/layer-element.component';
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

@NgModule({
  declarations: [
    AppComponent,
    TreeViewComponent,
    EditorViewComponent,
    HeaderComponent,
    NavElementComponent,
    EditorLayerComponent,
    LayerElementComponent,
    ElementTitleComponent,
    ElementContentComponent,
    EditorPartComponent,
    NavigationPartComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
