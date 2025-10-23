type SystemVersionDto = {
  version: string;
  buildDate: string;
};

type UserGroupDto = {
  userGroupId: number;
  userGroupName: string;
};

type MenuItemDto = {
  itemName: string;
  canRead: boolean;
  canWrite: boolean;
  orderNo: number | null;
};

type UserDto = {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  groups: UserGroupDto[];
  menuItems: MenuItemDto[];
};

type DictionaryItem = {
  id: number;
  code: string;
  name: string;
};

type InitializationParamValue = string | number | boolean | Date | null;

type InitializationParamDto = {
  paramName: string;
  value: InitializationParamValue;
  type: string;
};

type AsyncCommandResult = {
  commandId: string;
  correlationId?: string;
};

type CommandExecutionError = {
  code: string;
  type: string;
  data: Record<string, unknown>;
};

type ConferenceDto = {
  id: number;
  conferenceTypeId?: number;
  conferenceTypeCode?: string;
  categoryId?: number;
  categoryCode?: string;
  locationId?: number;
  location?: LocationDto;
  speakerList?: SpeakerDto[];
  conferenceTypeName: string;
  locationName: string;
  countryName: string;
  countyName: string;
  cityName: string;
  name: string;
  organizerEmail: string;
  categoryName: string;
  startDate: string;
  endDate: string;
  // mainSpeakerName: string;
  attendeesList: ConferenceXAttendeeDto[];
  speakersList: ConferenceXSpeakerDto[];
  joinUrl: string;
};

type ConferenceXSpeakerDto = {
  id: number;
  speakerName: string;
  isMainSpeaker: boolean;
  rating: number;
};

type ConferenceFilterState = {
  name: string;
  location: string;
  dateStart: string;
  email: string;
  conferenceType: string[];
  speakerName: string[];
};

type SpeakerResponseDto = {
  id: number;
  name: string;
  nationality: string;
  rating: number;
  image?: string | null;
};

type SpeakerDto = {
  conferenceSpeakerId: number;
  speakerId: number;
  name: string;
  nationality: string;
  rating: number;
  image?: string | null;
  isMainSpeaker: boolean;
};

type LocationDto = {
  locationId: number;
  name: string;
  code: string;
  address: string;
  countryId: number;
  countyId: number;
  cityId: number;
  latitude: number;
  longitude: number;
};

type SaveConferenceDto = {
  id: number;
  conferenceTypeId: number;
  locationId: number;
  location: LocationDto;
  organizerEmail: string;
  categoryId: number;
  startDate: string;
  endDate: string;
  name: string;
  speakerList: SpeakerDto[];
};

type ConferenceXAttendeeDto = {
  id: number;
  attendeeEmail: string;
  statusName: string;
  conferenceId?: number;
  statusId?: number;
  status?: DictionaryItem;
};

type FeedbackDto = {
  id: number;
  conferenceId: number;
  speakerId: number;
  attendeeEmail: string;
  rating: number;
  message: string;
};

export type {
  SystemVersionDto,
  UserDto,
  UserGroupDto,
  MenuItemDto,
  InitializationParamDto,
  InitializationParamValue,
  AsyncCommandResult,
  CommandExecutionError,
  DictionaryItem,
  ConferenceDto,
  ConferenceXAttendeeDto,
  ConferenceFilterState,
  SpeakerDto,
  SaveConferenceDto,
  LocationDto,
  SpeakerResponseDto,
  FeedbackDto
};
