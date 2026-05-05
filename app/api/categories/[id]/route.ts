
import client from "@/app/api/client"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  

  const { error } = await client
    .from('Category')
    .delete()
    .eq('id', id)

  if (error) return Response.json({ error }, { status: 500 })
  return Response.json({ success: true })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params 
  const body = await request.json()

  const { data, error } = await client
    .from('Category')
    .update(body)
    .eq('id', id)

  if (error) return Response.json({ error }, { status: 500 })
  return Response.json(data)
}