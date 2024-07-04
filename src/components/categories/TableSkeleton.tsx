import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export const TableSkeleton = () => {
  return (
    <Table>
      <TableBody>
        {Array.from({ length: 6 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="w-[50px] h-[50px]" />
            </TableCell>
            <TableCell className="w-full">
              <Skeleton className="w-full h-[50px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-[50px] h-[50px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
