import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewDocumentPage } from './new-document.page';

const routes: Routes = [
  {
    path: '',
    component: NewDocumentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewDocumentPageRoutingModule {}
