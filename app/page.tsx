"use client";
import { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation"; // Importamos el componente
import { RegistrationForm } from "@/components/registration-form";
import Image from 'next/image';
import Head from 'next/head';

const phrases = [
  "La programación es como el arte, ¡crea lo que imaginas!",
  "Escribe código, no excusas.",
  "¡Haz de la programación tu superpoder!",
  "Todo código tiene su belleza, solo hay que verlo.",
  "La programación no se trata solo de escribir código, ¡se trata de resolver problemas!",
  "No te detengas hasta que estés orgulloso de lo que creas.",
];

const RandomPhrase = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  // Cambiar frase cada vez que termine de escribir una
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length); // Cambia la frase cada 4 segundos
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center space-y-4 mt-[-4px]">
      {/* Logo en formato SVG */}
      <div className="w-80 h-40">
        <Image src="/logo.svg" height={850} width={850} alt={"Academia Nova"} />
      </div>

      {/* Frase aleatoria con efecto de tipeo */}
      <TypeAnimation
        key={currentPhraseIndex} // Forzar el renderizado del componente cuando cambia el índice
        sequence={[
          phrases[currentPhraseIndex], // La frase actual
          1000, // Espera 1 segundo después de que termine la frase
        ]}
        wrapper="span"
        speed={80} // Velocidad de tipeo (en milisegundos)
        style={{ fontSize: "1.5em", color: "white", display: "inline-block" }} // Estilo personalizado
      />
    </div>
  );
};

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Head>
        <title>Admisiones | Academia Nova</title>
      </Head>
      <div className="flex w-full max-w-screen-xl relative">
        {/* Fondo con el efecto de mosaico y bordes iluminados */}
        <div className="absolute inset-0 bg-mosaic-pattern animate-lighting" />

        {/* Columna izquierda: Mantiene el tamaño fijo */}
        <div className="flex flex-col items-center justify-center w-1/2 space-y-4">
          <RandomPhrase />
        </div>

        {/* Columna derecha con el formulario: Ocupa el 50% */}
        <div className="w-1/2">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}
