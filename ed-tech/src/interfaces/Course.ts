export interface CourseSection {
  id: number;
  title: string;
  videoUrl: string;
  duration: string;
}

export interface Course {
  title: string;
  description: string;
  price: string;
  thumbnailUrl: string;
  created_at: string;
  updated_at: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  sections: CourseSection[];
}
