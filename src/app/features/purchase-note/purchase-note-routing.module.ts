import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseNoteComponent } from './purchase-note.component';
import { PurchaseNoteListComponent } from './pages/purchase-note-list/purchase-note-list.component';
import { PurchaseNoteAddComponent } from './pages/purchase-note-add/purchase-note-add.component';
import { PurchaseNoteViewComponent } from './pages/purchase-note-view/purchase-note-view.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseNoteComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: PurchaseNoteListComponent,
      },
      {
        path: 'add',
        component: PurchaseNoteAddComponent,
      },
      {
        path: 'view/:id',
        component: PurchaseNoteViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseNoteRoutingModule { }
