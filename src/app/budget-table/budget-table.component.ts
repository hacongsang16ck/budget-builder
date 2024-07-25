import { Component, effect, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { budgetRow } from './budget-table-model/budget-table.model';

const initialState : budgetRow = {
  firstCol: '',
  secondCol: '',
  thirdCol: ''
}

@Component({
  selector: 'app-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css']
})

export class BudgetTableComponent implements OnInit {

  constructor() {
    effect(()=>{
      console.log(this.nameBudget())
      console.log(this.startDate())
      console.log(this.endDate())
    })
  }

  ngOnInit(): void {
  }
  title = 'budget-builder';
  nameBudget = signal('Start Period V End Period V');
  startDate = signal('');
  endDate = signal('');

  budgetTable: WritableSignal<budgetRow[]> = signal([]);

  addNewRow(){
    this.budgetTable.update(rows => [...rows, {...initialState}]);
  }

  changeDate(event: Event, signal: WritableSignal<string>){
    const input = event.target as HTMLInputElement;
    signal.set(input.value);
  }

}
