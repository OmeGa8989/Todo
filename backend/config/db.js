import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Local file storage
    logging: false
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync(); // Creates tables if they don't exist
        console.log('SQLite connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export default sequelize;