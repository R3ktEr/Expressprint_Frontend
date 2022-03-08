import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewDocumentPageRoutingModule } from './new-document-routing.module';

import { NewDocumentPage } from './new-document.page';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewDocumentPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewDocumentPage],
  providers: [LocalStorageService]
})
export class NewDocumentPageModule {}
