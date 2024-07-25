import { NgModule, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BudgetTableComponent } from './budget-table/budget-table.component';

@NgModule({
  declarations: [
    AppComponent,
    BudgetTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [provideExperimentalZonelessChangeDetection()],
  bootstrap: [AppComponent]
})
export class AppModule { }
