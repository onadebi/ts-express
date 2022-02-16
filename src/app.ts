import { appsettings } from "./config/appsettings";
import { PoweredBy } from "./middleware/utils";
import routes from "./router/routes";
import {server } from "./server";


const PORT : number = Number(appsettings.PORT!) === NaN ? 8500 : Number.parseInt(appsettings.PORT!);
const app = server();

app.use('/',PoweredBy,routes)
app.listen(PORT,()=> console.log(`App running on port ${PORT}`));