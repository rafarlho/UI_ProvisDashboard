"use client"
import { useEffect, useState } from "react"
import { Category } from "../../../types/category"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil, X } from 'lucide-react'
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [inputValue, setInputValue] = useState("")  // um único estado para o input
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const fetchCategories = async () => {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data)
    }

    const createCategory = async () => {
        if (!inputValue.trim()) return
        setLoading(true)
        await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: inputValue }),
        })
        setInputValue('')
        toast.success("Categoria criada com sucesso")
        await fetchCategories()
        setLoading(false)
    }

    const editCategory = async () => {
        if (!selectedCategory || !inputValue.trim()) return
        setLoading(true)
        await fetch(`/api/categories/${selectedCategory.id}`, {  // ✅ backticks
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: inputValue }),
        })
        toast.success("Categoria alterada com sucesso")
        setSelectedCategory(null)
        setInputValue('')
        await fetchCategories()
        setLoading(false)
    }

    const deleteCategory = async (id: number) => {
        await fetch(`/api/categories/${id}`, { method: 'DELETE' })
        toast.success("Categoria eliminada com sucesso")
        await fetchCategories()
    }

    const handleSelectCategory = (category: Category) => {
        setSelectedCategory(category)
        setInputValue(category.name)
    }

    const handleCancelEdit = () => {
        setSelectedCategory(null)
        setInputValue("")
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const isEditing = selectedCategory !== null

    return (
        <div className="p-10">
            <h1>Categorias</h1>

            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? "Editar" : "Criar"} categoria</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex max-w-200 gap-5">
                        <Input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Nome"
                        />
                        <Button
                            variant="secondary"
                            onClick={isEditing ? editCategory : createCategory}
                            disabled={loading}
                        >
                            {loading ? 'A aguardar...' : isEditing ? 'Editar' : 'Criar'}
                        </Button>
                        {isEditing && (
                            <Button variant="ghost" onClick={handleCancelEdit}>
                                <X /> Cancelar
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category, index) =>
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="text-right">
                                        {selectedCategory?.id === category.id ? (
                                            <Button variant="secondary" size="icon" onClick={handleCancelEdit}>
                                                <X />
                                            </Button>
                                        ) : (
                                            <Button variant="secondary" size="icon" onClick={() => handleSelectCategory(category)}>
                                                <Pencil />
                                            </Button>
                                        )}
                                        <Button variant="destructive" size="icon" onClick={() => deleteCategory(category.id)}>
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

export default Categories