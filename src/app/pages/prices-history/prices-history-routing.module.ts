import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PricesHistoryPage } from './prices-history.page';

const routes: Routes = [
  {
    path: '',
    component: PricesHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PricesHistoryPageRoutingModule {}
