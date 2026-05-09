import { Category } from "./category"

export type Product = {
    id?: number
    created_at?: Date
    name:string
    tax: number
    description?:string
    category_id?:number
    Category?: Category
    quantity?:number
    price?: number,
}