export interface DocumentSubmission {
  id: number;
  type: number;
  user_id: number;
  status: number;
  stage: number;
  created_at: string;
  updated_at: string;
  status_name: string;
  type_name: string;
  stage_name: string;
  document_attachments: DocumentAttachment[];
  document_progresses: any[];
  user: any;
}

export interface DocumentAttachment {
  id: number;
  document_submission_id: number;
  document_type: string;
  file_path: string;
  created_at: string;
  updated_at: string;
}
