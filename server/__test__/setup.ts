import mongoose from 'mongoose';
import app from '../src/app';

let server: any;

beforeAll(async () => {
  const port = 80;
  const MONGODB_URL = `${process.env.MONGODB_URL}/test` || '';
  mongoose
    .connect(MONGODB_URL)
    .then(() => {
      server = app.listen(port, () =>
        console.log('Server listening on http://localhost:' + port)
      );

      server.close();
    })
    .catch((error) => console.log(`Server is not connected: ${error.message}`));
});

afterAll(async () => {
  server.close();
  await mongoose.disconnect();
});
