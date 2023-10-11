import { ThemeProvider } from "./ThemeProvider";
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

import AppWrapper from "./layouts/AppWrapper";

import './styles/global.css'
import Home from "./pages/Home";
import PageNotFound from './pages/PageNotFound';
import Campaigns from "./pages/campaigns/Campaigns";
import CreateCampaign from './pages/campaigns/CreateCampaign';
import Events from "./pages/events/Events";
import CreateEvent from './pages/events/CreateEvent';
import Partners from './pages/partners/Partners';
import BecomePartner from "./pages/partners/BecomePartner";
import SingleEvent from './pages/events/SingleEvent';
import SingleCampaign from './pages/campaigns/SingleCampaign';
import TokenImport from "./pages/TokenImport";
import { useScrollIntoView } from "@mantine/hooks";

export default function App() {

  // const location = useLocation()
  // const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 60 });
  // useEffect(() => {
  //   scrollIntoView();
  // }, [location])

  return (
    <BrowserRouter>
      <ThemeProvider>
        {/* <div ref={targetRef}></div> */}
        <AppWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/import" element={<TokenImport />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:cid" element={<SingleCampaign />} />
            <Route path="/create/campaign" element={<CreateCampaign />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eid/" element={<SingleEvent />} />
            <Route path="/create/event" element={<CreateEvent />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/become-partner" element={<BecomePartner />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AppWrapper>
      </ThemeProvider>
    </BrowserRouter>
  );
}
function useEffect(arg0: () => void, arg1: import("react-router-dom").Location[]) {
  throw new Error("Function not implemented.");
}

