import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StructureComponent } from './structure.component';

const routes: Routes = [
  { path: '', component: StructureComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructureRoutingModule { }
