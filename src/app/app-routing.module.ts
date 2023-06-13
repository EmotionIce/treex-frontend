import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { TreeViewComponent } from './tree-view/tree-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/Editor', pathMatch: 'full' },
  { path: 'Editor', component: EditorViewComponent },
  { path: 'Baum', component: TreeViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
