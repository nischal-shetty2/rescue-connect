import 'dotenv/config'
import connectDB from '../config/database.js'
import Vet from '../models/Vet.js'
import dummyVets from '../data/dummyVets.js'

const run = async () => {
  await connectDB()

  try {
    console.log('Clearing existing vets...')
    await Vet.deleteMany({})

    console.log(`Inserting ${dummyVets.length} vets...`)
    const inserted = await Vet.insertMany(dummyVets)

    console.log(`Inserted ${inserted.length} vets successfully.`)
    process.exit(0)
  } catch (err) {
    console.error('Failed to populate vets:', err)
    process.exit(1)
  }
}

run()
