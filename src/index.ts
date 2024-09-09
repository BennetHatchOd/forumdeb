import {app} from './app';
import {SETTING} from './setting';
import { connectToDb } from './db/db';

const appStart = async () =>{
    await connectToDb()
    app.listen(SETTING.PORT, () => {
        console.log(`Server is working on port ${SETTING.PORT}`);
    })
}

appStart() 