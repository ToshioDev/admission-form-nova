import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

function generateAdmissionId(nombres: string, apellidos: string, fechaNacimiento: string | Date | null): string {
    // Extract first part of name and first letters of surnames
    const nombrePrimera = nombres.charAt(0).toUpperCase();
    const nombreResto = nombres.substring(1, 3).toLowerCase();
    const apellidoPrimeraLetra = apellidos.charAt(0).toUpperCase();

    // Generate random number
    const randomNum = Math.floor(Math.random() * 10).toString();

    // Get day of birth
    let birthdayDay = '00';
    if (fechaNacimiento) {
        const birthDate = fechaNacimiento instanceof Date 
            ? fechaNacimiento 
            : new Date(fechaNacimiento);
        birthdayDay = birthDate.getDate().toString().padStart(2, '0');
    }

    // Create base ID string
    const baseId = `${nombrePrimera}${nombreResto}${apellidoPrimeraLetra}${randomNum}${birthdayDay}`;

    // Convert base ID to buffer
    const baseBuffer = Buffer.from(baseId, 'utf8');

    // Create a 12-byte buffer
    const idBuffer = Buffer.alloc(12);
    
    // Copy base ID to start of buffer
    baseBuffer.copy(idBuffer, 0, 0, Math.min(baseBuffer.length, 12));

    // If base ID is shorter than 12 bytes, fill the rest with random bytes
    if (baseBuffer.length < 12) {
        const randomPart = randomBytes(12 - baseBuffer.length);
        randomPart.copy(idBuffer, baseBuffer.length);
    }

    // Convert to hex string
    return idBuffer.toString('hex');
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Validate required fields
        if (!data.nombres || !data.apellidos || !data.correo) {
            return NextResponse.json({ 
                message: 'Missing required fields', 
                requiredFields: ['nombres', 'apellidos', 'correo']
            }, { status: 400 });
        }

        // Check if user has already been admitted
        const existingAdmission = await prisma.admission.findFirst({
            where: {
                OR: [
                    { correo: data.correo },
                    { 
                        nombres: data.nombres, 
                        apellidos: data.apellidos, 
                        fechaNacimiento: new Date(data.fechaNacimiento)
                    }
                ]
            }
        });

        // If user already exists, return their existing admission code
        if (existingAdmission) {
            return NextResponse.json({ 
                message: 'Ya has realizado tu admisión previamente', 
                admission: existingAdmission 
            }, { 
                status: 200,
                headers: {
                    'X-Admission-Code': existingAdmission.id,
                    'X-Admission-Exists': 'true'
                }
            });
        }

        // Convert fechaNacimiento to Date if it's a string
        const fechaNacimientoDate = data.fechaNacimiento 
            ? new Date(data.fechaNacimiento) 
            : null;

        // Create admission
        const admission = await prisma.admission.create({
            data: {
                ...data,
                fechaNacimiento: fechaNacimientoDate,
                id: generateAdmissionId(data.nombres, data.apellidos, fechaNacimientoDate)
            }
        });

        return NextResponse.json({ 
            message: 'Admission created successfully', 
            admission 
        }, { 
            status: 201,
            headers: {
                'X-Admission-Code': admission.id
            }
        });
    } catch (error) {
        console.error('Admission creation error:', error);
        return NextResponse.json({ 
            message: 'Error creating admission', 
            error: error instanceof Error ? error.message : String(error) 
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const admissions = await prisma.admission.findMany();
        return NextResponse.json(admissions);
    } catch (error) {
        console.error('Error fetching admissions:', error);
        return NextResponse.json({ 
            message: 'Error fetching admissions', 
            error: error instanceof Error ? error.message : String(error) 
        }, { status: 500 });
    }
}
