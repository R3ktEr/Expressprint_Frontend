import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Tab2Page} from './tab2.page';

import {Tab2PageRoutingModule} from './tab2-routing.module';
import { NewDocumentPage } from '../new-document/new-document.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab2PageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [Tab2Page, NewDocumentPage]
})
export class Tab2PageModule {}
