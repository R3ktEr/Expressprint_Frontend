import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PricesHistoryPageRoutingModule } from './prices-history-routing.module';

import { PricesHistoryPage } from './prices-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PricesHistoryPageRoutingModule
  ],
  declarations: [PricesHistoryPage]
})
export class PricesHistoryPageModule {}
