import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetTableComponent } from './budget-table/budget-table.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
