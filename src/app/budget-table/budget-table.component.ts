import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { BudgetCategories, BudgetTable, Category, Row } from './budget-table-model/budget-table.model';

const initialRowState : Row = {
  title: '',
  start: 0,
  end: 0
}
const initialCategoryState: Category = {
  header: initialRowState,
  children: [],
  footer: {...initialRowState, title: 'Sub Total'}
}
const initialBudgetCategoriesState: BudgetCategories = {
  categories: [initialCategoryState],
  total: initialRowState
}
const initialTableState : BudgetTable = {
  incomes: [initialBudgetCategoriesState],
  expenses: [initialBudgetCategoriesState]
}

@Component({
  selector: 'app-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css']
})

export class BudgetTableComponent implements OnInit {

  title = 'budget-builder';

  nameBudget = signal('Start Period V End V');

  startDate = signal('');
  endDate = signal('');

  month = computed(()=> {
    const start = new Date(this.startDate());
    const end = new Date(this.endDate());
    return this.calculatorMonth(start, end);
  })

  //calculator when have month
  budgetTable = computed(()=> {
    let table: BudgetTable[] = [];
    for(let i = 1; i <= this.month(); i++){
      let newTable:BudgetTable = JSON.parse(JSON.stringify(initialTableState));
      newTable.incomes[0].categories[0].header.title = "General Income"
      newTable.expenses[0].categories[0].header.title = "Operational Expenses"
      table.push(newTable);
    }
    return table;
  })

  totalBudget = computed(()=>{
    this.budgetTable().forEach(value => {
      // value.tables.forEach(table => {

      // })
    })
  })

  constructor() {
    effect(()=>{
      console.log(this.nameBudget())
      console.log(this.startDate())
      console.log(this.budgetTable())
    })
  }

  ngOnInit(): void {
  }

  addNewRow(){
    //this.budgetDetail.update(rows => [...rows, {...initialRowState}]);
  }

  calculatorMonth(start: Date, end: Date): number{
    // Calculate the difference in months
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth);
  }
}
