import { createContext } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import AuthStore from './store/AuthStore'
import MatchStore from './store/MatchStore'
import PredictionStore from './store/PredictionStore'
import LeaderboardStore from './store/LeaderboardStore'
import AdminStore from './store/AdminStore'
import './styles/tokens.css'

interface State {
  authStore: AuthStore;
  matchStore: MatchStore;
  predictionStore: PredictionStore;
  leaderboardStore: LeaderboardStore;
  adminStore: AdminStore;
}

const authStore = new AuthStore();
const matchStore = new MatchStore();
const predictionStore = new PredictionStore();
const leaderboardStore = new LeaderboardStore();
const adminStore = new AdminStore();

export const Context = createContext<State>({
  authStore,
  matchStore,
  predictionStore,
  leaderboardStore,
  adminStore
});

createRoot(document.getElementById('root')!).render(
  <Context.Provider value={{
      authStore,
      matchStore,
      predictionStore,
      leaderboardStore,
      adminStore
    }}>
    <App />
  </Context.Provider>
)
