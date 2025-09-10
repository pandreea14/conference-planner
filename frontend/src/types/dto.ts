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

export type {
  SystemVersionDto,
  UserDto,
  UserGroupDto,
  MenuItemDto,
  InitializationParamDto,
  InitializationParamValue,
  AsyncCommandResult,
  CommandExecutionError
};
