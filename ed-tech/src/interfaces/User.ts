type Role = "creator" | "learner";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}
