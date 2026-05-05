"use client"

import { useEffect, useState } from "react"
import { Category } from "../../../types/category"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil, X } from 'lucide-react'
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Product } from "@/types/product"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const emptyProduct: Product = {
    name: "",
    description: "",
    tax: 0,
    quantity: 0,
    unit_price: 0,
    box_price: 0,
    category_id: undefined,
}

type FormErrors = Partial<Record<keyof Product, string>>

const Products = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [formValue, setFormValue] = useState<Product>(emptyProduct)
    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const fetchProducts = async () => {
        const res = await fetch("/api/products")
        const data = await res.json()
        setProducts(data)
    }

    const fetchCategories = async () => {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data)
    }

    const validate = (): boolean => {
        const newErrors: FormErrors = {}
        if (!formValue.name.trim()) newErrors.name = "Nome é obrigatório"
        if (!formValue.category_id) newErrors.category_id = "Categoria é obrigatória"
        if ((formValue.tax ?? 0) < 0 || (formValue.tax ?? 0) > 100) newErrors.tax = "IVA deve estar entre 0 e 100"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const createProduct = async () => {
        if (!validate()) return
        setLoading(true)
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formValue),
        })
        if (!res.ok) {
            toast.error("Erro ao criar produto")
            setLoading(false)
            return
        }
        toast.success("Produto criado com sucesso")
        setFormValue(emptyProduct)
        setErrors({})
        await fetchProducts()
        setLoading(false)
    }

    const editProduct = async () => {
        if (!selectedProduct || !validate()) return
        const product = {
            box_price: formValue.box_price ,
            category_id: formValue.category_id ,
            created_at: formValue.created_at ,
            description: formValue.description ,
            id: formValue.id ,
            name: formValue.name ,
            quantity: formValue.quantity ,
            tax: formValue.tax ,
            unit_price: formValue.unit_price ,
        } 
        setLoading(true)
        const res = await fetch(`/api/products/${selectedProduct.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        })
        if (!res.ok) {
            toast.error("Erro ao editar produto")
            setLoading(false)
            return
        }
        toast.success("Produto alterado com sucesso")
        setSelectedProduct(null)
        setFormValue(emptyProduct)
        setErrors({})
        await fetchProducts()
        setLoading(false)
    }

    const deleteProduct = async (id: number) => {
        await fetch(`/api/products/${id}`, { method: 'DELETE' })
        toast.success("Produto eliminado com sucesso")
        await fetchProducts()
    }

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product)
        setFormValue(product)
        setErrors({})
    }

    const handleCancelEdit = () => {
        setSelectedProduct(null)
        setFormValue(emptyProduct)
        setErrors({})
    }

    const handleChange = (field: keyof Product, value: string | number) => {
        setFormValue(prev => ({ ...prev, [field]: value }))
        // limpa o erro do campo ao editar
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    const isEditing = selectedProduct !== null

    return (
        <div className="p-10">
            <h1>Products</h1>


            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? "Editar" : "Criar"} produto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            isEditing ? editProduct() : createProduct()
                        }}
                    >
                        <div className="flex flex-wrap gap-5">
                            <div className="grid gap-1 w-50">
                                <Label className="px-2">Nome</Label>
                                <Input
                                    type="text"
                                    value={formValue.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Nome"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs px-2">{errors.name}</p>}
                            </div>

                            <div className="grid gap-1 w-100">
                                <Label className="px-2">Descrição</Label>
                                <Input
                                    type="text"
                                    value={formValue.description ?? ""}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Descrição"
                                />
                            </div>

                            <div className="grid gap-1 w-25">
                                <Label className="px-2">IVA (%)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    max={100}
                                    value={formValue.tax ?? 0}
                                    onChange={(e) => handleChange('tax', Number(e.target.value))}
                                    placeholder="IVA"
                                />
                                {errors.tax && <p className="text-red-500 text-xs px-2">{errors.tax}</p>}
                            </div>

                            <div className="grid gap-1 w-75">
                                <Label className="px-2">Categoria</Label>
                                <Select
                                    value={formValue.category_id ? String(formValue.category_id) : ""}
                                    onValueChange={(val) => handleChange('category_id', Number(val))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecionar categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {categories.map((category) =>
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </SelectItem>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.category_id && <p className="text-red-500 text-xs px-2">{errors.category_id}</p>}
                            </div>

                            <div className="grid gap-1 w-50">
                                <Label className="px-2">Preço (€)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={formValue.unit_price ?? 0}
                                    onChange={(e) => handleChange('unit_price', Number(e.target.value))}
                                    placeholder="Preço"
                                />
                                {errors.unit_price && <p className="text-red-500 text-xs px-2">{errors.unit_price}</p>}
                            </div>

                            <div className="grid gap-1 w-50">
                                <Label className="px-2">Preço por caixa (€)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={formValue.box_price ?? 0}
                                    onChange={(e) => handleChange('box_price', Number(e.target.value))}
                                    placeholder="Preço por caixa"
                                />
                            </div>

                            <div className="grid gap-1 w-25">
                                <Label className="px-2">Quantidade</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={formValue.quantity ?? 0}
                                    onChange={(e) => handleChange('quantity', Number(e.target.value))}
                                    placeholder="Quantidade"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-5">
                            <Button type="submit" variant="secondary" disabled={loading}>
                                {loading ? 'A aguardar...' : isEditing ? 'Editar' : 'Criar'}
                            </Button>
                            {isEditing && (
                                <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                                    <X /> Cancelar
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>IVA</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Preço</TableHead>
                                <TableHead>Preço por caixa</TableHead>
                                <TableHead>Quantidade</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product, index) =>
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>{product.tax}%</TableCell>
                                    <TableCell>{product.Category?.name}</TableCell>
                                    <TableCell>{product.unit_price? `${product.unit_price}€` : "" }</TableCell>
                                    <TableCell>{product.box_price? `${product.box_price}€` : "" }</TableCell>
                                    <TableCell>{product.quantity ?? ""}</TableCell>
                                    <TableCell className="text-right">
                                        {selectedProduct?.id === product.id ? (
                                            <Button variant="secondary" size="icon" onClick={handleCancelEdit}>
                                                <X />
                                            </Button>
                                        ) : (
                                            <Button variant="secondary" size="icon" onClick={() => handleSelectProduct(product)}>
                                                <Pencil />
                                            </Button>
                                        )}
                                        <Button variant="destructive" size="icon" onClick={() => deleteProduct(product.id!)}>
                                            <Trash2 />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default Products