import client from "@/app/api/client"

export async function GET() {
    const { data, error } = await client.from('Category').select('*')
    if (error) return Response.json({ error }, { status: 500 })
    return Response.json(data)
}

export async function POST(request) {
    const body = await request.json()
    const { data, error } = await client.from('Category').insert(body)
    if (error) return Response.json({ error }, { status: 500 })
    return Response.json(data)
}