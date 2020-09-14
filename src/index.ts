import App from "./app";

const port = 8000;

App()
 .then((app) => {
   app.listen(port, () => {
     console.log(`server started on localhost:${port}`);
   })
 });