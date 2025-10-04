import type { List } from "lodash";

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

type ConferenceXAttendeeDto = {
  id: number;
  attendeeEmail: string;
  statusName: string;
};

type ConferenceDto = {
  id: number;
  conferenceTypeName: string;
  locationName: string;
  countryName: string;
  countyName: string;
  cityName: string;
  name: string;
  organizerEmail: string;
  categoryName: string;
  startDate: Date;
  endDate: Date;
  mainSpeakerName: string;
  attendeesList: List<ConferenceXAttendeeDto>;
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
  ConferenceXAttendeeDto
};
