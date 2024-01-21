// App.tsx
import Dashboard from './dashboard/Dashboard';
import UploadCSV from './UploadCSV';

const App: React.FC = () => {
  return (
    <div>
      {/* Other components or content in your app */}
      <Dashboard />
      <UploadCSV />
    </div>
  );
};

export default App;
