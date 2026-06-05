import {z} from "zod";

export const SignupSchema = z.object({
    email:z.string().min(5),
    password:z.string().min(6),
    name:z.string().min(3)
})

export const SigninSchema = z.object({
    email : z.string(),
    password : z.string()
})

export const ZapCreateSchema = z.object({
    availtriggerId : z.string(),
    triggerMetadata : z.any().optional(),
    actions: z.array(z.object({
        availActionId : z.string(),
        actionMetadata:z.any().optional()
    }))
})
