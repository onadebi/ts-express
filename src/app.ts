import { appsettings } from "./config/appsettings";
import ErrorHandler from "./middleware/errorHandler";
import { PoweredBy } from "./middleware/utils";
import routes from "./router/routes";
import {server } from "./server";
import swaggerDocs from "./helpers/appSwaggerOptions.helper";
import { ConsoleLog } from "./utils/util-helper";


const PORT : number = Number(appsettings.PORT!) === NaN ? 8500 : Number.parseInt(appsettings.PORT!);
const app = server();


app.use('/',PoweredBy,routes)
app.use(ErrorHandler)

app.listen(PORT,()=> ConsoleLog(`App running on port ${PORT}`));
swaggerDocs(app,PORT);