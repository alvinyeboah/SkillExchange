import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, LinkIcon, Upload, ArrowRight } from "lucide-react";

interface ServiceSubmissionFormProps {
  requestId: number;
  onSubmit: any;
  isSubmitting: boolean;
  status: string;
}

const ServiceSubmissionForm: React.FC<ServiceSubmissionFormProps> = ({ 
  requestId, 
  onSubmit, 
  isSubmitting,
  status 
}) => {
  const [submissionType, setSubmissionType] = useState<"file" | "link">("file");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string>("");

  const handleSubmit = () => {
    const submissionContent = submissionType === "file" ? file : link;
    if (submissionContent) {
      onSubmit(requestId, submissionType, submissionContent);
    }
  };

  if (status === "submitted") {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 dark:text-green-400 font-medium">Work submitted successfully!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          variant={submissionType === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setSubmissionType("file")}
        >
          <FileText className="w-4 h-4 mr-2" />
          File Upload
        </Button>
        <Button
          variant={submissionType === "link" ? "default" : "outline"}
          size="sm"
          onClick={() => setSubmissionType("link")}
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Submit Link
        </Button>
      </div>

      {submissionType === "file" ? (
        <div>
          <Label htmlFor={`file-${requestId}`} className="block text-sm font-medium mb-2">
            Upload your work
          </Label>
          <Input
            id={`file-${requestId}`}
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-auto"
          />
        </div>
      ) : (
        <div>
          <Label htmlFor={`link-${requestId}`} className="block text-sm font-medium mb-2">
            Submit link to your work
          </Label>
          <Input
            id={`link-${requestId}`}
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com/your-work"
            className="w-full"
          />
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || (!file && !link)}
        className="w-full mt-4"
      >
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            Submit Work
            {file || link ? (
              <Upload className="ml-2 h-4 w-4" />
            ) : (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </>
        )}
      </Button>
    </div>
  );
};

export default ServiceSubmissionForm;