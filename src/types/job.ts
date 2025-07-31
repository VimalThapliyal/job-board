export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  applyUrl: string;
  postedDate: string;
  logo?: string;
  tags?: string[];
  experience?: string;
  skills?: string[];
}
