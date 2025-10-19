import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutShell from "./LayoutShell";
import NotFound from "./NotFound";
import Unauthorized from "./Unauthorized";
import HomeContainer from "../../features/home/HomeContainer";
import SettingsContainer from "../../features/settings/SettingsContainer";
import NotificationsContainer from "../../features/notifications/NotificationsContainer";
import SupportContainer from "../../features/support/SupportContainer";
import SaveConferenceContainer from "features/conferences/components/saveConference/SaveConferenceContainer";
import ConferenceDetailsContainer from "features/conferences/components/ConferenceDetailsContainer";
import AllConferencesContainer from "features/conferences/components/AllConferencesContainer";
import MyConferencesContainer from "features/conferences/components/MyConferencesContainer";
import FeedbackContainer from "features/feedback/FeedbackContainer";
import MyFeedbacksContainer from "features/feedback/MyFeedbacksContainer";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutShell />}>
          <Route index element={<HomeContainer />} />
          <Route path="myConferences" element={<MyConferencesContainer />} />
          <Route path="conferences/new" element={<SaveConferenceContainer />} />
          <Route path="conferences/edit/:id" element={<SaveConferenceContainer />} />
          <Route path="conferences/details/:id" element={<ConferenceDetailsContainer />} />
          <Route path="conferences/details/:conferenceId/feedback/:id" element={<FeedbackContainer />} />
          <Route path="myReviews" element={<MyFeedbacksContainer />} />
          <Route path="allConferences" element={<AllConferencesContainer />} />
          <Route path="settings" element={<SettingsContainer />} />
          <Route path="notifications" element={<NotificationsContainer />} />
          <Route path="support" element={<SupportContainer />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
