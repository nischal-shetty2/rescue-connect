import { Request, Response } from 'express'
import { app } from './app'
const port = 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!')
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
