import { defineCollection, z } from 'astro:content';

const vacantes = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    titulo: z.string(),
    area: z.string(),
    tipo: z.enum(['Tiempo completo', 'Por proyecto', 'Medio tiempo']),
    ubicacion: z.string().default('Ciudad de México / Remoto'),
    salarioMin: z.number(),
    salarioMax: z.number(),
    destacada: z.boolean().default(false),
    activa: z.boolean().default(true),
    fechaPublicacion: z.date(),
    resumen: z.string(),
  }),
});

const talento = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    categoria: z.string(),
    fechaPublicacion: z.date(),
    tiempoLectura: z.number(),
    imagen: z.string().optional(),
  }),
});

export const collections = { vacantes, talento };
