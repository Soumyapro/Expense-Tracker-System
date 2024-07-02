import mongoose from 'mongoose';

export const connectDB = async (url, app) => {
    mongoose.connect(url)
        .then(() => {
            console.log("Database is connected");
            app.listen(process.env.PORT, () => {
                console.log(`Server is running on Port No. ${process.env.PORT}`);
            });
        })
        .catch((error) => {
            console.log("!error occurred");
        })
};
