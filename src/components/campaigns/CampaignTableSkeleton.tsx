import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function CampaignTableSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-4 py-3">
                <Skeleton className="w-4 h-4" />
              </th>
              <th className="text-left px-4 py-3">
                <Skeleton className="w-24 h-4" />
              </th>
              <th className="text-left px-4 py-3">
                <Skeleton className="w-16 h-4" />
              </th>
              <th className="text-center px-4 py-3">
                <Skeleton className="w-16 h-4" />
              </th>
              <th className="text-center px-4 py-3">
                <Skeleton className="w-12 h-4" />
              </th>
              <th className="text-center px-4 py-3">
                <Skeleton className="w-20 h-4" />
              </th>
              <th className="text-center px-4 py-3">
                <Skeleton className="w-16 h-4" />
              </th>
              <th className="text-center px-4 py-3">
                <Skeleton className="w-16 h-4" />
              </th>
              <th className="w-12 px-4 py-3">
                <Skeleton className="w-4 h-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-4">
                  <Skeleton className="w-4 h-4" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="w-4 h-4 mt-0.5" />
                    <div className="space-y-2">
                      <Skeleton className="w-40 h-4" />
                      <Skeleton className="w-24 h-3" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="w-32 h-4" />
                </td>
                <td className="px-4 py-4 text-center">
                  <Skeleton className="w-8 h-4" />
                </td>
                <td className="px-4 py-4 text-center">
                  <Skeleton className="w-8 h-4" />
                </td>
                <td className="px-4 py-4 text-center">
                  <Skeleton className="w-8 h-4" />
                </td>
                <td className="px-4 py-4 text-center">
                  <Skeleton className="w-8 h-4" />
                </td>
                <td className="px-4 py-4 text-center">
                  <Skeleton className="w-8 h-4" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="w-4 h-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
