/* eslint-disable @typescript-eslint/no-explicit-any */

import nodemailer from 'nodemailer'
import { envVerse } from '../../config/env'
import AppError from '../errorHelpers/AppError'
import status from 'http-status'
import path from "path"
import ejs from "ejs"

const transporter = nodemailer.createTransport({

    host: envVerse.EMAIL_SENDER.SMTP_HOST,
    secure : true,
    
    auth : {
        user : envVerse.EMAIL_SENDER.SMTP_USER,
        pass : envVerse.EMAIL_SENDER.SMTP_PASS
    },
        
    port : Number(envVerse.EMAIL_SENDER.SMTP_PORT),
})


interface sendEmailOptions {
    to : string,
    subject : string,
    templateName : string,
    templateData : Record<string, any>,
    attachments? : {
        fileName: string,
        content: Buffer | string,
        contentType: string,
    }[]
}



export const sendEmail = async ({to, subject, templateData, templateName, attachments} : sendEmailOptions) => {

    try {
        
    const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);

    const html = await ejs.renderFile(templatePath, templateData);


    const info = await transporter.sendMail({
        from : envVerse.EMAIL_SENDER.SMTP_PASS,
        to : to,
        subject : subject,
        html : html,
        attachments : attachments?.map((att) => ({
            filename : att.fileName,
            content : att.content,
            contentType : att.contentType,
        }))
    })

    console.log(`Email sent to : ${to} : ${info.messageId} `);

    } catch (error:any) {
        console.log("Email sending error", error.message);
        
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email!")
    }
}