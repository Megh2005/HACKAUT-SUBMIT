type ActionStatus = "SUCCESS" | "ERROR";

export interface ActionResponse {
  status: ActionStatus;
  message: string;
  data: any;
}
