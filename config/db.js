const mongoose = require('mongoose');
const config = require('config');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.get('atlasUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Connect to Database Successfully...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = { connectToDatabase };
