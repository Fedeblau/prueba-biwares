"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Row } from '@tanstack/react-table'



export type Pelicula = {
  id: string
  name: string
  release_date: string
  genero: string[]
  promedio: number
  user_score: number | null
}



 
export const columns: ColumnDef<Pelicula>[] = [
  {
    accessorKey: "id",
    header: "Id"
  },  
  {
    accessorKey: "name",
    header: () => <div className="">Título</div>,
    cell: ({row}) => <div className="max-w-[200px] truncate font-bold text-base">{row.getValue("name")}</div>
  },
  {
    accessorKey: "release_date",
    sortingFn: 'datetime',
    header: ({ column }) => {
      return (
        <Button
          className=""
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha De Lanzamiento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row}) => <div className="px-5">{row.getValue("release_date")}</div>
  },
  {
    accessorKey: "genero",
    header: "Géneros",
    cell: ({ row }) => {
      const genero = row.getValue("genero") as string[]; // Assert the type here
      return (
        <div className="max-w-[200px] truncate">
          {genero?.join(', ')}
        </div>
      )},
      filterFn: (row: Row<Pelicula>, columnId: string, filterValue: string[]) => {
        const genres = row.getValue(columnId) as string[];
        return filterValue.every((value: string) => genres.includes(value));
      },
  },
  {
    accessorKey: "promedio",
    header: "puntaje general",
  },
  {
    accessorKey: "user_score",
    header: "puntaje del usuario",
  },

]