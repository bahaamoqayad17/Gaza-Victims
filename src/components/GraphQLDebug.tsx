import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_CASES } from "@/graphql/queries";

const GraphQLDebug: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ALL_CASES);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold mb-4">GraphQL Debug Info</h3>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </div>

        <div>
          <strong>Error:</strong> {error ? error.message : "None"}
        </div>

        <div>
          <strong>Has Data:</strong> {data ? "Yes" : "No"}
        </div>

        {data && (
          <div>
            <strong>Cases Count:</strong> {data.cases?.length || 0}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
            <strong>Error Details:</strong>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {data && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
            <strong>Data Preview:</strong>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphQLDebug;
