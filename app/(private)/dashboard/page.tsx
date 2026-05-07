"use client"

import { Category } from "@/types/category"
import { useCallback, useEffect, useState } from "react"

const DashBoard =  () => {
  const [categories, setCategories] = useState<Category[]>([])

  const fetchCategories = useCallback(async () => {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
  }, []) 

  useEffect(() => {
      fetchCategories()
  }, [fetchCategories])

  return (
    <div>
    </div>
  )
}

export default DashBoard
