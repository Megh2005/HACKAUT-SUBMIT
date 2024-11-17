export interface Purchase {
  transactionId: string;
  purchasedBy: string;
  courseId: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  created_at: string;
}
