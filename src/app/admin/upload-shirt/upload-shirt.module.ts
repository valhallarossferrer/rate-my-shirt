import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadShirtPageRoutingModule } from './upload-shirt-routing.module';

import { UploadShirtPage } from './upload-shirt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadShirtPageRoutingModule
  ],
  declarations: [UploadShirtPage]
})
export class UploadShirtPageModule {}
