import { NextResponse } from 'next/server'

const machines = [
  { id: 1, name: 'CAT Backhoe Loader', type: 'Heavy', model: '420F', status: 'Operational' },
  { id: 2, name: 'Liebherr Concrete Mixer', type: 'Concrete', model: 'HTM 604', status: 'Under Maintenance' },
  { id: 3, name: 'Manitou Telehandler', type: 'Telescopic', model: 'MT-X 1840', status: 'Operational' }
]

export async function GET() {
  return NextResponse.json(machines)
}
