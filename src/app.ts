import express from "express";
import {createConnection, getConnectionManager} from "typeorm";
import typeormConfig from "./conf/typeorm.config";
import {applyMiddleware} from "./utils/applyMiddleware";
import middlewareHandlers from "./middleware";
import routes from "./routes";

const App = async () => {
  try {
    await createConnection(typeormConfig);
  } catch (error) {
    if (error.name === "AlreadyHasActiveConnectionError") {
      await getConnectionManager().get("default");
    }
  }

  const app = express();

  applyMiddleware(middlewareHandlers, app);
  app.use("/", routes);

  return app;
}

export default App;