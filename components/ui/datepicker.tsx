import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

// Agrega un prop para pasar la función del padre
interface DatePickerProps {
  onDateSelect: (date: Date | undefined) => void
}

export function DatePicker({ onDateSelect }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    // Llamamos a la función que se pasó desde el componente padre
    onDateSelect(selectedDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal border", 
            "bg-transparent", // Elimina el fondo
            "text-white", // Texto blanco por defecto
            "hover:text-gray-600", // Texto gris tenue al hacer hover
            !date && "text-muted-foreground" // Cambia el color de texto si no hay fecha
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={date}
          onSelect={handleDateSelect}
          fromYear={1960}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  )
}
