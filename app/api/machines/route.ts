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
  // Obtener datos JSON del cuerpo de la solicitud
  const body = await req.json()

  // Insertar el nuevo registro en Supabase
  const { data, error } = await supabase.from('machines').insert([body]).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0]) // devolver solo la máquina insertada
}
