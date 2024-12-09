import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createGlobalStyle } from 'styled-components'
import Image from 'next/image'

const GlobalStyle = createGlobalStyle`
  .country-flag {
    font-family: "Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", sans-serif;
  }
  
  .select-trigger svg {
    color: white !important;
  }
`

const latinAmericanCountries = [
  { code: 'AR', name: 'Argentina', flag: '/flags/ar.svg', dialCode: '+54' },
  { code: 'BO', name: 'Bolivia', flag: '/flags/bo.svg', dialCode: '+591' },
  { code: 'BR', name: 'Brasil', flag: '/flags/br.svg', dialCode: '+55' },
  { code: 'CL', name: 'Chile', flag: '/flags/cl.svg', dialCode: '+56' },
  { code: 'CO', name: 'Colombia', flag: '/flags/co.svg', dialCode: '+57' },
  { code: 'CR', name: 'Costa Rica', flag: '/flags/cr.svg', dialCode: '+506' },
  { code: 'CU', name: 'Cuba', flag: '/flags/cu.svg', dialCode: '+53' },
  { code: 'DO', name: 'República Dominicana', flag: '/flags/do.svg', dialCode: '+1' },
  { code: 'EC', name: 'Ecuador', flag: '/flags/ec.svg', dialCode: '+593' },
  { code: 'SV', name: 'El Salvador', flag: '/flags/sv.svg', dialCode: '+503' },
  { code: 'GT', name: 'Guatemala', flag: '/flags/gt.svg', dialCode: '+502' },
  { code: 'HN', name: 'Honduras', flag: '/flags/hn.svg', dialCode: '+504' },
  { code: 'MX', name: 'México', flag: '/flags/mx.svg', dialCode: '+52' },
  { code: 'NI', name: 'Nicaragua', flag: '/flags/ni.svg', dialCode: '+505' },
  { code: 'PA', name: 'Panamá', flag: '/flags/pa.svg', dialCode: '+507' },
  { code: 'PY', name: 'Paraguay', flag: '/flags/py.svg', dialCode: '+595' },
  { code: 'PE', name: 'Perú', flag: '/flags/pe.svg', dialCode: '+51' },
  { code: 'PR', name: 'Puerto Rico', flag: '/flags/pr.svg', dialCode: '+1' },
  { code: 'UY', name: 'Uruguay', flag: '/flags/uy.svg', dialCode: '+598' },
  { code: 'VE', name: 'Venezuela', flag: '/flags/ve.svg', dialCode: '+58' },
]

interface CountrySelectProps {
  onSelect: (dialCode: string) => void
  defaultCountry: string
}

export function CountrySelect({ onSelect, defaultCountry }: CountrySelectProps) {
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return latinAmericanCountries.find(c => c.code === defaultCountry) || latinAmericanCountries.find(c => c.code === 'MX')!
  })

  const handleSelect = (value: string) => {
    const country = latinAmericanCountries.find(c => c.code === value)
    if (country) {
      setSelectedCountry(country)
      onSelect(country.dialCode)
    }
  }

  return (
    <>
      <GlobalStyle />
      <Select onValueChange={handleSelect} defaultValue={selectedCountry.code}>
        <SelectTrigger className="w-[80px] h-10 bg-transparent border-2 border-white/20 rounded-md hover:border-white/40 focus:border-white/60 transition-colors [&>svg]:text-white select-trigger">
          <SelectValue>
            <span className="flex items-center justify-between text-white">
              <Image src={selectedCountry.flag} alt={`Bandera de ${selectedCountry.name}`} width={24} height={16} className="mr-2" />
              <span className="sr-only">{selectedCountry.name}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {latinAmericanCountries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center">
                <Image src={country.flag} alt={`Bandera de ${country.name}`} width={24} height={16} className="mr-2" />
                <span>{country.name} ({country.dialCode})</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}

