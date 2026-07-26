import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "",
    port : "",
    secure : true,
})