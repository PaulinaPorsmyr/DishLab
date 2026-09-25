import Navbar from '../components/Navbar';
import DishList from '../components/DishList';

export default function DashboardPage() {
  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1>Recipe Experiment Lab</h1>
        <DishList />
      </main>
    </div>
  );
}