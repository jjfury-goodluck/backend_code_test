import React, { useEffect, useState } from 'react';
import { restoreLogin, thunkLogout } from './redux/user/thunk';
import { useSelector, useDispatch } from 'react-redux';
import './App.scss';
import { RootState } from './store';
import AdminForm from './AdminForm';
import LoginForm from './LoginForm';
import CampaignList from './CampaignList';

function App() {
  const dispatch = useDispatch();
  const [trigger, setTrigger] = useState(false)
  const isLogin = useSelector((oldstate: RootState) => oldstate.user.isAuthenticated);

  useEffect(() => {
    dispatch(restoreLogin())
  }, [dispatch, isLogin])

  return (
    <div className="App">
      <button className="toggle_button" onClick={async (e) => setTrigger(!trigger)}>Admin</button>
      {!isLogin && trigger && <LoginForm />}
      {isLogin && trigger && <AdminForm />}
      {isLogin && trigger && < button className="logout_button" onClick={async (e) => dispatch(thunkLogout())}>Logout</button>}

      <CampaignList />

    </div >
  );
}

export default App;
