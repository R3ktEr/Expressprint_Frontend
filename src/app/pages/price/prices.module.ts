import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PricesPageRoutingModule } from './prices-routing.module';

import { PricesPage } from './prices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PricesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PricesPage]
})
export class PricesPageModule {}
