import { useState } from "react";
import { CurrentPage } from "./types";
import Home from "./pages/home/Home";

function App() {
  const [page, setPage] = useState<CurrentPage>("home");

  return (
    <>
      {page == "home" && (
        <Home setPage={setPage}></Home>
      )}
    </>
  );
}

export default App;
