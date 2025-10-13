import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutShell from "./LayoutShell";
import NotFound from "./NotFound";
import Unauthorized from "./Unauthorized";
import HomeContainer from "../../features/home/HomeContainer";
import SettingsContainer from "../../features/settings/SettingsContainer";
import NotificationsContainer from "../../features/notifications/NotificationsContainer";
import SupportContainer from "../../features/support/SupportContainer";
import ConferencesContainer from "features/conferences/components/ConferencesContainer";
import SaveConferenceContainer from "features/conferences/components/SaveConferenceContainer";
import ConferenceDetailsContainer from "features/conferences/components/ConferenceDetailsContainer";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutShell />}>
          <Route index element={<HomeContainer />} />
          <Route path="conferences" element={<ConferencesContainer />} />
          <Route path="conferences/new" element={<SaveConferenceContainer />} />
          <Route path="conferences/edit/:id" element={<SaveConferenceContainer />} />
          <Route path="conferences/details/:id" element={<ConferenceDetailsContainer />} />
          <Route path="conferencesAttendees" element={<ConferencesContainer />} />
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
