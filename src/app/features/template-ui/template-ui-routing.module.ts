import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateUiComponent } from './template-ui.component';

const routes: Routes = [{ path: '', component: TemplateUiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateUiRoutingModule {}
