import { app } from './app'

const PORT = process.env.SERVER_PORT || 8080

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🏆 `)
})
