import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

/* 
|--------------------------------------------------------------------------
| GET /api/machines
|--------------------------------------------------------------------------
| Esta ruta obtiene todas las máquinas desde la base de datos Supabase.
| Se llama automáticamente desde el frontend para llenar la lista inicial.
*/
export async function GET() {
  const { data, error } = await supabase.from('machines').select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data) // devuelve array de máquinas
}


/* 
|--------------------------------------------------------------------------
| POST /api/machines
|--------------------------------------------------------------------------
| Esta ruta recibe una nueva máquina desde el frontend (formulario).
| Inserta el registro en Supabase y devuelve el objeto recién creado.
*/
export async function POST(req: Request) {
  const body = await req.json()

  const { data, error } = await supabase.from('machines').insert([body]).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0]) // devolver solo la máquina insertada
}


/* 
|--------------------------------------------------------------------------
| PUT /api/machines
|--------------------------------------------------------------------------
| Esta ruta actualiza una máquina existente.
| Recibe un objeto con todos los campos y actualiza el registro por ID.
*/
export async function PUT(req: Request) {
  const body = await req.json()
  const { id, name, type, model, status, plate_number, brand } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  const { error } = await supabase
    .from('machines')
    .update({ name, type, model, status, plate_number, brand })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Machine updated successfully' })
}
