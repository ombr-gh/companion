import { useState } from 'react';
import { CurrentPage } from './types';
import Home from './pages/home/Home';

function App() {
  const [page] = useState<CurrentPage>('home');

  return (
    <>
      {page == 'home' && (
        <Home></Home>
      )}
    </>
  );
}

export default App;
