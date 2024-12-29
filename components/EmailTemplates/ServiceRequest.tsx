import * as React from 'react';
import { format } from 'date-fns';
import { Calendar, FileText, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceRequestTemplateProps {
  requestId: string;
  requirements?: string;
  deadline?: string;
  clientName: string;
  projectTitle: string;
}

export const ServiceRequestTemplate: React.FC<ServiceRequestTemplateProps> = ({
  requestId,
  requirements,
  deadline,
  clientName,
  projectTitle,
}) => {
  const formattedDeadline = deadline ? format(new Date(deadline), 'PPP') : 'No deadline specified';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="mb-2">New Request</Badge>
          <span className="text-sm text-muted-foreground">ID: {requestId}</span>
        </div>
        <CardTitle className="text-2xl">New Service Request</CardTitle>
        <CardDescription>
          You have received a new service request from {clientName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{projectTitle}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Received on {format(new Date(), 'PPP')}</span>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium flex items-center">
            <FileText className="mr-2 h-4 w-4" /> Requirements
          </h4>
          <p className="text-sm">{requirements || 'No specific requirements provided'}</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium flex items-center">
            <Clock className="mr-2 h-4 w-4" /> Deadline
          </h4>
          <p className="text-sm">{formattedDeadline}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Please respond to this request as soon as possible.
        </p>
        <Button className="ml-2">
          <ExternalLink className="mr-2 h-4 w-4" />
          View Request
        </Button>
      </CardFooter>
    </Card>
  );
};

