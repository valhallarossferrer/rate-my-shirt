import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadShirtPage } from './upload-shirt.page';

const routes: Routes = [
  {
    path: '',
    component: UploadShirtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadShirtPageRoutingModule {}
