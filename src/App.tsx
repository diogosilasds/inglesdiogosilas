import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Trail from "./pages/Trail";
import TextDetail from "./pages/TextDetail";
import QuizText from "./pages/QuizText";
import RandomQuiz from "./pages/RandomQuiz";
import ProgressDashboard from "./pages/ProgressDashboard";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/biblioteca" element={<Library />} />
            <Route path="/trilha" element={<Trail />} />
            <Route path="/texto/:id" element={<TextDetail />} />
            <Route path="/progresso" element={<ProgressDashboard />} />
            <Route path="/quiz-aleatorio" element={<RandomQuiz />} />
          </Route>
          <Route path="/quiz/:id" element={<QuizText />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
