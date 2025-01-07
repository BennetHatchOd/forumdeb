import {app} from './app';
import { connectToDb } from './db/db';
import { PORT } from './setting/setting';

const appStart = async () =>{
    await connectToDb()
    app.listen(PORT, () => {
        console.log(`Server is working on port ${PORT}`);
    })
}

appStart() 