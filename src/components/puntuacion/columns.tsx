
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Row } from "@tanstack/react-table";
import StarRating from "./star-rating";

export type Pelicula = {
  id: string;
  name: string;
  release_date: string;
  genero: string[];
  promedio: number | undefined;
  user_score: number | undefined;
};

export const columns: ColumnDef<Pelicula>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => (
      <div className="w-8 text-base">
        {row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="">Título</div>,
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-bold text-base">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "release_date",
    sortingFn: "datetime",
    header: ({ column }) => {
      return (
        <div
          className="max-w-[150px] pl-2 flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lanzamiento
          <ArrowUpDown className="ml-2 h-4 w-4 pt-[2px]" />
        </div>
      );
    },
    cell: ({ row }) => <div className="px-5">{row.getValue("release_date")}</div>,
  },
  {
    accessorKey: "genero",
    header: "Géneros",
    cell: ({ row }) => {
      const genero = row.getValue("genero") as string[];
      return <div className="max-w-[200px] truncate">{genero?.join(", ")}</div>;
    },
    filterFn: (row: Row<Pelicula>, columnId: string, filterValue: string[]) => {
      const genres = row.getValue(columnId) as string[];
      return filterValue.every((value: string) => genres.includes(value));
    },
  },
  {
    accessorKey: "promedio",
    sortingFn: "alphanumeric",
    header: ({ column }) => {
      return (
        <div
          className="ml-0 flex items-center pl-0 text-wrap w-40"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Puntaje general
          <ArrowUpDown className="ml-2 h-4 w-4 pt-[2px]" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] text-center truncate">
          {row.getValue("promedio")}
        </div>
      );
    },
  },
  {
    accessorKey: "user_score",
    sortingFn: "auto",
    sortUndefined: "last",
    invertSorting: true,
    header: ({ column }) => {
      return (
        <div
          className="ml-0 pl-2 flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Puntaje del usuario
          <ArrowUpDown className="ml-2 h-4 w-4 pt-[2px]" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        row.getValue("user_score") && (
          <StarRating
            currentRating={row.getValue("user_score")}
            onRatingChange={row.getValue("user_score")}
          />
        )
      );
    },
  },
];