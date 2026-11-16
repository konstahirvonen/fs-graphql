const mongoose = require('mongoose')

const connectToDb = async (uri) => {
    console.log('connecting to databaseURI:', uri)

    try {
        await mongoose.connect(uri)
        console.log('connected to MongoDB')
    } catch (error) {
        console.log('error connecting to MongoDB:', error.message)
        process.exit(1)
    }
}

module.exports = connectToDb