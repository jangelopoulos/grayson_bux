import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import QuizGate from "./pages/QuizGate";
import Itinerary from "./pages/Itinerary";
import Groups from "./pages/Groups";
import Leaderboard from "./pages/Leaderboard";
import ActivityScoring from "./pages/ActivityScoring";
import Admin from "./pages/Admin";
import Setup from "./pages/Setup";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/quiz" element={<ProtectedRoute><QuizGate /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/itinerary" replace />} />
          <Route path="/itinerary" element={
            <ProtectedRoute>
              <Layout><Itinerary /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/groups" element={
            <ProtectedRoute>
              <Layout><Groups /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Layout><Leaderboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/activity/:name" element={
            <ProtectedRoute>
              <Layout><ActivityScoring /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <Layout><Admin /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/setup" element={
            <ProtectedRoute adminOnly>
              <Layout><Setup /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/itinerary" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
