import TaskDropdown from './components/TaskTracker';
import { Layout } from 'antd';
import dayjs from 'dayjs';
import './App.scss';

function App() {
  const { Header, Content, Footer } = Layout;
  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <h1>Task Tracker</h1>
      </Header>
      <Content>
        <TaskDropdown />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ankur ©{dayjs().year()} Created by Ankur
      </Footer>
    </Layout>
  );
}

export default App;
