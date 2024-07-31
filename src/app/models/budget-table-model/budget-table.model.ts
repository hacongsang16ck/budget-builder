import { Signal, WritableSignal } from '@angular/core';
//Main model
export interface BudgetTable {
    incomes: Category[],
    totalIncome: Row,
    expenses: Category[],
    totalExpense: Row
}

// export interface BudgetCategories {
//     categories: Category[]
// }
export interface Category {
    header: Row,
    children: Row[],
    footer: Row
}
export interface Row {
    title: string,
    start: number,
    end: number
}
export interface TotalTable {
    loss: Row,
    openingBalance: Row,
    closingBalance: Row
}
export interface ApplyToAll{
    arrayApply: Category,
    value: number,
    key: string
}