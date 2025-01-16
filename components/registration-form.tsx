'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DatePicker } from "./ui/datepicker";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "./ui/countryselect";
import { BoxIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

type FormData = {
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date | string | undefined;
  nacionalidad: string;
  correo: string;
  celular: string;
};

export const RegistrationForm = () => {
  const { toast, showToast, clearToast } = useToast();
  const [selectedDialCode, setSelectedDialCode] = useState<string>('+52'); // Default to Mexico
  const [defaultCountry] = useState<string>('MX');
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [formValues, setFormValues] = useState<FormData>({
    nombres: "",
    apellidos: "",
    fechaNacimiento: undefined,
    nacionalidad: "",
    correo: "",
    celular: "",
  });
  const handleCountrySelect = (dialCode: string) => {
    setSelectedDialCode(dialCode);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formValues.nombres || !formValues.apellidos || !formValues.correo || !formValues.celular) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }

    try {
      // Check if the person is at least 8 years old
      if (selectedDate) {
        const today = new Date();
        let age = today.getFullYear() - selectedDate.getFullYear();
        const monthDifference = today.getMonth() - selectedDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < selectedDate.getDate())) {
          age--;
        }
        if (age < 8) {
          showToast({
            title: 'Edad insuficiente',
            description: 'Debes tener al menos 8 años para registrarte.',
            variant: 'destructive'
          });
          return;
        }
      }

      // Destructure to remove prefijoPais
      const { ...submissionData } = formValues;
      
      // Prepare the data for submission
      const finalSubmissionData = {
        ...submissionData,
        celular: selectedDialCode + formValues.celular,
        nacionalidad: defaultCountry
      };

      // Only add fechaNacimiento if it exists
      if (selectedDate) {
        finalSubmissionData.fechaNacimiento = selectedDate;
      }

      // Fetch API call
      const response = await fetch('/api/admission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalSubmissionData)
      });

      const result = await response.json();

      // Check if admission already exists
      const admissionExists = response.headers.get('X-Admission-Exists') === 'true';
      const admissionCode = response.headers.get('X-Admission-Code') || result.admission?.id;

      // Check if fechaNacimiento is set before showing success toast
      if (!finalSubmissionData.fechaNacimiento) {
        showToast({
          title: 'Campo incompleto',
          description: 'La fecha de nacimiento es obligatoria.',
          variant: 'destructive'
        });
        return;
      }

      showToast({
        title: admissionExists ? 'Admisión Existente' : 'Registro Exitoso',
        description: admissionExists 
          ? 'Ya has realizado tu admisión previamente' 
          : 'Tu código de admisión ha sido generado',
        variant: admissionExists ? 'warning' : 'success',
        admissionCode: admissionCode
      });

      // Reset form if it's a new admission
      if (!admissionExists) {
        setFormValues({
          nombres: "",
          apellidos: "",
          fechaNacimiento: undefined,
          nacionalidad: "",
          correo: "",
          celular: "",

        });
        setSelectedDate(undefined);
        setFormError(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast({
          title: "Error al Registrar",
          description: error.message || "Hubo un problema al registrar tu admisión.",
          variant: "destructive"
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date?: Date) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      fechaNacimiento: date,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <Toast toast={toast} onClose={clearToast} />
      <Card className="rounded-xl border-gray-700 text-card-foreground shadow bg-foreground">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-left text-white">
            Datos de admisión
          </CardTitle>
          <p className="text-sm text-muted-foreground">Llena tus datos en este formulario para registrarte.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombres" className="text-white">Nombres</Label>
              <Input
                type="text"
                id="nombres"
                name="nombres"
                placeholder="Jhon"
                value={formValues.nombres}
                onChange={handleChange}
                required
                className="text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-600 border-input focus:border-0"
              />
            </div>
            <div>
              <Label htmlFor="apellidos" className="text-white">Apellidos</Label>
              <Input
                type="text"
                id="apellidos"
                name="apellidos"
                placeholder="Doe"
                value={formValues.apellidos}
                onChange={handleChange}
                required
                className="text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-600 border-input focus:border-0"
              />
            </div>
            <div>
              <Label htmlFor="correo" className="text-white">Correo Electrónico</Label>
              <Input
                type="email"
                id="correo"
                name="correo"
                placeholder="jhondoe@email.com"
                value={formValues.correo}
                onChange={handleChange}
                required
                className="text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-600 border-input focus:border-0"
              />
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-24">
                <Label htmlFor="prefijoPais" className="text-white">Pais</Label>
                <CountrySelect onSelect={handleCountrySelect} defaultCountry={defaultCountry}/>
              </div>
              <div className="flex-1">
                <Label htmlFor="celular" className="text-white">Celular</Label>
                <Input
                  type="tel"
                  id="celular"
                  name="celular"
                  placeholder="1234567890"
                  value={formValues.celular}
                  onChange={handleChange}
                  required
                  className="text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-600 border-input focus:border-0"
                />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="fechaNacimiento" className="text-white">Fecha de Nacimiento</Label>
              <div className="mt-2">
                <DatePicker onDateSelect={handleDateChange} />
              </div>
            </div>
            {formError && <p className="text-red-500 text-center">{formError}</p>}
            <div className="flex items-center pt-4">
              <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full">
                <BoxIcon/>
                Aplicar
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
