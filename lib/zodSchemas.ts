import z from "zod";

export const courseCategories = [
    "Developpement",
    "Business",
    "Finance",
    "It & software",
    "Office productifyty",
    "Personal Developpement",
    "Design",
    "Marketing",
    "Health & Fitness",
    "Teaching & Academics"
] as const

export const CourseLevel = [
    "Beginner",
    "Intermediaire",
    "Advanced"
] as const
export const CourseStatus = [
    "Draft",
    "Published",
    "Archived"
] as const

export const coursesSchema = z.object({
    title: z.string().min(3, { message: 'Le titre doit comporter au moins 3 caractères' }).max(100, { message: "Le titre ne doit pas dépasser 100 caractères" }),
    description: z.string().min(3, { message: 'La description doit comporter au moins 3 caractères' }),
    fileKey: z.string().min(1, { message: 'le fichier est requis' }),
    
    // price: z.number().min(1, { message: "Le prix doit être un nombre positif" }),
    // duration: z.number().min(1, { message: "La durée doit être au moins 1 heure" }).max(200, { message: 'La durée ne doit pas dépassé 200 heures' }),
    price: z.coerce.number().min(1, { message: "Le prix doit être un nombre positif" }),
    duration: z.coerce.number().min(1, { message: "La durée doit être au moins 1 heure" }),

    level: z.enum(CourseLevel, { message: "Le niveau est requis" }),
    category: z.enum(courseCategories, { message: "La catégorie est requise" }),
    smallDescription: z.string().min(3, { message: 'Cette description doit comporter au moins 3 caractères' }).max(200, { message: 'Cette description ne doit pas dépassé 200 caractères' }),
    slug: z.string().min(3, { message: "ce champ doit avoir au moins 3 caractères" }),
    status: z.enum(CourseStatus, { message: "le status est requis" })
})

export type CourseSchemaType = z.infer<typeof coursesSchema>;