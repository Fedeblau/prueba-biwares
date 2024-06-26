import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./filtro";
import StarRating from "./star-rating";
import { DataTablePagination } from "./datatable-pagination";

export const DataTable = ({ columns, data: initialData }) => {
  const [data, setData] = React.useState(initialData);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [editingRowId, setEditingRowId] = React.useState(null);
  const [newUserScore, setNewUserScore] = React.useState(0);

  const generos = [
    { label: "Action", value: "Action" },
    { label: "Adventure", value: "Adventure" },
    { label: "Animation", value: "Animation" },
    { label: "Children's", value: "Children's" },
    { label: "Comedy", value: "Comedy" },
    { label: "Crime", value: "Crime" },
    { label: "Documentary", value: "Documentary" },
    { label: "Drama", value: "Drama" },
    { label: "Fantasy", value: "Fantasy" },
    { label: "Film-Noir", value: "Film-Noir" },
    { label: "Horror", value: "Horror" },
    { label: "Musical", value: "Musical" },
    { label: "Mystery", value: "Mystery" },
    { label: "Romance", value: "Romance" },
    { label: "Sci-Fi", value: "Sci-Fi" },
    { label: "Thriller", value: "Thriller" },
    { label: "War", value: "War" },
    { label: "Western", value: "Western" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleEdit = (rowId, currentScore) => {
    setEditingRowId(rowId);
    setNewUserScore(currentScore);
  };

  const handleDelete = (rowId) => {
    setEditingRowId(rowId);
    setNewUserScore(null);
  };

  const handleSave = (rowId) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id - 1 == rowId ? { ...row, user_score: newUserScore } : row
      )
    );
    setEditingRowId(null);
  };

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Busca una película"
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-3/12 h-10 text-base mr-4 bg-slate-900 pl-2"
        />
        {table.getColumn("genero") && (
          <DataTableFacetedFilter
            column={table.getColumn("genero")}
            title="Género"
            options={generos}
          />
        )}
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full flex flex-col">
          <TableHeader className="flex w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="flex-1 min-w-[150px] p-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
                <TableHead className="flex-1 min-w-[150px] p-2"></TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="flex flex-col w-full">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="flex w-full" data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="flex-1 min-w-[150px] p-2">
                      {cell.column.id === "user_score" && row.id === editingRowId ? (
                        <StarRating
                          isEditing={editingRowId}
                          currentRating={newUserScore}
                          onRatingChange={setNewUserScore}
                        />
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="flex-1 min-w-[150px] p-2">
                    {row.id === editingRowId ? (
                      <Button variant="borde" className="h-8 w-full px-4" onClick={() => handleSave(row.id)}>
                        Guardar Puntaje
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button variant="borde" className="h-8 w-full px-4" onClick={() => handleEdit(row.id, row.getValue("user_score"))}>
                          {row.getValue("user_score") ? "Cambiar puntaje" : "Puntuar"}
                        </Button>
                        <Button className="h-8 px-4" onClick={() => handleDelete(row.id)}>X</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="flex w-full">
                <TableCell colSpan={columns.length + 1} className="h-24 text-center flex-1 min-w-[150px] p-2">
                  sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </>
  );
};