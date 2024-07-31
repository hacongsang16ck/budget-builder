import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import {
  ApplyToAll,
  BudgetTable,
  Category,
  Row,
  TotalTable,
} from '../models/budget-table-model/budget-table.model';
import { debounceTime, Subject } from 'rxjs';

const initialRowState: Row = {
  title: '',
  start: 0,
  end: 0,
};
const initialCategoryState: Category = {
  header: initialRowState,
  children: [],
  footer: { ...initialRowState, title: 'Sub Total' },
};
const initialTableState: BudgetTable = {
  incomes: [initialCategoryState],
  totalIncome: {...initialRowState, title: 'Total income'},
  expenses: [initialCategoryState],
  totalExpense: {...initialRowState, title: 'Total expenses'}
};
const initialTotalTableState: TotalTable = {
  loss: { ...initialRowState, title: 'Profit / Loss' },
  openingBalance: { ...initialRowState, title: 'Opening Balance' },
  closingBalance: { ...initialRowState, title: 'Closing Balance' },
}

const initialApplyToAllState: ApplyToAll = {
  arrayApply: initialCategoryState,
  value: 0,
  key: ''
}

@Component({
  selector: 'app-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css'],
})
export class BudgetTableComponent implements OnInit {
  title = 'budget-builder';

  nameBudget = signal('Start Period V End Period V'); //default

  contextMenuVisible = signal(false)

  today = new Date();

  startDate = signal(
    this.today.getFullYear() +
      '-' +
      (this.today.getMonth() > 9
        ? this.today.getMonth()
        : '0' + this.today.getMonth())
  );
  endDate = signal(
    this.today.getFullYear() +
      '-' +
      (this.today.getMonth() + 1 > 9
        ? this.today.getMonth() + 1
        : '0' + (this.today.getMonth() + 1))
  );

  month = computed(() => {
    const start = new Date(this.startDate());
    const end = new Date(this.endDate());
    return this.calculatorMonth(start, end);
  });

  tableBudget: WritableSignal<BudgetTable[]> = signal<BudgetTable[]>(
    this.calcTable()
  );

  applyObject: WritableSignal<ApplyToAll> = signal<ApplyToAll>(initialApplyToAllState)

  totalTable: WritableSignal<TotalTable> = signal<TotalTable>(initialTotalTableState)

  @ViewChildren('inputElement') inputElements!: QueryList<ElementRef>;

  public keyUp = new Subject<KeyboardEvent>();

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      if(this.month() > 1){
        this.tableBudget.set(this.calcTable())
      }
      if (this.tableBudget().length > 0) {
        setTimeout(
          () => this.inputElements.toArray()[1].nativeElement.focus(),
          500
        );
      }
    },{ allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.onKeyUpEnter()
  }

  addNewRow(rows: Row[]) {
    rows.push({ ...initialRowState });
  }

  addNewParent(parents: Category[]) {
    parents.push(JSON.parse(JSON.stringify(initialCategoryState)));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.contextMenuVisible.set(false);
    this.applyObject().arrayApply.children.forEach(child=>{
      (child as any)[this.applyObject().key] = this.applyObject().value
    })
  }

  contextMenuPosition = { x: '0px', y: '0px' };
  onRightClick(event: MouseEvent, value: number, arrayApply: Category, key: string) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenuVisible.set(true);
    const object:ApplyToAll = {
      arrayApply: arrayApply,
      value: value,
      key: key
    }
    this.applyObject.set(object)
  }

  applyToAll() {
    // Implement your logic to apply the value to all cells
    console.log('Apply to all:');
    this.contextMenuVisible.set(false);
  }


  onKeyUpEnter() {
    this.keyUp.pipe(debounceTime(500)).subscribe(res=>{
      if(res.key == 'enter' || res.key == 'Enter'){
        console.log('enter event')
      }
    })
  }

  calcTotalTable(){
    this.tableBudget.update((tables) => {
      tables.forEach((table) => {
        table.totalIncome.start = table.incomes.reduce((sum, child)=> sum + child.footer.start,0)
        table.totalIncome.end = table.incomes.reduce((sum, child)=> sum + child.footer.end,0)
        table.totalExpense.start = table.expenses.reduce((sum, child)=> sum + child.footer.start,0)
        table.totalExpense.end = table.expenses.reduce((sum, child)=> sum + child.footer.end,0)
      });
      return tables;
    });
    this.totalTable.update((total)=>{
      total.loss.start = Math.abs(this.tableBudget().reduce((sum, child)=>sum+(child.totalExpense.start-child.totalIncome.start),0));
      total.loss.end = Math.abs(this.tableBudget().reduce((sum, child)=>sum+child.totalExpense.end-child.totalIncome.end,0));
      total.openingBalance.start = 0;
      total.closingBalance.start = Math.abs(this.tableBudget().reduce((sum, child)=>sum+child.totalIncome.start-child.totalExpense.start,0));
      total.openingBalance.end = total.closingBalance.start
      total.closingBalance.end = Math.abs(total.openingBalance.end + this.tableBudget().reduce((sum, child)=>sum+child.totalIncome.end-child.totalExpense.end,0));
      return total;
    })
  }

  calculatorTotalCategories() {
    this.tableBudget.update((tables) => {
      tables.forEach((table) => {
        table.incomes.forEach((income) => {
          let childrenStartSum = income.children.reduce(
            (sum, child) => sum + child.start,
            0
          );
          let childrenEndSum = income.children.reduce(
            (sum, child) => sum + child.end,
            0
          );
          income.footer.start = childrenStartSum + income.header.start;
          income.footer.end = childrenEndSum + income.header.end;
        });
        table.expenses.forEach((expense) => {
          let childrenStartSum = expense.children.reduce(
            (sum, child) => sum + child.start,
            0
          );
          let childrenEndSum = expense.children.reduce(
            (sum, child) => sum + child.end,
            0
          );
          expense.footer.start = childrenStartSum + expense.header.start;
          expense.footer.end = childrenEndSum + expense.header.end;
        });
      });
      return tables;
    });
    this.calcTotalTable()
  }

  calcTable(): BudgetTable[] {
    let table: BudgetTable[] = [];
    for (let i = 1; i <= this.month(); i++) {
      let newTable: BudgetTable = JSON.parse(JSON.stringify(initialTableState)) 
      newTable.incomes[0].header.title = 'General Income';
      newTable.expenses[0].header.title = 'Operational Expenses';
      table.push(newTable);
    }
    return table;
  }

  calculatorMonth(start: Date, end: Date): number {
    // Calculate the difference in months
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth);
  }
}
