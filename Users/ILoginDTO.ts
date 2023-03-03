import Joi from 'joi'

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

interface ILoginDTO {
    email: string;
    password: string;
}

export default ILoginDTO