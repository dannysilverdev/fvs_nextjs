'use client'

import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

import AddMachineForm from '@/components/AddMachineForm'

type Machine = {
  id: string
  name: string
  type: string
  model: string
  status: string
}

export default function Home() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [openForm, setOpenForm] = useState(false)

  useEffect(() => {
    fetch('/api/machines')
      .then(res => res.json())
      .then(data => {
        setMachines(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleAdd = (machine: Machine) => {
    setMachines(prev => [...prev, machine])
    setOpenForm(false)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fleet Vitals System
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Upcoming Maintenance</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          This section will show expiring items like torque check, gas certificates, etc.
        </Typography>
      </Paper>

      <Typography variant="h6" gutterBottom>Machines Overview</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {machines.map((m) => (
          <Grid item xs={12} sm={6} md={4} key={m.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{m.name}</Typography>
                <Typography variant="body2">Model: {m.model}</Typography>
                <Typography variant="body2">Type: {m.type}</Typography>
                <Typography variant="body2">Status: {m.status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" onClick={() => setOpenForm(true)}>
        Add Machine
      </Button>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Machine</DialogTitle>
        <DialogContent>
          <AddMachineForm onAdd={handleAdd} />
        </DialogContent>
      </Dialog>
    </Container>
  )
}
