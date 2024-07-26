//Main model
export interface BudgetTable {
    incomes: BudgetCategories[],
    expenses: BudgetCategories[]
}

export interface BudgetCategories {
    categories: Category[],
    total: Row
}
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