

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export default function PaginationComponent({groupSize = 7, totalPages,currentPage = 1,setCurrentPage}:{groupSize: number, totalPages: number, currentPage: number,setCurrentPage: React.Dispatch<React.SetStateAction<number>>})
{
  const currentGroup = Math.floor((currentPage - 1) / groupSize);

  const start = currentGroup * groupSize + 1;
  const end = Math.min(start + groupSize - 1, totalPages);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <Pagination>
      <PaginationContent>

        {/* First page */}
        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => setCurrentPage(1)}>
                1
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                onClick={() => setCurrentPage(start - groupSize)}
                className="cursor-pointer"
              >
                ...
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Pages */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink className="cursor-pointer"
              isActive={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Last page */}
        {end < totalPages && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => setCurrentPage(end + 1)}
                className="cursor-pointer"
              >
                ...
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

      </PaginationContent>
    </Pagination>
  );
}