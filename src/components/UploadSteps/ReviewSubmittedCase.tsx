import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ReviewSubmittedCase() {
  return (
    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Already submitted a case?
          </h4>
          <p className="text-xs text-blue-600 dark:text-blue-300">
            Review your submission, add additional information, or request
            changes
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/review-case">Review Submitted Case</Link>
        </Button>
      </div>
    </div>
  );
}
