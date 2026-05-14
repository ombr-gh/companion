import { PageProps } from '../types';
import './Home.css';

export default function Home({
  setPage,
}: PageProps) {
  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>
    </main>
  );
}
