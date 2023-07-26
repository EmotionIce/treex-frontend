import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { SettingsComponent } from './settings/settings.component';
import { ImportComponent } from './import/import.component';
import { BackendTestComponent } from './backend-test/backend-test.component';

const routes: Routes = [
  { path: '', redirectTo: '/Editor', pathMatch: 'full' },
  { path: 'Editor', component: EditorViewComponent },
  { path: 'Baum', component: TreeViewComponent },
  { path: 'Einstellungen', component: SettingsComponent },
  { path: 'Import', component: ImportComponent },
  { path: 'BackendTest', component: BackendTestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
